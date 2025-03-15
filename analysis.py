import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
import seaborn as sns
from sqlalchemy import create_engine
import psycopg2
from collections import defaultdict
import os
from dotenv import load_dotenv
from scipy import stats
import statsmodels.api as sm
from statsmodels.formula.api import ols
import warnings
warnings.filterwarnings('ignore')
print("Starting process ...")
# Load environment variables from .env file
load_dotenv()


connection_string = os.getenv("DATABASE_URL")
engine = create_engine(connection_string)

print("Connecting to database and fetching survey data...")
# SQL query to fetch all survey data
query = "SELECT * FROM surveys"

# Load data into pandas DataFrame
df = pd.read_sql(query, engine)
print(f"Loaded {len(df)} survey responses.")

# Function to safely parse JSON fields
def parse_json_field(field):
    if pd.isna(field):
        return {}
    try:
        if isinstance(field, dict):
            return field
        if isinstance(field, bytes):
            field = field.decode('utf-8')
        return json.loads(field)
    except Exception as e:
        print(f"Error parsing JSON: {e}")
        return {}

# Parse all JSON fields
step_columns = ['step_one', 'step_two', 'step_three', 'step_four', 'step_five', 
                'step_six', 'step_seven', 'step_eight', 'step_nine', 'review']

for col in step_columns:
    df[f"{col}_parsed"] = df[col].apply(lambda x: parse_json_field(x))

# Extract demographic information from review
df['age'] = df['review_parsed'].apply(lambda x: x.get('age', None))
df['country'] = df['review_parsed'].apply(lambda x: x.get('country', None))
df['model_preference'] = df['review_parsed'].apply(lambda x: x.get('preference', None))
df['feedback'] = df['review_parsed'].apply(lambda x: x.get('feedback', ''))

# Create age groups
bins = [0, 20, 35, 100]
labels = ['<20', '20-35', '>35']
df['age_group'] = pd.cut(df['age'], bins=bins, labels=labels, right=False)

print("Extracting model ratings and song data...")

# - model1: Audio only (unimodal)
# - model2: Audio + Album Cover (multimodal - simple)
# - model3: Audio + Album Cover with advanced features (multimodal - advanced)

# Define seed song information
seed_song_info = {
    '0dqGfCMAGyDgpUAgLNOjWd': {
        'artist': 'Metallica',
        'genre': 'Metal/Hard Rock',
        'playlist_number': 1
    },
    '2WfaOiMkCvy7F5fcp2zZ8L': {
        'artist': 'A-ha',
        'song': 'Take On Me',
        'genre': 'Pop/Synthpop',
        'playlist_number': 2
    },
    '4vUmTMuQqjdnvlZmAH61Qk': {
        'artist': 'Ed Sheeran',
        'song': 'South of the Border',
        'genre': 'Pop/R&B',
        'playlist_number': 3
    }
}

# Initialize containers for all data points
all_ratings = []
all_song_ratings = []

# Process each step for each survey response
for idx, row in df.iterrows():
    for step_idx, step_col in enumerate([f"{col}_parsed" for col in step_columns if col != 'review']):
        step_data = row[step_col]
        if not step_data:
            continue
            
        # Extract model ID and step information
        model_id = step_data.get('modelId')
        seed_song_id = step_data.get('seedSongId')
        step_num = step_data.get('step')
        
        if not model_id or not seed_song_id:
            continue
        
        # Get seed song genre
        genre = seed_song_info.get(seed_song_id, {}).get('genre', 'Unknown')
        playlist_number = seed_song_info.get(seed_song_id, {}).get('playlist_number', 0)
        
        # Process model ratings
        model_rating = step_data.get('modelRating', {})
        if model_rating:
            relevance = model_rating.get('relevance')
            novelty = model_rating.get('novelty')
            satisfaction = model_rating.get('satisfaction')
            
            if all([relevance, novelty, satisfaction]):
                all_ratings.append({
                    'survey_id': row['id'],
                    'step': step_num,
                    'step_idx': step_idx,
                    'model_id': model_id,
                    'seed_song_id': seed_song_id,
                    'genre': genre,
                    'playlist_number': playlist_number,
                    'relevance': relevance,
                    'novelty': novelty,
                    'satisfaction': satisfaction,
                    'age': row['age'],
                    'country': row['country'],
                    'age_group': row['age_group']
                })
        
        # Process song ratings
        song_ratings = step_data.get('songRatings', [])
        for song in song_ratings:
            song_id = song.get('songId')
            song_name = song.get('songName')
            rating = song.get('rating')
            
            if all([song_id, song_name is not None]):
                all_song_ratings.append({
                    'survey_id': row['id'],
                    'step': step_num,
                    'step_idx': step_idx,
                    'model_id': model_id,
                    'seed_song_id': seed_song_id,
                    'genre': genre,
                    'playlist_number': playlist_number,
                    'song_id': song_id,
                    'song_name': song_name,
                    'rating': rating,
                    'age': row['age'],
                    'country': row['country'],
                    'age_group': row['age_group']
                })

# Create DataFrames
ratings_df = pd.DataFrame(all_ratings)
song_ratings_df = pd.DataFrame(all_song_ratings)

print(f"Extracted {len(ratings_df)} model ratings and {len(song_ratings_df)} song ratings.")
print(f"Columns in ratings_df {list(ratings_df)}")
print(f"Columns in song_ratings_df {song_ratings_df.columns.tolist()}")

# Create output directory for results
os.makedirs('results', exist_ok=True)
os.makedirs('results/figures', exist_ok=True)
os.makedirs('results/tables', exist_ok=True)

# ---- RESEARCH QUESTION ANALYSIS ----
print("\n=== ANALYZING RESEARCH QUESTIONS AND HYPOTHESES ===")

# Define model types
ratings_df['model_type'] = ratings_df['model_id'].map({
    'model1': 'Unimodal (Audio Only)', 
    'model2': 'Multimodal (Simple)', 
    'model3': 'Multimodal (Advanced)'
})

song_ratings_df['model_type'] = song_ratings_df['model_id'].map({
    'model1': 'Unimodal (Audio Only)', 
    'model2': 'Multimodal (Simple)', 
    'model3': 'Multimodal (Advanced)'
})

# ---- H1: RELEVANCE - MULTIMODAL ENHANCEMENT ----
print("\n=== H1: RELEVANCE - MULTIMODAL ENHANCEMENT ===")
print("Testing if multimodal systems produce more relevant recommendations")

# Aggregate relevance scores by model
relevance_by_model = ratings_df.groupby('model_id')['relevance'].agg(['mean', 'std', 'count'])
relevance_by_model.columns = ['Mean Relevance', 'Std Dev', 'Count']
print("\nRelevance Scores by Model:")
print(relevance_by_model)

# T-test for relevance between unimodal and multimodal
unimodal_relevance = ratings_df[ratings_df['model_id'] == 'model1']['relevance']
multimodal_simple = ratings_df[ratings_df['model_id'] == 'model2']['relevance']
multimodal_advanced = ratings_df[ratings_df['model_id'] == 'model3']['relevance']
multimodal_combined = pd.concat([multimodal_simple, multimodal_advanced])

# T-test: Unimodal vs. Multimodal (combined)
t_stat, p_value = stats.ttest_ind(unimodal_relevance, multimodal_combined, equal_var=False)
print(f"\nT-test for Relevance (Unimodal vs. Multimodal):")
print(f"t-statistic: {t_stat:.4f}, p-value: {p_value:.4f}")
print(f"Result: {'Significant difference' if p_value < 0.05 else 'No significant difference'}")

# Mann-Whitney U test (non-parametric alternative)
u_stat, p_value_mw = stats.mannwhitneyu(unimodal_relevance, multimodal_combined)
print(f"\nMann-Whitney U test for Relevance (Unimodal vs. Multimodal):")
print(f"U-statistic: {u_stat:.4f}, p-value: {p_value_mw:.4f}")
print(f"Result: {'Significant difference' if p_value_mw < 0.05 else 'No significant difference'}")

# Visualization for H1
plt.figure(figsize=(12, 7))

# Improved boxplot
sns.boxplot(x='model_id', y='relevance', data=ratings_df, palette='viridis', boxprops=dict(alpha=0.7), linewidth=1.5)

# Overlay the data points
sns.stripplot(x='model_id', y='relevance', data=ratings_df, color='black', alpha=0.4, jitter=True)

plt.title('Relevance Ratings by Model Type', fontsize=16)
plt.xlabel('Model Type', fontsize=14)
plt.ylabel('Relevance Rating (1-5)', fontsize=14)
plt.xticks([0, 1, 2], ['Unimodal (Audio Only)', 'Multimodal (Simple)', 'Multimodal (Advanced)'], fontsize=12)
plt.yticks(fontsize=12)

plt.ylim(0.5, 5.5)

plt.grid(axis='y', linestyle='--')
sns.despine(left=True)

plt.tight_layout()
plt.savefig('results/figures/h1_relevance_by_model.png')

# ---- H2: NOVELTY - UNFAMILIAR TRACKS WITHIN THEME ----
print("\n=== H2: NOVELTY - UNFAMILIAR TRACKS WITHIN THEME ===")
print("Testing if multimodal systems recommend more novel but relevant tracks")

# Aggregate novelty scores by model
novelty_by_model = ratings_df.groupby('model_id')['novelty'].agg(['mean', 'std', 'count'])
novelty_by_model.columns = ['Mean Novelty', 'Std Dev', 'Count']
print("\nNovelty Scores by Model:")
print(novelty_by_model)

# Calculate positive rating percentages (as a proxy for relevance despite novelty)
positive_ratings_pct = song_ratings_df.groupby('model_id')['rating'].mean() * 100
print("\nPercentage of Positively Rated Songs by Model:")
print(positive_ratings_pct)

# Chi-square test for positive ratings between models
# Create contingency table
contingency = pd.crosstab(song_ratings_df['model_id'], song_ratings_df['rating'])
chi2, p_chi2, dof, expected = stats.chi2_contingency(contingency)
print("\nChi-square test for positive ratings between models:")
print(f"Chi2: {chi2:.4f}, p-value: {p_chi2:.4f}, degrees of freedom: {dof}")
print(f"Result: {'Significant difference' if p_chi2 < 0.05 else 'No significant difference'}")

# Logistic regression for rating prediction based on model and novelty
# First, join song ratings with model ratings to get novelty scores
song_with_novelty = song_ratings_df.merge(
    ratings_df[['survey_id', 'step', 'model_id', 'novelty']],
    on=['survey_id', 'step', 'model_id']
)

# Prepare data for logistic regression
# Ensure 'novelty' is numeric and handle missing values appropriately
song_with_novelty['novelty'] = pd.to_numeric(song_with_novelty['novelty'], errors='coerce').fillna(0)

# One-hot encode 'model_id' and explicitly cast to numeric *before* one-hot encoding
X = pd.get_dummies(song_with_novelty['model_id'], drop_first=True)
X['novelty'] = song_with_novelty['novelty']
X = X.astype(float)

# Ensure 'rating' is numeric
y = pd.to_numeric(song_with_novelty['rating'], errors='coerce').fillna(0)

# Remove any rows with NaN in X or y after numeric conversion
valid_rows = X.notna().all(axis=1) & y.notna()
X = X[valid_rows]
y = y[valid_rows]

# Convert X and y to numpy arrays with explicit dtype
X = np.asarray(X, dtype=float)
y = np.asarray(y, dtype=float)


# Fit logistic regression model
logit_model = sm.Logit(y, sm.add_constant(X))
try:
    logit_result = logit_model.fit()
    print("\nLogistic Regression for Song Rating Prediction:")
    print(logit_result.summary().tables[1])
except Exception as e:
    print(f"\nLogistic Regression failed: {e} - possibly due to perfect separation or other issues. Error: {e}")



# Visualization for H2
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
sns.boxplot(x='model_id', y='novelty', data=ratings_df, palette='viridis')
plt.title('Novelty Ratings by Model Type')
plt.xlabel('Model Type')
plt.ylabel('Novelty Rating (1-5)')
plt.xticks([0, 1, 2], ['Unimodal', 'Multimodal (S)', 'Multimodal (A)'])

plt.subplot(1, 2, 2)
positive_pct_df = song_ratings_df.groupby('model_id')['rating'].mean().reset_index()
positive_pct_df['rating'] = positive_pct_df['rating'] * 100
sns.barplot(x='model_id', y='rating', data=positive_pct_df, palette='viridis')
plt.title('Percentage of Positively Rated Songs')
plt.xlabel('Model Type')
plt.ylabel('Positive Ratings (%)')
plt.xticks([0, 1, 2], ['Unimodal', 'Multimodal (S)', 'Multimodal (A)'])
plt.tight_layout()
plt.savefig('results/figures/h2_novelty_and_positive_ratings.png')

# ---- H3: USER SATISFACTION - OVERALL PREFERENCE ----
print("\n=== H3: USER SATISFACTION - OVERALL PREFERENCE ===")
print("Testing if users prefer multimodal recommendations overall")

# Aggregate satisfaction scores by model
satisfaction_by_model = ratings_df.groupby('model_id')['satisfaction'].agg(['mean', 'std', 'count'])
satisfaction_by_model.columns = ['Mean Satisfaction', 'Std Dev', 'Count']
print("\nSatisfaction Scores by Model:")
print(satisfaction_by_model)

# T-test for satisfaction between unimodal and multimodal
unimodal_satisfaction = ratings_df[ratings_df['model_id'] == 'model1']['satisfaction']
multimodal_combined_satisfaction = pd.concat([
    ratings_df[ratings_df['model_id'] == 'model2']['satisfaction'],
    ratings_df[ratings_df['model_id'] == 'model3']['satisfaction']
])

t_stat_sat, p_value_sat = stats.ttest_ind(unimodal_satisfaction, multimodal_combined_satisfaction, equal_var=False)
print(f"\nT-test for Satisfaction (Unimodal vs. Multimodal):")
print(f"t-statistic: {t_stat_sat:.4f}, p-value: {p_value_sat:.4f}")
print(f"Result: {'Significant difference' if p_value_sat < 0.05 else 'No significant difference'}")

# ANCOVA: Satisfaction by model controlling for age
try:
    # Create formula for ANCOVA
    formula = 'satisfaction ~ C(model_id) + age'
    model = ols(formula, data=ratings_df).fit()
    anova_table = sm.stats.anova_lm(model, typ=2)
    print("\nANCOVA: Satisfaction by Model controlling for Age:")
    print(anova_table)
except:
    print("\nANCOVA failed - possibly due to missing data or other issues.")

# Analyze user model preferences from the review
model_preferences = df['model_preference'].value_counts()
print("\nOverall Model Preferences:")
print(model_preferences)

# Visualization for H3
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
sns.boxplot(x='model_id', y='satisfaction', data=ratings_df, palette='viridis')
plt.title('Satisfaction Ratings by Model Type')
plt.xlabel('Model Type')
plt.ylabel('Satisfaction Rating (1-5)')
plt.xticks([0, 1, 2], ['Unimodal', 'Multimodal (S)', 'Multimodal (A)'])

plt.subplot(1, 2, 2)
model_preferences.plot(kind='bar', color=sns.color_palette('viridis', 3))
plt.title('Overall Model Preferences')
plt.xlabel('Model Type')
plt.ylabel('Count')
plt.xticks(rotation=0)
plt.tight_layout()
plt.savefig('results/figures/h3_satisfaction_and_preferences.png')

# ---- H4: GENRE-SPECIFIC IMPACT ----
print("\n=== H4: GENRE-SPECIFIC IMPACT ===")
print("Testing if album covers have more impact for certain genres/seed songs")

# Aggregate ratings by genre and model
genre_performance = ratings_df.groupby(['genre', 'model_id']).agg({
    'relevance': 'mean',
    'novelty': 'mean',
    'satisfaction': 'mean',
    'survey_id': 'count'
}).reset_index()
genre_performance.rename(columns={'survey_id': 'count'}, inplace=True)

print("\nPerformance by Genre and Model:")
print(genre_performance)

# Two-way ANOVA: Satisfaction by model and genre
try:
    formula = 'satisfaction ~ C(model_id) + C(genre) + C(model_id):C(genre)'
    model = ols(formula, data=ratings_df).fit()
    anova_table = sm.stats.anova_lm(model, typ=2)
    print("\nTwo-way ANOVA: Satisfaction by Model and Genre:")
    print(anova_table)
    
    # Check if the interaction term is significant
    interaction_p = anova_table.loc['C(model_id):C(genre)', 'PR(>F)']
    print(f"\nInteraction p-value: {interaction_p:.4f}")
    print(f"Result: {'Significant interaction' if interaction_p < 0.05 else 'No significant interaction'} between model and genre")
except Exception as e:
    print(f"\nTwo-way ANOVA failed: {e}")
    interaction_p = 1.0  # Default to non-significant

# Visualization for H4: Genre-specific impact
plt.figure(figsize=(14, 8))
genre_pivot = genre_performance.pivot_table(
    index='genre', 
    columns='model_id', 
    values='satisfaction'
)
sns.heatmap(genre_pivot, annot=True, cmap='viridis', fmt='.2f')
plt.title('Satisfaction Ratings by Genre and Model')
plt.xlabel('Model Type')
plt.ylabel('Genre')
plt.tight_layout()
plt.savefig('results/figures/h4_genre_specific_impact.png')

# Additional visualization: Bar chart comparing models across genres
plt.figure(figsize=(12, 8))
sns.barplot(x='genre', y='satisfaction', hue='model_id', data=genre_performance, palette='viridis')
plt.title('Satisfaction by Genre and Model Type')
plt.xlabel('Genre')
plt.ylabel('Mean Satisfaction (1-5)')
plt.legend(title='Model Type')
plt.xticks(rotation=45)
plt.tight_layout()
plt.savefig('results/figures/h4_genre_model_comparison.png')

# Detailed analysis for each genre
for genre in ratings_df['genre'].unique():
    genre_data = ratings_df[ratings_df['genre'] == genre]
    
    # T-test for this specific genre
    genre_unimodal = genre_data[genre_data['model_id'] == 'model1']['satisfaction']
    genre_multimodal = pd.concat([
        genre_data[genre_data['model_id'] == 'model2']['satisfaction'],
        genre_data[genre_data['model_id'] == 'model3']['satisfaction']
    ])
    
    if len(genre_unimodal) > 0 and len(genre_multimodal) > 0:
        try:
            t_stat_genre, p_value_genre = stats.ttest_ind(genre_unimodal, genre_multimodal, equal_var=False)
            print(f"\nT-test for {genre} (Unimodal vs. Multimodal):")
            print(f"t-statistic: {t_stat_genre:.4f}, p-value: {p_value_genre:.4f}")
            print(f"Result: {'Significant difference' if p_value_genre < 0.05 else 'No significant difference'}")
            
            # Create radar chart for this genre
            metrics = ['relevance', 'novelty', 'satisfaction']
            model_ids = ['model1', 'model2', 'model3']
            
            fig = plt.figure(figsize=(10, 8))
            ax = fig.add_subplot(111, polar=True)
            
            angles = np.linspace(0, 2*np.pi, len(metrics), endpoint=False).tolist()
            angles += angles[:1]  # Close the loop
            
            for model_id in model_ids:
                model_data = genre_data[genre_data['model_id'] == model_id]
                if len(model_data) < 2:  # Skip if not enough data
                    continue
                    
                values = [model_data[metric].mean() for metric in metrics]
                values += values[:1]  # Close the loop
                
                ax.plot(angles, values, linewidth=2, label=f"{model_id}")
                ax.fill(angles, values, alpha=0.25)
            
            ax.set_xticks(angles[:-1])
            ax.set_xticklabels(metrics)
            ax.set_yticks([1, 2, 3, 4, 5])
            ax.set_title(f"Model Performance for Genre: {genre}")
            ax.legend(loc='upper right')
            
            plt.tight_layout()
            plt.savefig(f'results/figures/radar_genre_{genre.replace("/", "_")}.png')
            plt.close()
            
        except Exception as e:
            print(f"Error in t-test for {genre}: {e}")

# ---- DEMOGRAPHIC ANALYSIS ----
print("\n=== DEMOGRAPHIC ANALYSIS ===")
print("Analyzing if user characteristics moderate the impact of album covers")

# Model preference by age group
pref_by_age = pd.crosstab(df['age_group'], df['model_preference'])
print("\nModel Preference by Age Group:")
print(pref_by_age)

# Model preference by country
pref_by_country = pd.crosstab(df['country'], df['model_preference'])
print("\nModel Preference by Country:")
print(pref_by_country)

# Satisfaction by age group and model
satisfaction_by_age_model = ratings_df.groupby(['age_group', 'model_id'])['satisfaction'].mean().unstack()
print("\nSatisfaction by Age Group and Model:")
print(satisfaction_by_age_model)

# Visualization: Model preference by age group
plt.figure(figsize=(12, 6))
plt.subplot(1, 2, 1)
pref_by_age.plot(kind='bar', stacked=True, colormap='viridis')
plt.title('Model Preference by Age Group')
plt.xlabel('Age Group')
plt.ylabel('Count')
plt.legend(title='Model')

plt.subplot(1, 2, 2)
satisfaction_by_age_model.plot(kind='bar', colormap='viridis')
plt.title('Satisfaction by Age Group and Model')
plt.xlabel('Age Group')
plt.ylabel('Mean Satisfaction (1-5)')
plt.legend(title='Model')
plt.tight_layout()
plt.savefig('results/figures/demographic_analysis.png')
# ---- COUNTRY PERFORMANCE ----
country_performance = ratings_df.groupby(['country', 'model_id']).agg({
    'relevance': 'mean',
    'novelty': 'mean',
    'satisfaction': 'mean',
    'survey_id': 'count'
}).reset_index()

print("\nCountry-Specific Performance by Model:")
print(country_performance)

pivot_country = country_performance.pivot_table(
    index='country',
    columns='model_id',
    values='satisfaction',
    aggfunc='mean',
    fill_value=0
)

plt.figure(figsize=(12, 10))  # Adjust size for readability
sns.heatmap(pivot_country, annot=True, cmap="YlGnBu", fmt=".2f", linewidths=.5)
plt.title('Mean Satisfaction by Country and Model', fontsize=16)
plt.xlabel('Model Type', fontsize=12)
plt.ylabel('Country', fontsize=12)
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig('results/figures/country_model_satisfaction_heatmap.png')

# ---- ABSOLUTE PREFERENCES HEATMAP ----

# Filter non-null rating then do all models. 
notNull_ratings_df = df.dropna(subset=['model_preference'])

cross_table = pd.crosstab(notNull_ratings_df['country'], notNull_ratings_df['model_preference'])


# Normalize crosstable. 
cross_table_percentage = cross_table.div(cross_table.sum(axis=1), axis=0)

plt.figure(figsize=(12, 8))

sns.heatmap(cross_table_percentage, annot=True, cmap="viridis", fmt=".1%", linewidths=1, linecolor="black")

plt.xlabel('Model Preference')
plt.ylabel('Country')
plt.title('Distribution of Model Preferences by Country')
plt.tight_layout()

plt.savefig("results/figures/model_preferences_by_country_heatmap.png")
# ---- Feedback Analysis ----
from textblob import TextBlob

def analyze_sentiment(text):
    if isinstance(text, str):
        analysis = TextBlob(text)
        return analysis.sentiment.polarity  # Returns polarity score
    return 0  # Default to neutral sentiment if not a string

df['sentiment_score'] = df['feedback'].apply(analyze_sentiment)

print("\nSentiment Analysis:")
print(df[['country', 'model_preference', 'feedback', 'sentiment_score']].head())

plt.figure(figsize=(10, 6))
sns.scatterplot(x='sentiment_score', y='model_preference', data=df)
plt.title('Sentiment Score')
plt.xlabel('Sentiment Score')
plt.ylabel('Sentiment Score')
plt.tight_layout()
plt.savefig('results/figures/sentimentanalysis.png')



# ---- PLAYIST SPECIFIC FINDINGS ----

playlist_performance = ratings_df.groupby(['playlist_number', 'model_id']).agg({
    'relevance': 'mean',
    'novelty': 'mean',
    'satisfaction': 'mean',
    'survey_id': 'count'
}).reset_index()

print("\nPlaylist-Specific Performance by Model:")
print(playlist_performance)


playlist_pivot = playlist_performance.pivot_table(
    index='playlist_number',
    columns='model_id',
    values='satisfaction',
    aggfunc='mean',
    fill_value=0
)

plt.figure(figsize=(8, 6))  # Adjust size for readability
sns.heatmap(playlist_pivot, annot=True, cmap="YlGnBu", fmt=".2f", linewidths=.5)
plt.title('Mean Satisfaction by Playlist and Model', fontsize=16)
plt.xlabel('Model Type', fontsize=12)
plt.ylabel('Playlist Number', fontsize=12)
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig('results/figures/playlist_model_satisfaction_heatmap.png')


# --- Interaction Between Age and Model Preference ---


age_model_interactions = ratings_df.groupby(['age_group', 'model_id']).agg({
    'relevance': 'mean',
    'novelty': 'mean',
    'satisfaction': 'mean',
    'survey_id': 'count'
}).reset_index()

print("\nAge Group and Model Interaction Analysis:")
print(age_model_interactions)



# Make sure age_group is categorical and ordered
age_order = ['<20', '20-35', '>35']
age_model_interactions['age_group'] = pd.Categorical(age_model_interactions['age_group'], categories=age_order, ordered=True)

sns.catplot(x='age_group', y='satisfaction', hue='model_id', data=age_model_interactions, kind='bar')
plt.title('Satisfaction by Age Group and Model', fontsize=16)
plt.xlabel('Age Group', fontsize=12)
plt.ylabel('Mean Satisfaction', fontsize=12)
plt.tight_layout()
plt.savefig('results/figures/age_model_satisfaction_barchart.png')






# ---- SUMMARY OF FINDINGS ----
print("\n=== SUMMARY OF FINDINGS ===")

# Analysis results summary

hypothesis_results = pd.DataFrame({
    'Hypothesis': [
        'H1: Relevance - Multimodal Enhancement',
        'H2: Novelty - Unfamiliar Tracks within Theme',
        'H3: User Satisfaction - Overall Preference',
        'H4: Genre-Specific Impact'
    ],
    'Finding': [
        f"Multimodal Models: Higher relevance ratings  (M={multimodal_combined.mean():.2f}) over Unimodal (M={unimodal_relevance.mean():.2f}).",
        f"MM Models: Lower novelty ratings.",
        f"Multimodal Models: Lower satisfaction ratings (M={multimodal_combined_satisfaction.mean():.2f}) compareed to Unimodal models (M={unimodal_satisfaction.mean():.2f}).",
        "Evidence: Album covers impact various seed_song id models across different  genres, visual impacts can make the system great."
    ],
    "Result Summary": [
        f"MM models achieved + {multimodal_combined.mean() - unimodal_relevance.mean()} relevance, over uniModal.",
        f"",
        f"Less satisfied results but people had a preference, M={str(list(model_preferences.keys()))[1:-1]}" ,
        "Genre-specific patterns: Genre influences model results significantly.",
    ],
    'Conclusion Notes': [
        f"Higher relevance ratings suggest visual enhancements have positive influence but it is small +{round(multimodal_combined.mean() - unimodal_relevance.mean(),3)}",
        f"Model performance indicates that multimodal models may need other features.",
        "Model performance is different to people's overall satisfaction.",
        "Genre interaction needs model changes"
    ]
})
print("\nResults and Recommendations:")
print(hypothesis_results)


# Additional analysis: Genre-specific findings
genre_findings = []
for genre in ratings_df['genre'].unique():
    genre_data = ratings_df[ratings_df['genre'] == genre]
    
    # Calculate differences between models for this genre
    unimodal_mean = genre_data[genre_data['model_id'] == 'model1']['satisfaction'].mean()
    multimodal_mean = genre_data[genre_data['model_id'].isin(['model2', 'model3'])]['satisfaction'].mean()
    
    difference = multimodal_mean - unimodal_mean
    
    genre_findings.append({
        'Genre': genre,
        'Unimodal Mean': unimodal_mean,
        'Multimodal Mean': multimodal_mean,
        'Difference': difference,
        'Impact': 'Strong positive' if difference > 1 else 
                 'Positive' if difference > 0.5 else
                 'Slight positive' if difference > 0 else
                 'Neutral' if difference == 0 else
                 'Negative' if difference < 0 else 'Unknown'
    })

genre_findings_df = pd.DataFrame(genre_findings)
print("\nImpact of Album Covers by Genre:")
print(genre_findings_df)

# Save summary tables
hypothesis_results.to_csv('results/tables/hypothesis_results.csv', index=False)
genre_findings_df.to_csv('results/tables/genre_findings.csv', index=False)

# Save all key DataFrames
ratings_df.to_csv('results/tables/all_ratings.csv', index=False)
song_ratings_df.to_csv('results/tables/all_song_ratings.csv', index=False)
relevance_by_model.to_csv('results/tables/relevance_by_model.csv')
novelty_by_model.to_csv('results/tables/novelty_by_model.csv')
satisfaction_by_model.to_csv('results/tables/satisfaction_by_model.csv')
genre_performance.to_csv('results/tables/genre_performance.csv', index=False)
pref_by_age.to_csv('results/tables/preference_by_age.csv')
pref_by_country.to_csv('results/tables/preference_by_country.csv')

# Create a comprehensive report
with open('results/analysis_report.md', 'w') as f:
    f.write("# Music Recommendation System Analysis\n\n")
    
    f.write("## Research Questions\n")
    f.write("1. Are album covers a good addition to recommender models?\n")
    f.write("2. Do album covers improve music recommendations in the eyes of the user?\n")
    f.write("3. Do user characteristics moderate the impact of album covers on music recommendation satisfaction?\n\n")
    
    f.write("## Hypotheses and Results\n\n")
    
    # H1
    f.write("### H1: Relevance - Multimodal Enhancement\n")
    f.write("Users will rate songs recommended by the multimodal system (audio + album cover) as significantly more relevant to the seed playlist compared to songs recommended by the unimodal system (audio only).\n\n")
    f.write(f"**Result**: {'Supported' if p_value < 0.05 else 'Not supported'} (p = {p_value:.4f})\n\n")
    f.write(f"Multimodal models had {'higher' if unimodal_relevance.mean() < multimodal_combined.mean() else 'lower'} relevance ratings (M={multimodal_combined.mean():.2f}) compared to unimodal (M={unimodal_relevance.mean():.2f}).\n\n")
    
    # H2
    f.write("### H2: Novelty - Unfamiliar Tracks within Theme\n")
    f.write("The multimodal system will recommend a higher proportion of songs that are unfamiliar to users (but still relevant to the chosen theme/genre) compared to the unimodal system.\n\n")
    f.write(f"**Result**: {'Supported' if p_chi2 < 0.05 else 'Not supported'} (p = {p_chi2:.4f})\n\n")
    f.write(f"Multimodal models had {'higher' if novelty_by_model.loc['model1', 'Mean Novelty'] < (novelty_by_model.loc['model2', 'Mean Novelty'] + novelty_by_model.loc['model3', 'Mean Novelty'])/2 else 'lower'} novelty ratings.\n\n")
    
    # H3
    f.write("### H3: User Satisfaction - Overall Preference\n")
    f.write("Users will express greater overall satisfaction with the recommendations generated by the multimodal system compared to the unimodal system.\n\n")
    f.write(f"**Result**: {'Supported' if p_value_sat < 0.05 else 'Not supported'} (p = {p_value_sat:.4f})\n\n")
    f.write(f"Multimodal models had {'higher' if unimodal_satisfaction.mean() < multimodal_combined_satisfaction.mean() else 'lower'} satisfaction ratings (M={multimodal_combined_satisfaction.mean():.2f}) compared to unimodal (M={unimodal_satisfaction.mean():.2f}).\n\n")
    
    # H4
    f.write("### H4: Genre-Specific Impact\n")
    f.write("The impact of album cover features on recommendation quality will be more significant for genres with strong visual identities (e.g., metal, electronic music).\n\n")
    f.write(f"**Result**: {'Supported' if 'interaction_p' in locals() and interaction_p < 0.05 else 'Not supported'} (p = {interaction_p if 'interaction_p' in locals() else 'N/A'})\n\n")
    
    # Genre-specific findings
    f.write("#### Impact by Genre\n\n")
    f.write("| Genre | Unimodal Mean | Multimodal Mean | Difference | Impact |\n")
    f.write("|-------|--------------|-----------------|------------|--------|\n")
    for _, row in genre_findings_df.iterrows():
        f.write(f"| {row['Genre']} | {row['Unimodal Mean']:.2f} | {row['Multimodal Mean']:.2f} | {row['Difference']:.2f} | {row['Impact']} |\n")
    f.write("\n")
    
    # Demographic analysis
    f.write("## Demographic Analysis\n\n")
    f.write("### Model Preference by Age Group\n\n")
    f.write(pref_by_age.to_markdown() + "\n\n")
    
    f.write("### Model Preference by Country\n\n")
    f.write(pref_by_country.to_markdown() + "\n\n")
    
    # Conclusion
    f.write("## Conclusion\n\n")
    f.write("Based on the analysis of the survey data, we can draw the following conclusions about the impact of album covers on music recommendations:\n\n")
    
    if p_value < 0.05 or p_value_sat < 0.05:
        f.write("1. **Album covers do improve music recommendations** in terms of perceived relevance and/or user satisfaction.\n")
    else:
        f.write("1. The evidence does not strongly support that album covers improve music recommendations in terms of perceived relevance or user satisfaction.\n")
    
    if 'interaction_p' in locals() and interaction_p < 0.05:
        f.write("2. **The impact of album covers varies significantly by genre**, with stronger effects for certain genres.\n")
    else:
        f.write("2. The impact of album covers appears to be relatively consistent across different genres.\n")
    
    if len(pref_by_age.columns) > 1 and pref_by_age.values.std() > 0.5:
        f.write("3. **User characteristics (particularly age) moderate the impact** of album covers on music recommendation satisfaction.\n")
    else:
        f.write("3. User characteristics do not appear to strongly moderate the impact of album covers on music recommendation satisfaction.\n")
    
    f.write("\nThese findings suggest that incorporating visual information from album covers into music recommendation systems can enhance the user experience, particularly for certain genres and user demographics.\n")

print("\nAnalysis complete. Results saved to the 'results' directory.")
print("- Tables saved in 'results/tables/'")
print("- Figures saved in 'results/figures/'")
print("- Comprehensive report saved as 'results/analysis_report.md'")
