import pandas as pd
import argparse
import os

def remove_shape_columns(input_csv, output_csv=None, columns_to_remove=None):
    """
    Remove specified shape columns from a CSV file.
    
    Parameters:
        input_csv (str): Path to the input CSV file.
        output_csv (str): Path to save the output CSV file. If None, will modify the input filename.
        columns_to_remove (list): List of column names to remove. If None, will use default shape columns.
    
    Returns:
        str: Path to the output CSV file.
    """
    # Default columns to remove if not specified
    if columns_to_remove is None:
        columns_to_remove = [
            'rgb_histogram_shapes',
            'hsv_histogram_shapes',
            'edge_map_shape',
            'lbp_histogram_shape'
        ]
    
    # Generate output filename if not provided
    if output_csv is None:
        base, ext = os.path.splitext(input_csv)
        output_csv = f"{base}_cleaned{ext}"
    
    # Read the CSV file
    print(f"Reading CSV file: {input_csv}")
    df = pd.read_csv(input_csv)
    
    # Check which columns exist in the dataframe
    columns_found = [col for col in columns_to_remove if col in df.columns]
    columns_not_found = [col for col in columns_to_remove if col not in df.columns]
    
    if not columns_found:
        print("None of the specified columns were found in the CSV.")
        return input_csv
    
    # Print information about columns
    print(f"Found {len(columns_found)} columns to remove: {columns_found}")
    if columns_not_found:
        print(f"These columns were not found: {columns_not_found}")
    
    # Show sample values from columns to be removed
    print("\nSample values from columns to be removed:")
    for col in columns_found:
        unique_values = df[col].unique()
        print(f"{col}: {unique_values[:5]} {'...' if len(unique_values) > 5 else ''}")
    
    # Remove the columns
    df_cleaned = df.drop(columns=columns_found)
    
    # Save the cleaned dataframe
    df_cleaned.to_csv(output_csv, index=False)
    print(f"\nRemoved {len(columns_found)} columns. Saved cleaned CSV to: {output_csv}")
    print(f"Original columns: {len(df.columns)}, New columns: {len(df_cleaned.columns)}")
    
    return output_csv

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Remove shape columns from CSV file')
    parser.add_argument('--input', required=True, help='Path to input CSV file')
    parser.add_argument('--output', help='Path to output CSV file (optional)')
    parser.add_argument('--columns', nargs='+', help='Specific columns to remove (optional)')
    
    args = parser.parse_args()
    
    remove_shape_columns(args.input, args.output, args.columns)
