import pandas as pd
import annoy
import numpy as np
from sklearn.preprocessing import StandardScaler

# Load the CSV data into a pandas DataFrame
df_uncleaned = pd.read_csv("spotify_data_with_image_features.csv")
print("DataFrame loaded successfully.")

# Filter out rows where 'preview_url' or 'image_url' are NaN, 'no', or empty string
df = df_uncleaned[~df_uncleaned['preview'].isin([None, 'no', '']) & ~df_uncleaned['img'].isin([None, 'no', ''] )]
df.reset_index(drop=True, inplace=True)
print("DataFrame cleaned.")
# Print the size of the cleaned dataframe
print(f"Cleaned DataFrame size: {df.shape}")

# Extract non-image features (e.g., danceability, energy, etc.)
non_image_features = df[['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 'instrumentalness', 
                         'liveness', 'valence']].values
print("Non-image features extracted.")

# Extract image features (e.g., color and histogram info, assuming these have already been processed)
image_features = np.array([
    np.concatenate([
        np.array([df['single_pixel_color_r'][i], df['single_pixel_color_g'][i], df['single_pixel_color_b'][i]]),
        np.array([df['weighted_average_color_r'][i], df['weighted_average_color_g'][i], df['weighted_average_color_b'][i]]),
        np.array([df['most_vibrant_color_r'][i], df['most_vibrant_color_g'][i], df['most_vibrant_color_b'][i]])
    ]) for i in range(len(df))
])
print("Image features extracted.")

# Standardize the features (important for ANNoy)
scaler = StandardScaler()
non_image_features_scaled = scaler.fit_transform(non_image_features)
print("Non-image features scaled.")
image_features_scaled = scaler.fit_transform(image_features)
print("Image features scaled.")

# Combine non-image and image features for Model 3
combined_features = np.concatenate([non_image_features_scaled, image_features_scaled], axis=1)
print("Combined features created.")

# Create the ANNoy index for non-image features (Model 1)
index_non_image = annoy.AnnoyIndex(non_image_features_scaled.shape[1], 'euclidean')
for i, feature in enumerate(non_image_features_scaled):
    index_non_image.add_item(i, feature)
index_non_image.build(10)  # Number of trees, adjust based on need
index_non_image.save('non_image_features.ann')
print("Non-image features index built and saved.")

# Create the ANNoy index for image features (Model 2)
index_image = annoy.AnnoyIndex(image_features_scaled.shape[1], 'euclidean')
for i, feature in enumerate(image_features_scaled):
    index_image.add_item(i, feature)
index_image.build(10)  # Number of trees, adjust based on need
index_image.save('image_features.ann')
print("Image features index built and saved.")

# Create the ANNoy index for combined features (Model 3)
index_combined = annoy.AnnoyIndex(combined_features.shape[1], 'euclidean')
for i, feature in enumerate(combined_features):
    index_combined.add_item(i, feature)
index_combined.build(10)  # Number of trees, adjust based on need
index_combined.save('combined_features.ann')
print("Combined features index built and saved.")


song_to_query_id = '2245x0g1ft0HC7sf79zbYN'  # Specify the index of the song to query
song_to_query = df[df['id'] == song_to_query_id].iloc[0]  # Get the row by id
song_to_query_index = df[df['id'] == song_to_query_id].index[0]  # Get the index by id
print("Song to query:")
print(f"Song Name: {song_to_query['name']}")
print(f"Artist: {song_to_query['artist']}")
print(f"Spotify ID: {song_to_query['id']}")
print(f"Image URL: {song_to_query['img']}")
print(f"Song Preview: {song_to_query['preview']}")
print("=====================================")
# Query the index when you want to retrieve song details (for example, song at index 0)
# Model 1: Non-image features
index_non_image.load('non_image_features.ann')
print("Non-image features index loaded.")
closest_indices_non_image = index_non_image.get_nns_by_item(song_to_query_index, 10)  # Get 10 nearest neighbors
print(f"Closest indices (Non-image): {closest_indices_non_image}")

closest_ids_non_image = [df['id'].iloc[i] for i in closest_indices_non_image]
print(f"Closest IDs (Non-image): {closest_ids_non_image}")

print("Details for closest songs (Non-image):")
for id in closest_ids_non_image:
    song_data = df[df['id'] == id].iloc[0]  # Get the row by id
    print(f"Song Name: {song_data['name']}")
    print(f"Artist: {song_data['artist']}")
    print(f"Spotify ID: {song_data['id']}")
    print(f"Image URL: {song_data['img']}")
    print(f"Song Preview: {song_data['preview']}")
    print("--------------------")

# Model 2: Image features
index_image.load('image_features.ann')
print("Image features index loaded.")
closest_indices_image = index_image.get_nns_by_item(song_to_query_index, 10)  # Get 10 nearest neighbors
print(f"Closest indices (Image): {closest_indices_image}")

closest_ids_image = [df['id'].iloc[i] for i in closest_indices_image]
print(f"Closest IDs (Image): {closest_ids_image}")

print("Details for closest songs (Image):")
for id in closest_ids_image:
    song_data = df[df['id'] == id].iloc[0]  # Get the row by id
    print(f"Song Name: {song_data['name']}")
    print(f"Artist: {song_data['artist']}")
    print(f"Spotify ID: {song_data['id']}")
    print(f"Image URL: {song_data['img']}")
    print(f"Song Preview: {song_data['preview']}")
    print("--------------------")

# Model 3: Combined features
index_combined.load('combined_features.ann')
print("Combined features index loaded.")
closest_indices_combined = index_combined.get_nns_by_item(song_to_query_index, 10)  # Get 10 nearest neighbors
print(f"Closest indices (Combined): {closest_indices_combined}")

closest_ids_combined = [df['id'].iloc[i] for i in closest_indices_combined]
print(f"Closest IDs (Combined): {closest_ids_combined}")

print("Details for closest songs (Combined):")
for id in closest_ids_combined:
    song_data = df[df['id'] == id].iloc[0]  # Get the row by id
    print(f"Song Name: {song_data['name']}")
    print(f"Artist: {song_data['artist']}")
    print(f"Spotify ID: {song_data['id']}")
    print(f"Image URL: {song_data['img']}")
    print(f"Song Preview: {song_data['preview']}")
    print("--------------------")
