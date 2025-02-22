import os
import time
import pandas as pd
import numpy as np
import nltk
from nltk.tokenize import word_tokenize
from tqdm.auto import tqdm
from sklearn.feature_extraction.text import TfidfVectorizer


from pinecone import Pinecone, ServerlessSpec, PineconeApiException  # Import Pinecone and ServerlessSpec and PineconeApiException

# Pinecone API Key and Environment
PINECONE_API_KEY = os.environ.get("PINECONE_API_KEY") or input("Pinecone API Key: ")
#PINECONE_ENVIRONMENT = os.environ.get("PINECONE_ENVIRONMENT") or input("Pinecone Environment: ") # No longer needed
PINECONE_INDEX_NAME = "spotify-music-index"  # Replace with your index name

pd.set_option("max_colwidth", 1000)
pd.options.mode.chained_assignment = None
csv_path = "spotify_data_with_image_features.csv"
df_raw = pd.read_csv(csv_path)

print("Initial DataFrame shape:", df_raw.shape)
print(df_raw.head(3))
nltk.download('punkt')

# Choose text/categorical columns to embed. Adjust as you see fit.
text_cols = [
    "name",
    "artist",
    "track_name",
    "album",
    "artists"
    # more optional
]

# Combine them into one column, dropping NAs
df_raw["text_concat"] = df_raw[text_cols].fillna("").apply(lambda row: " ".join(row.astype(str)), axis=1)

# Tokenize
tokenized_text = [word_tokenize(txt.lower()) for txt in df_raw["text_concat"]]

if not tokenized_text:
    print("No text to tokenize. Exiting.")
    exit()

# Convert tokenized text back to sentences for TF-IDF
sentences = [" ".join(tokens) for tokens in tokenized_text]

# Train a TF-IDF model
embedding_dim = 15  # Adjust as needed
tfidf_vectorizer = TfidfVectorizer(
    max_features=embedding_dim,  # Adjust as needed
    min_df=1,
)
tfidf_matrix = tfidf_vectorizer.fit_transform(sentences)

def embed_text(index, tfidf_matrix, dim):
    """Retrieve TF-IDF vector for a document."""
    vector = tfidf_matrix[index].toarray().flatten()
    if len(vector) == 0:
        return np.zeros(dim)
    return vector

text_embeddings = [embed_text(i, tfidf_matrix, embedding_dim) for i in range(len(sentences))]

# ------------------------------------------------------------------------------
# 2. Prepare numeric columns
# ------------------------------------------------------------------------------
# List all numeric columns in your CSV that you'll use in the vector.
# Skipping columns like "dominant_colors", "edge_map_shape", etc. because they're not standard numeric. for now
num_cols = [
    "danceability","energy","loudness","speechiness","acousticness","instrumentalness",
    "liveness","valence","acousticness_artist","danceability_artist","energy_artist",
    "instrumentalness_artist","liveness_artist","speechiness_artist","valence_artist",
    "track_number","disc_number","explicit","key","mode","tempo","duration_ms",
    "time_signature","year","single_pixel_color_r","single_pixel_color_g","single_pixel_color_b",
    "weighted_average_color_r","weighted_average_color_g","weighted_average_color_b",
    "most_vibrant_color_r","most_vibrant_color_g","most_vibrant_color_b","color_temperature",
    "color_brightness","overall_lightness"
]

# Remove 'dominant_colors' from num_cols if it's present
if 'dominant_colors' in num_cols:
    num_cols.remove('dominant_colors')

# Identify columns for one-hot encoding
one_hot_encode_cols = ["key", "mode", "color_temperature", "color_brightness", "overall_lightness"]

# Filter out columns that might be missing or non-numeric
num_cols_filtered = [c for c in num_cols if c in df_raw.columns and c not in one_hot_encode_cols]
df_numeric = df_raw[num_cols_filtered].copy()

# Replace missing with 0
df_numeric.fillna(0, inplace=True)

# Scale numeric columns
for c in num_cols_filtered:
    stdev = df_numeric[c].std()
    if stdev == 0:
        df_numeric[c] = 0
    else:
        df_numeric[c] = (df_numeric[c] - df_numeric[c].mean()) / stdev

# One-hot encode the specified columns
df_one_hot = pd.get_dummies(df_raw[one_hot_encode_cols].fillna("None"), columns=one_hot_encode_cols, dummy_na=False)

# Combine the numeric and one-hot encoded dataframes
df_combined = pd.concat([df_numeric, df_one_hot], axis=1)

numeric_embeddings = df_combined.values.tolist()

# ------------------------------------------------------------------------------
# 3. Merge text and numeric embeddings
# ------------------------------------------------------------------------------
row_embeddings = [
    np.concatenate([txt_emb, np.array(num_emb)])
    for txt_emb, num_emb in zip(text_embeddings, numeric_embeddings)
]

embedded_df = pd.DataFrame({
    "song_id": df_raw["id"].fillna(""),
    "song_name": df_raw["name"].fillna("Unknown"),
    "song_artist": df_raw["artist"].fillna("Unknown"),
    "song_year": df_raw["year"].fillna(0),
    "song_embeddings": row_embeddings
})

print("Embedded DataFrame shape:", embedded_df.shape)
print(embedded_df.head(3))

# ------------------------------------------------------------------------------
# 4. Initialize Pinecone
# ------------------------------------------------------------------------------
#pinecone.init(api_key=PINECONE_API_KEY, environment=PINECONE_ENVIRONMENT) # Old init

# New Init
pc = Pinecone(api_key=PINECONE_API_KEY)

# Check if the index exists, create if it doesn't
if PINECONE_INDEX_NAME not in pc.list_indexes():
    dimension = len(row_embeddings[0])  # Determine the dimension of your vectors
    #pinecone.create_index(PINECONE_INDEX_NAME, dimension=dimension, metric="euclidean") # Old create index
    try:
        pc.create_index(
            name=PINECONE_INDEX_NAME,
            dimension=dimension,  # Replace with your model dimensions
            metric="cosine",  # Or "euclidean", depending on your needs
            spec=ServerlessSpec(
                cloud="aws",
                region="us-east-1"  # Choose the region closest to you
            )
        )
        print(f"Creating Pinecone index '{PINECONE_INDEX_NAME}'...")
        time.sleep(60)  # Wait for index initialization (adjust as needed)
    except PineconeApiException as e:
        if e.status == 409:
            print(f"Index '{PINECONE_INDEX_NAME}' already exists. Skipping creation.")
        else:
            raise e  # Re-raise the exception if it's not a conflict

index = pc.Index(PINECONE_INDEX_NAME) #pinecone.Index(PINECONE_INDEX_NAME) # Old index init

# ------------------------------------------------------------------------------
# 5. Upsert data to Pinecone
# ------------------------------------------------------------------------------
batch_size = 100  # Adjust based on your Pinecone plan's limits

# Filter out rows with empty song_id
embedded_df_filtered = embedded_df[embedded_df["song_id"] != ""]

for i in tqdm(range(0, len(embedded_df_filtered), batch_size)):
    i_end = min(len(embedded_df_filtered), i + batch_size)
    batch = embedded_df_filtered.iloc[i:i_end]
    to_upsert = [(row["song_id"], row["song_embeddings"].tolist(), {
                    "song_name": row["song_name"],
                    "song_artist": row["song_artist"],
                    "song_year": row["song_year"]
                    }) for _, row in batch.iterrows()]
    index.upsert(vectors=to_upsert)

print(f"Upserted {len(embedded_df_filtered)} vectors to Pinecone index '{PINECONE_INDEX_NAME}'.")

# ------------------------------------------------------------------------------
# 6. Example searching for a song by name, retrieving its embedding, finding nearest neighbors
# ------------------------------------------------------------------------------
def find_similar_songs(index, song_name: str, n_similar=5):
    """Find a song by partial name, then run a vector search using its embedding."""

    # Find the song in the DataFrame
    matched_song = embedded_df[embedded_df["song_name"].str.contains(song_name, case=False)]
    if matched_song.empty:
        print("No matching songs found in the DataFrame.")
        return

    # Get the embedding of the first matched song
    search_vector = matched_song.iloc[0]["song_embeddings"].tolist()

    # Query Pinecone for similar songs
    query_results = index.query(
        vector=search_vector,
        top_k=n_similar + 1,  # +1 to exclude the query song itself
        include_metadata=True
    )

    print(f"Songs similar to '{matched_song.iloc[0]['song_name']}' by '{matched_song.iloc[0]['song_artist']}':")
    for match in query_results["matches"][1:]:  # Skip the first match (the query song itself)
        print(f" --> {match['metadata']['song_name']} by {match['metadata']['song_artist']}, {match['metadata']['song_year']}, score: {match['score']:.4f}")

# Example usage:
find_similar_songs(index, "I Don't Want A Lover", n_similar=5)