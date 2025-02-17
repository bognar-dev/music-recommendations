import os
import pandas as pd
import argparse

def rename_images(spotify_data_path: str, image_dir: str):
    """
    Renames images in the image directory to match the Spotify track IDs.

    Args:
        spotify_data_path: Path to the Spotify data CSV file.
        image_dir: Path to the directory containing the album cover images.
    """

    try:
        spotify_df = pd.read_csv(spotify_data_path)
        print(f"Loaded Spotify data from {spotify_data_path}")
    except FileNotFoundError:
        print(f"Error: Spotify data file not found at {spotify_data_path}")
        return
    except Exception as e:
        print(f"Error loading Spotify data from {spotify_data_path}: {e}")
        return

    if not os.path.exists(image_dir):
        print(f"Error: Image directory not found at {image_dir}")
        return

    # Create a dictionary mapping old filenames (based on index) to new filenames (based on id)
    filename_mapping = {}
    for index, row in spotify_df.iterrows():
        old_filename = f"album_cover_{index}.jpg"
        new_filename = f"album_cover_{row['id']}.jpg"
        filename_mapping[old_filename] = new_filename

    # Rename the images
    for old_filename, new_filename in filename_mapping.items():
        old_filepath = os.path.join(image_dir, old_filename)
        new_filepath = os.path.join(image_dir, new_filename)

        if os.path.exists(old_filepath):
            os.rename(old_filepath, new_filepath)
            print(f"Renamed {old_filename} to {new_filename}")
        else:
            print(f"Warning: {old_filename} not found in {image_dir}")

    print("Image renaming complete.")


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="Rename album cover images to match Spotify track IDs.")
    parser.add_argument("--spotify_data_path", type=str, default="spotify_data.csv", help="Path to the Spotify data CSV file.")
    parser.add_argument("--image_dir", type=str, default="album_covers", help="Path to the directory containing the album cover images.")

    args = parser.parse_args()

    rename_images(args.spotify_data_path, args.image_dir)