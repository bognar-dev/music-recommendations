import requests
from bs4 import BeautifulSoup
import json
import pandas as pd
from concurrent.futures import ThreadPoolExecutor, as_completed
import time
import subprocess
import random
import nordvpn_switcher  # Import the nordvpn-switcher package

def connect_to_vpn():
    # Connect to a random NordVPN server
    print("Connecting to a random NordVPN server...")
    nordvpn_switcher.initialize_VPN()  # Initialize VPN connection
    time.sleep(10)  # Wait for the connection to establish

def disconnect_vpn():
    print("Disconnecting from NordVPN...")
    nordvpn_switcher.rotate_VPN()  # Disconnect from the current VPN
    time.sleep(5)  # Wait for the disconnection to complete

def fetch_preview_and_image(track_id):
    embed_url = f"https://open.spotify.com/embed/track/{track_id}"
    
    for attempt in range(3):  # Retry up to 3 times
        try:
            response = requests.get(embed_url)
            
            if not response.ok:
                print(f"Failed to fetch embed page for {track_id}: {response.status_code}")
                return None, None

            html = response.text
            soup = BeautifulSoup(html, 'html.parser')

            # Find the <script> tag containing the JSON data
            script_elements = soup.find_all('script')
            for element in script_elements:
                script_content = element.string
                if script_content and 'props' in script_content:
                    # Parse the JSON data
                    json_data = json.loads(script_content)
                    # Extract the audio preview URL and image URL
                    audio_preview_url = json_data['props']['pageProps']['state']['data']['entity']['audioPreview']['url']
                    image_url = json_data['props']['pageProps']['state']['data']['entity']['visualIdentity']['image'][0]['url']
                    return audio_preview_url, image_url

        except Exception as e:
            print(f"Error fetching data for track ID {track_id}: {e}")
        
        # If rate limit is hit, disconnect and reconnect to a new VPN server
        print(f"Rate limit hit or error occurred. Retrying with a new server... (Attempt {attempt + 1})")
        disconnect_vpn()
        connect_to_vpn()  # Connect to a new random server
        time.sleep(5)  # Wait a bit before retrying

    return None, None

def process_track(row):
    track_id = row['id']  # Assuming 'id' column contains the Spotify track ID
    print(f"Processing track ID: {track_id}")

    # Fetch the audio preview URL and image URL
    preview_url, image_url = fetch_preview_and_image(track_id)

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

    return updated_track

# Load the CSV data
input_csv = 'tracks_features.csv'  # Replace with your input CSV file name
output_csv = 'updated_tracks.csv'  # Output CSV file name
df = pd.read_csv(input_csv)

# Connect to a random NordVPN server before starting the processing
connect_to_vpn()

# Prepare a list to hold updated track information
updated_tracks = []

# Use ThreadPoolExecutor to process tracks in parallel
total_tracks = len(df)
error_counter = 0  # Initialize error counter

with ThreadPoolExecutor(max_workers=5) as executor:  # Adjust max_workers as needed
    future_to_row = {executor.submit(process_track, row): row for index, row in df.iterrows()}
    
    for index, future in enumerate(as_completed(future_to_row)):
        row = future_to_row[future]
        try:
            updated_track = future.result()
            updated_tracks.append(updated_track)
            # Print progress
            print(f"Processed {index + 1}/{total_tracks} tracks.")
            error_counter = 0  # Reset error counter on success
        except Exception as e:
            print(f"Error processing track {row['id']}: {e}")
            error_counter += 1  # Increment error counter
            
            # If error counter reaches 249, disconnect and reconnect to a new VPN server
            if error_counter >= 249:
                print("Error limit reached. Rotating VPN server...")
                disconnect_vpn()
                connect_to_vpn()  # Connect to a new random server
                error_counter = 0  # Reset error counter after rotation

# Convert the updated tracks list to a DataFrame
updated_df = pd.DataFrame(updated_tracks)

# Save the updated DataFrame back to CSV
updated_df.to_csv(output_csv, index=False)
print(f"Updated track data saved to '{output_csv}'.")

# Disconnect from the VPN after processing
disconnect_vpn()
