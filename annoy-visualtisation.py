import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
from annoy import AnnoyIndex
from sklearn.preprocessing import StandardScaler
from sklearn.decomposition import PCA
import random

# Load the data (assuming the CSV is in the current directory)
df_uncleaned = pd.read_csv("spotify_data_with_image_features.csv")
print("DataFrame loaded successfully.")

# Clean the data
df = df_uncleaned[~df_uncleaned['preview'].isin([None, 'no', '']) & ~df_uncleaned['img'].isin([None, 'no', ''])]
df.reset_index(drop=True, inplace=True)
print(f"Cleaned DataFrame size: {df.shape}")

# Extract features
non_image_features = df[['danceability', 'energy', 'loudness', 'speechiness', 'acousticness', 
                         'instrumentalness', 'liveness', 'valence']].values

image_features = np.array([
    np.concatenate([
        np.array([df['single_pixel_color_r'][i], df['single_pixel_color_g'][i], df['single_pixel_color_b'][i]]),
        np.array([df['weighted_average_color_r'][i], df['weighted_average_color_g'][i], df['weighted_average_color_b'][i]]),
        np.array([df['most_vibrant_color_r'][i], df['most_vibrant_color_g'][i], df['most_vibrant_color_b'][i]])
    ]) for i in range(len(df))
])

# Standardize features
scaler = StandardScaler()
non_image_features_scaled = scaler.fit_transform(non_image_features)
image_features_scaled = scaler.fit_transform(image_features)

# Choose which features to visualize
feature_type = 'combined' # Options: 'non_image', 'image', or 'combined'

if feature_type == 'non_image':
    features = non_image_features_scaled
    title = 'Spotify Songs - Audio Features'
elif feature_type == 'image':
    features = image_features_scaled
    title = 'Spotify Songs - Cover Art Features'
else:  # combined
    features = np.concatenate([non_image_features_scaled, image_features_scaled], axis=1)
    title = 'Spotify Songs - Combined Audio and Visual Features'

# Reduce to 2D using PCA for visualization
pca = PCA(n_components=2)
features_2d = pca.fit_transform(features)
print(f"Explained variance ratio: {pca.explained_variance_ratio_}")

# Cluster the data using Annoy
f = features.shape[1]  # Number of dimensions
t = AnnoyIndex(f, 'euclidean')  # Using Euclidean distance

# Add items to the index
for i in range(len(features)):
    t.add_item(i, features[i])

# Build the index
t.build(10)  # 10 trees

# Function to assign colors to clusters
def get_clusters(index, data, n_clusters=20, points_per_cluster=50):
    clusters = {}
    used_points = set()
    
    # Use random seed points that are not already assigned
    all_indices = list(range(len(data)))
    random.shuffle(all_indices)
    
    for i in range(min(n_clusters, len(data))):
        # Find a seed point not yet used
        seed = None
        for idx in all_indices:
            if idx not in used_points:
                seed = idx
                break
        
        if seed is None:
            break
            
        # Get the nearest neighbors of this seed
        neighbors = index.get_nns_by_item(seed, points_per_cluster)
        clusters[i] = neighbors
        used_points.update(neighbors)
    
    # Assign remaining points to the nearest cluster
    for i in range(len(data)):
        if i not in used_points:
            # Find nearest seed point
            min_dist = float('inf')
            best_cluster = 0
            
            for cluster_id, cluster_points in clusters.items():
                if len(cluster_points) > 0:
                    # Use the first point in the cluster as reference
                    dist = np.linalg.norm(features[i] - features[cluster_points[0]])
                    if dist < min_dist:
                        min_dist = dist
                        best_cluster = cluster_id
            
            clusters[best_cluster].append(i)
            used_points.add(i)
    
    return clusters

# Get clusters
clusters = get_clusters(t, features)

# Create a colormap
colors = plt.cm.tab20(np.linspace(0, 1, len(clusters)))
additional_colors = plt.cm.Set3(np.linspace(0, 1, max(0, len(clusters) - 20)))
if len(clusters) > 20:
    colors = np.vstack([colors, additional_colors])

# Prepare the plot
plt.figure(figsize=(10, 10))

# Plot each cluster with its own color
for i, (cluster_id, points) in enumerate(clusters.items()):
    x = [features_2d[p, 0] for p in points]
    y = [features_2d[p, 1] for p in points]
    plt.scatter(x, y, c=[colors[i]], marker='x', alpha=0.7, s=30)

# Add titles and labels
plt.title(title, fontsize=15)
plt.xlabel(f'Principal Component 1 ({pca.explained_variance_ratio_[0]:.2%} variance)')
plt.ylabel(f'Principal Component 2 ({pca.explained_variance_ratio_[1]:.2%} variance)')

# Optional: Add a legend showing some of the clusters
legend_entries = min(10, len(clusters)) # Comment this out if you have too many clusters
handles = [plt.Line2D([0], [0], marker='x', color='w', markerfacecolor=colors[i], 
                      markersize=10, label=f'Cluster {i+1}') 
           for i in range(legend_entries)]
plt.legend(handles=handles, loc='upper right')

# Optional: Annotate some points with song names
for i, (_, points) in enumerate(list(clusters.items())[:5]):  # Just label a few clusters
    for point in points[:3]:  # Just label a few points per cluster
        plt.annotate(df['name'].iloc[point][:15], 
                    (features_2d[point, 0], features_2d[point, 1]),
                    fontsize=8)
plt.tight_layout()
plt.savefig('spotify_visualization.png', dpi=300)
plt.show()



import plotly.express as px
from sklearn.decomposition import PCA

# Reduce to 3D
pca_3d = PCA(n_components=3)
features_3d = pca_3d.fit_transform(features)

# Create a DataFrame for plotly
plot_df = pd.DataFrame({
    'PC1': features_3d[:, 0],
    'PC2': features_3d[:, 1],
    'PC3': features_3d[:, 2],
    'Song': df['name'],
    'Artist': df['artist']
})

# Assign cluster colors
cluster_labels = np.zeros(len(df), dtype=int)
for cluster_id, points in clusters.items():
    for point in points:
        cluster_labels[point] = cluster_id

plot_df['Cluster'] = cluster_labels

# Create the 3D scatter plot
fig = px.scatter_3d(
    plot_df, x='PC1', y='PC2', z='PC3',
    color='Cluster', hover_data=['Song', 'Artist'],
    title='3D Visualization of Spotify Songs'
)

fig.update_layout(scene=dict(
    xaxis_title=f'PC1 ({pca_3d.explained_variance_ratio_[0]:.2%})',
    yaxis_title=f'PC2 ({pca_3d.explained_variance_ratio_[1]:.2%})',
    zaxis_title=f'PC3 ({pca_3d.explained_variance_ratio_[2]:.2%})'
))

fig.write_html('spotify_visualization_3d.html')
