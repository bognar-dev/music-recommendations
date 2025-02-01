import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import os
import signal
import sys


def fetch_preview_and_image(track_id):
    embed_url = f"https://open.spotify.com/embed/track/{track_id}"
    
    for attempt in range(3):  # Retry up to 3 times
        try:
            response = requests.get(embed_url)
            
            if response.status_code == 429:  # Rate limit error
                print(f"Rate limit hit for track ID {track_id}. Saving progress and exiting...")
                return None, None, True  # Indicate that a rate limit error occurred

            if not response.ok:
                print(f"Failed to fetch embed page for {track_id}: {response.status_code}")
                return None, None, False

            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # Find the <script> tag containing the JSON data
            script_elements = soup.find_all('script')
            for element in script_elements:
                script_content = element.string
                if script_content and 'props' in script_content:
                    # Parse the JSON data
                    json_data = json.loads(script_content)
                    # Check if the expected keys exist in the JSON data
                    try:
                        audio_preview_url = json_data['props']['pageProps']['state']['data']['entity']['audioPreview']['url']
                        image_url = json_data['props']['pageProps']['state']['data']['entity']['visualIdentity']['image'][0]['url']
                        return audio_preview_url, image_url, False  # No error
                    except (KeyError, IndexError) as e:
                        print(f"Missing data for track ID {track_id}: {e}")
                        return None, None, False  # No error

        except TypeError as e:
            # Handle the specific error for NoneType
            print(f"Error fetching data for track ID {track_id}: {e}. Not retrying.")
            return None, None, False  # No error, do not retry
        except Exception as e:
            print(f"Error fetching data for track ID {track_id}: {e}")
        
        print(f"Retrying... (Attempt {attempt + 1})")
        time.sleep(5)  # Wait a bit before retrying

    return None, None, False  # No error


def process_track(row):
    track_id = row['id']  # Assuming 'id' column contains the Spotify track ID
    print(f"Processing track ID: {track_id}")

    # Fetch the audio preview URL and image URL
    preview_url, image_url, rate_limit_error = fetch_preview_and_image(track_id)

    # Create a new dictionary with the updated information
    updated_track = {
        'id': track_id,
        'name': row['name'],
        'album': row['album'],
        'album_id': row['album_id'],
        'artists': row['artists'],
        'artist_ids': row['artist_ids'],
        'track_number': row['track_number'],
        'disc_number': row['disc_number'],
        'explicit': row['explicit'],
        'danceability': row['danceability'],
        'energy': row['energy'],
        'key': row['key'],
        'loudness': row['loudness'],
        'mode': row['mode'],
        'speechiness': row['speechiness'],
        'acousticness': row['acousticness'],
        'instrumentalness': row['instrumentalness'],
        'liveness': row['liveness'],
        'valence': row['valence'],
        'tempo': row['tempo'],
        'duration_ms': row['duration_ms'],
        'time_signature': row['time_signature'],
        'year': row['year'],
        'release_date': row['release_date'],
        'image_url': image_url,
        'preview_url': preview_url
    }

    return updated_track, rate_limit_error

def save_progress(updated_tracks, output_csv):
    # Save the updated tracks to CSV
    updated_df = pd.DataFrame(updated_tracks)
    updated_df.to_csv(output_csv, index=False)
    print(f"Progress saved to '{output_csv}'.")

def load_processed_tracks(output_csv):
    # Load already processed tracks from CSV if it exists
    if os.path.exists(output_csv):
        return pd.read_csv(output_csv)
    return pd.DataFrame(columns=['id'])  # Return an empty DataFrame if no file exists

# Load the CSV data
input_csv = 'tracks_features.csv'  # Replace with your input CSV file name
output_csv = 'updated_tracks.csv'  # Output CSV file name
df = pd.read_csv(input_csv)

# Load already processed tracks
processed_tracks_df = load_processed_tracks(output_csv)
processed_ids = set(processed_tracks_df['id'].tolist())  # Set of processed track IDs

def save_progress(updated_tracks, output_csv):
    # Load existing data if file exists
    if os.path.exists(output_csv):
        existing_df = pd.read_csv(output_csv)
        # Combine existing and new data
        updated_df = pd.concat([existing_df, pd.DataFrame(updated_tracks)], ignore_index=True)
        # Remove duplicates based on track ID
        updated_df = updated_df.drop_duplicates(subset=['id'], keep='last')
    else:
        updated_df = pd.DataFrame(updated_tracks)
    
    updated_df.to_csv(output_csv, index=False)
    print(f"Progress saved to '{output_csv}' ({len(updated_tracks)} tracks)")

def signal_handler(signum, frame):
    print("\nKeyboard interrupt received. Saving progress...")
    if updated_tracks:  # Make updated_tracks global
        save_progress(updated_tracks, output_csv)
    sys.exit(0)

# Register signal handler
signal.signal(signal.SIGINT, signal_handler)

updated_tracks = []  # Make this global
SAVE_INTERVAL = 10  # Save every 10 tracks

# Calculate total tracks to process
total_tracks = len([row for _, row in df.iterrows() if row['id'] not in processed_ids])
print(f"Processing {total_tracks} tracks...")

with ThreadPoolExecutor(max_workers=5) as executor:
    future_to_row = {executor.submit(process_track, row): row for index, row in df.iterrows() 
                    if row['id'] not in processed_ids}
    
    for index, future in enumerate(as_completed(future_to_row)):
        row = future_to_row[future]
        try:
            updated_track, rate_limit_error = future.result()
            if updated_track:
                updated_tracks.append(updated_track)
                # Save progress periodically
                if len(updated_tracks) % SAVE_INTERVAL == 0:
                    save_progress(updated_tracks, output_csv)
                    updated_tracks = []  # Clear saved tracks
                print(f"Processed {index + 1}/{total_tracks} tracks")
            if rate_limit_error:
                save_progress(updated_tracks, output_csv)
                break
        except Exception as e:
            print(f"Error processing track {row['id']}: {e}")

# Final save
if updated_tracks:
    save_progress(updated_tracks, output_csv)