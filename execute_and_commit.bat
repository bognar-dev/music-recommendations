@echo on

REM Check if venv exists, create if not
if not exist venv (
    REM Install virtualenv if not already installed
    where virtualenv >nul 2>&1
    if %errorlevel% neq 0 (
        pip install virtualenv
    )
    python -m virtualenv venv
    echo Created virtual environment venv
)

REM Activate the virtual environment
call venv\Scripts\activate.bat

REM Install missing packages
pip install opencv-python numpy pandas scikit-learn scikit-image tqdm requests ultralytics

REM Run the Python script
python addBasicImagefeatures.py --spotify_data_path spotify_data.csv --output_csv_path spotify_data_with_image_features.csv --image_dir album_covers --features dominant_color_kmeans color_temperature color_brightness overall_lightness color_histograms resize_to_single_pixel luminosity_weighted_average find_most_vibrant_color edge_detection texture_analysis

REM Get the exit code of the python script
set EXIT_CODE=%ERRORLEVEL%

REM Add changes to git
git add .

REM Check the exit code
IF %EXIT_CODE% EQU 0 (
    REM Commit changes with success message
    git commit -m "Executed addBasicImageFeatures.py and added image features to the dataset all ducking remotely - Success"
) ELSE (
    REM Commit changes with error message
    git commit -m "Executed addBasicImageFeatures.py and added image features to the dataset all ducking remotely - Failed with error code %EXIT_CODE%"
)

REM Push changes
git push

REM Deactivate the virtual environment (optional)
deactivate

REM Shutdown the computer after 5 minutes
shutdown /s /t 300