import pandas as pd
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.neighbors import NearestNeighbors
import ast
import numpy as np

def parse_pixel_color(color_str):
    # Convert string like "(np.uint8(45), np.uint8(45), np.uint8(60))" into a numeric tuple
    cleaned_str = color_str.replace("np.uint8", "").strip()
    return ast.literal_eval(cleaned_str)

def build_recommender_model(csv_path: str, feature_columns: list, use_rgb: bool = True):
    df = pd.read_csv(csv_path, low_memory=False)
    
    # First ensure single_pixel_color isn't missing
    df = df.dropna(subset=["single_pixel_color", "dominant_colors"])
    
    if use_rgb:
        # Parse pixel color into columns r, g, b
        df["parsed_color"] = df["single_pixel_color"].apply(parse_pixel_color)
        df["r"] = df["parsed_color"].apply(lambda x: x[0])
        df["g"] = df["parsed_color"].apply(lambda x: x[1])
        df["b"] = df["parsed_color"].apply(lambda x: x[2])
        
        # Add r, g, b to feature_columns if not already present
        for color_col in ['r', 'g', 'b']:
            if color_col not in feature_columns:
                feature_columns.append(color_col)
    
    # Parse dominant_colors from string to list of tuples
    df["dominant_colors_parsed"] = df["dominant_colors"].apply(parse_dominant_colors)
    df = df.dropna(subset=["dominant_colors_parsed"])  # Remove rows where parsing failed

    # One-Hot Encode dominant_colors_parsed
    encoder = OneHotEncoder(handle_unknown='ignore')
    encoded_data = encoder.fit_transform(df[['dominant_colors_parsed']]).toarray()
    encoded_df = pd.DataFrame(encoded_data, columns=encoder.get_feature_names_out(['dominant_colors_parsed']))
    df = pd.concat([df.reset_index(drop=True), encoded_df.reset_index(drop=True)], axis=1)
    
    # Add encoded columns to feature_columns
    feature_columns.extend(encoded_df.columns.tolist())
    
    # Now you can drop rows that have NaN in your chosen features
    df = df.dropna(subset=feature_columns)
    
    # Standardize chosen numeric columns
    scaler = StandardScaler()
    X = scaler.fit_transform(df[feature_columns].values)

    nn_model = NearestNeighbors(metric='cosine', algorithm='brute')
    nn_model.fit(X)

    return df, X, nn_model, scaler

def recommend_similar_tracks_by_id(track_ids: list, df: pd.DataFrame, X, nn_model, k=5):
    track_indices = df[df['id'].isin(track_ids)].index.tolist()
    if not track_indices:
        print("No tracks found with the given IDs.")
        return None

    track_vectors = X[track_indices]
    all_indices = []
    all_distances = []
    for track_vector in track_vectors:
        distances, indices = nn_model.kneighbors(track_vector.reshape(1, -1), n_neighbors=k+1)
        valid_indices = indices[0][1:]
        valid_distances = distances[0][1:]
        all_indices.extend(valid_indices)
        all_distances.extend(valid_distances)

    results = df.iloc[all_indices].copy()
    csv_path = "test_data.csv"
    # Example usage with only r, g, b features
    features = ["danceability", "energy"]  # Start with an empty list, or add other features you want
    
    df, X, nn_model, scaler = build_recommender_model(csv_path, features, use_rgb=True)
    # Example track IDs to test
    sample_ids = ["00Ci0EXS4fNPnkTbS6wkOh"]
    
    df, X, nn_model, scaler = build_recommender_model(csv_path, features, use_rgb=True)
    # Example track IDs to test
    sample_ids = ["00Ci0EXS4fNPnkTbS6wkOh"]
    recs = recommend_similar_tracks_by_id(sample_ids, df, X, nn_model, k=5)
    print(recs[['name', 'artist', 'distance']])