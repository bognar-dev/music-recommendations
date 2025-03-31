# The Impact of Album Cover Features on Music Recommendation: A Multimodal Approach (NB302289-Comp302)

This repository contains the code, analysis, and frontend application for a dissertation research study exploring the impact of album covers on music recommendation systems. The study evaluates how visual album cover features, potentially combined with audio features, may enhance recommendations, assessed through user feedback and statistical analysis.

## Project Overview

-   **Purpose:**
    Investigate whether adding album cover visual information to music recommendation algorithms improves user satisfaction, novelty, and overall relevance compared to audio-only approaches.

-   **Components:**
    1.  **Frontend Survey Application:** A Next.js and React-based web application providing an interactive survey interface where users rate recommendations from different models (audio-only, visual-only, multimodal).
    2.  **Feature Extraction:** Python scripts to process album cover images:
        *   `addBasicImagefeatures.py`: Extracts traditional features like color histograms, dominant colors, brightness, texture (LBP) using OpenCV and scikit-image. Also handles image downloading.
        *   `extract-cnn.py`: Extracts deep learning features using CNN models (e.g., EfficientNetV2, ResNet, VGG mentioned across project files).
    3.  **Recommendation Engine:** Implements Approximate Nearest Neighbors (ANN) search using libraries like `Voyager` (primary, mentioned in dissertation) or `Annoy` (used in testing/notebooks) to find similar songs based on selected feature vectors.
    4.  **Backend Analysis:** Python scripts (`analysis.py`) performing statistical analysis (t-tests, ANOVA, Chi-square, etc.) on user study data fetched from a PostgreSQL database. Uses libraries like Pandas, NumPy, SciPy, Statsmodels.
    5.  **Database Layer:** PostgreSQL database to store survey responses. Schema likely managed via Drizzle ORM (mentioned in original README).
    6.  **Visualization:** Generates plots (using Matplotlib, Seaborn, Plotly) and reports (`analysis_report.md`) summarizing findings, saved in the `results/` directory.
    7.  **Testing:** Includes backend unit tests (Pytest), frontend unit/integration tests (Vitest), and frontend end-to-end tests (Playwright).
    8.  **Analytics:** PostHog integration for tracking user engagement within the survey application.

## Key Technologies & Libraries

-   **Frontend:** Next.js, React, TypeScript, Tailwind CSS, Shadcn UI, Zustand/React Context, Zod
-   **Backend/Analysis:** Python (>=3.12), Pandas, NumPy, SciPy, Statsmodels, Matplotlib, Seaborn, SQLAlchemy, psycopg2-binary, python-dotenv
-   **Machine Learning / Image:** scikit-learn, OpenCV, scikit-image, TensorFlow/Keras, Pillow
-   **ANN Search:** Voyager, Annoy
-   **Database:** PostgreSQL, Drizzle ORM (for schema)
-   **Testing:** Pytest (backend), Vitest (frontend unit/integration), Playwright (frontend E2E)
-   **Environment/Deps:** uv (recommended), Node.js/npm
-   **Analytics:** PostHog

## Prerequisites

*   **Python:** Version 3.12 or higher.
*   **`uv`:** The recommended Python package manager for this project (`pip install uv`). `pip` can also be used.
*   **Node.js:** Required for the frontend application (check `package.json` for specific version if needed, otherwise use a recent LTS version).
*   **npm / yarn / pnpm:** Node.js package manager.
*   **Git:** For cloning the repository.
*   **PostgreSQL Server:** A running instance is required for the `analysis.py` script.
*   **Tesseract OCR (Optional):** Needed *only* if you intend to run the font feature extraction parts mentioned in `model2.ipynb`. Requires separate installation and configuration on your system.

## Setup and Installation

1.  **Clone the Repository:**
    ```bash
    git clone <your-repository-url>
    cd NB302289-Comp302
    ```

2.  **Set up Python Environment:**
    *   Create and activate a virtual environment:
    ```bash
    # Using uv (recommended)
    uv venv
    source .venv/bin/activate # Linux/macOS
    # or .venv\Scripts\activate # Windows

    # Using standard venv
    # python -m venv venv
    # source venv/bin/activate # Linux/macOS
    # or venv\Scripts\activate # Windows
    ```

3.  **Install Python Dependencies:**
    ```bash
    uv pip sync pyproject.toml
    # Or using pip (less precise than uv sync):
    # pip install .
    ```

4.  **Install Frontend Dependencies:**
    ```bash
    npm install
    # or yarn install / pnpm install
    ```

5.  **Database Setup:**
    *   Ensure your PostgreSQL server is running.
    *   Create a database for the project.
    *   Create a `.env` file in the project root directory.
    *   Add your database connection string to the `.env` file:
        ```dotenv
        DATABASE_URL="postgresql://YOUR_USER:YOUR_PASSWORD@YOUR_HOST:YOUR_PORT/YOUR_DATABASE_NAME"
        ```
    *   *(Optional)* If database schema setup/migration scripts (e.g., using Drizzle) are present, run them according to their instructions.

6.  **Dataset:**
    *   Place your initial Spotify dataset CSV (e.g., `spotify_data.csv` or `cleaned_data.csv`) in the project root or the directory expected by the scripts.
    *   The feature extraction scripts will create an `album_covers/` directory (or use the one specified by `--image_dir`) to download images. Ensure you have internet access and write permissions.

## Running the Project Components

*(Activate your Python virtual environment before running Python scripts)*

### 1. Feature Extraction (Run if features are not pre-computed)

*   **Extract CNN Features:** (Adapt input/output filenames as needed)
    ```bash
    uv run extract-cnn.py --csv cleaned_data.csv --output features_cnn.pkl
    ```
    *(This generates a pickle file with deep learning features)*

*   **Extract Basic Image Features & Download Images:** (Adapt input/output filenames as needed)
    ```bash
    uv run addBasicImagefeatures.py --spotify_data_path spotify_data.csv --output_csv_path spotify_data_with_image_features.csv --image_dir album_covers
    ```
    *(This downloads images to `album_covers/` and adds feature columns to the output CSV)*

### 2. Data Analysis

*   Ensure your PostgreSQL database is running and the `.env` file is correctly configured with the `DATABASE_URL`.
*   Run the main analysis script:
    ```bash
    uv run analysis.py
    # Or: python analysis.py
    ```
*   Check the `results/` directory for output tables, figures, and the `analysis_report.md`.

### 3. Frontend Development Server

*   Start the Next.js development server:
    ```bash
    npm run dev
    ```
*   Open your browser to `http://localhost:3000` (or the specified port).

## Running Tests

*   **Frontend End-to-End Tests (Playwright):**
    ```bash
    npx playwright test
    ```

*   **Frontend Unit/Integration Tests (Vitest):**
    *(Check `package.json` for the exact script name)*
    ```bash
    npm run test:unit
    # or similar command like 'npm test' or 'npm run test:vitest'
    ```

*   **Backend Unit Tests (Pytest):**
    ```bash
    pytest
    ```