@echo on

REM Check if venv exists, create if not
if not exist venv (
    python -m venv venv
    echo Created virtual environment venv
)

REM Activate the virtual environment
call venv\Scripts\activate.bat

REM Install missing packages
pip install opencv-python numpy pandas scikit-learn scikit-image tqdm

REM Run the Python script
python addBasicImageFeatures.py

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