# filepath: c:\Users\nikla\Documents\Projects\NB302289-Comp302\tests\test_extract_cnn.py
import unittest
import os
import sys
import pandas as pd
import numpy as np

# Add the project root to the Python path
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from extract_cnn import extract_deep_features, extract_traditional_features, extract_features, process_images_with_features
import shutil

class TestFeatureExtraction(unittest.TestCase):

    def setUp(self):
        # Create a dummy CSV file and image for testing
        self.test_csv = 'test_images.csv'
        self.test_image = 'test_image.jpg'
        self.output_csv = 'test_images_output.csv'
        self.output_pickle = 'test_features.pkl'

        # Create a directory for test outputs
        self.test_output_dir = 'test_output'
        os.makedirs(self.test_output_dir, exist_ok=True)

        # Create a simple test image (black square)
        img = np.zeros((100, 100, 3), dtype=np.uint8)
        img[25:75, 25:75] = [255, 255, 255]  # White square
        import cv2
        cv2.imwrite(self.test_image, img)

        # Create a DataFrame and save it to a CSV file
        self.df = pd.DataFrame({'image_path': [self.test_image]})
        self.df.to_csv(self.test_csv, index=False)

        # Create a DataFrame with an invalid image path
        self.invalid_df = pd.DataFrame({'image_path': ['invalid_image.jpg']})
        self.invalid_df.to_csv('invalid_images.csv', index=False)

    def tearDown(self):
        # Remove the created files and directory
        os.remove(self.test_csv)
        os.remove(self.test_image)
        if os.path.exists(self.output_csv):
            os.remove(self.output_csv)
        if os.path.exists(self.output_pickle):
            os.remove(self.output_pickle)
        if os.path.exists('invalid_images.csv'):
            os.remove('invalid_images.csv')
        shutil.rmtree(self.test_output_dir, ignore_errors=True)

    def test_extract_deep_features(self):
        features, _ = extract_deep_features(self.test_image)
        self.assertEqual(len(features), 1280)

    def test_extract_traditional_features(self):
        features = extract_traditional_features(self.test_image)
        self.assertGreater(len(features), 0)

    def test_extract_features_deep(self):
        index, features = extract_features((self.test_image, 0, 'deep', 'efficientnet_v2'))
        self.assertEqual(len(features), 1280)
        self.assertEqual(index, 0)

    def test_extract_features_traditional(self):
        index, features = extract_features((self.test_image, 0, 'traditional', 'efficientnet_v2'))
        self.assertGreater(len(features), 0)
        self.assertEqual(index, 0)

    def test_extract_features_both(self):
        index, features = extract_features((self.test_image, 0, 'both', 'efficientnet_v2'))
        self.assertGreater(len(features), 1280)
        self.assertEqual(index, 0)

    def test_process_images_with_features(self):
        output_csv_path = os.path.join(self.test_output_dir, 'output.csv')
        features_pickle_path = os.path.join(self.test_output_dir, 'features.pkl')

        df, features_dict = process_images_with_features(
            self.test_csv,
            method='deep',
            model_name='efficientnet_v2',
            output_csv_path=output_csv_path,
            features_pickle_path=features_pickle_path,
            num_workers=1
        )

        self.assertTrue(os.path.exists(output_csv_path))
        self.assertTrue(os.path.exists(features_pickle_path))
        self.assertEqual(len(features_dict), 1)
        self.assertIn(0, features_dict)
        self.assertEqual(df['deep_efficientnet_v2_extracted'].iloc[0], True)

    def test_process_images_with_features_invalid_image(self):
        output_csv_path = os.path.join(self.test_output_dir, 'invalid_output.csv')
        features_pickle_path = os.path.join(self.test_output_dir, 'invalid_features.pkl')

        df, features_dict = process_images_with_features(
            'invalid_images.csv',
            method='deep',
            model_name='efficientnet_v2',
            output_csv_path=output_csv_path,
            features_pickle_path=features_pickle_path,
            num_workers=1
        )

        self.assertTrue(os.path.exists(output_csv_path))
        self.assertTrue(os.path.exists(features_pickle_path))
        self.assertEqual(len(features_dict), 0)
        self.assertEqual(df['deep_efficientnet_v2_extracted'].iloc[0], False)

    def test_invalid_model_name(self):
        with self.assertRaises(ValueError):
            extract_deep_features(self.test_image, model_name='invalid_model')

if __name__ == '__main__':
    unittest.main()