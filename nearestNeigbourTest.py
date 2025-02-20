import pandas as pd
from sklearn.preprocessing import StandardScaler
from sklearn.neighbors import NearestNeighbors
import ast

def parse_pixel_color(color_str):
    # Convert string like "(np.uint8(45), np.uint8(45), np.uint8(60))" into a numeric tuple
    cleaned_str = color_str.replace("np.uint8", "").strip()
    return ast.literal_eval(cleaned_str)

def build_recommender_model(csv_path: str, feature_columns: list):
    df = pd.read_csv(csv_path, low_memory=False)
    
    # First ensure single_pixel_color isn't missing
    df = df.dropna(subset=["single_pixel_color"])
    
    # Parse pixel color into columns r, g, b
    df["parsed_color"] = df["single_pixel_color"].apply(parse_pixel_color)
    df["r"] = df["parsed_color"].apply(lambda x: x[0])
    df["g"] = df["parsed_color"].apply(lambda x: x[1])
    df["b"] = df["parsed_color"].apply(lambda x: x[2])
    
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
    results['distance'] = all_distances
    return results

if __name__ == "__main__":
    csv_path = "test_data.csv"
    # Use the newly created columns as features
    features = ['r', 'g', 'b']
    
    df, X, nn_model, scaler = build_recommender_model(csv_path, features)
    # Example track IDs to test
    sample_ids = ["7FwBtcecmlpc1sLySPXeGE", "58mFu3oIpBa0HLNeJIxsw3", "1z3ugFmUKoCzGsI6jdY4Ci", "5vmRQ3zELMLUQPo2FLQ76x", "2374M0fQpWi3dLnB54qaLX", "2iEGj7kAwH7HAa5epwYwLB", "2WfaOiMkCvy7F5fcp2zZ8L"]
    recs = recommend_similar_tracks_by_id(sample_ids, df, X, nn_model, k=5)
    print(recs[['name', 'artist', 'distance']])