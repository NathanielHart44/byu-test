from PIL import Image
import cv2
import numpy as np
import tensorflow as tf
import threading
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils
import time
import logging

logger = logging.getLogger(__name__)
logging.basicConfig(level=logging.INFO)

# Paths
PATH_TO_MODEL_DIR = 'byutest/data/saved_model'
PATH_TO_LABELS = 'byutest/data/label_map.pbtxt'

# Load the model
print('Loading model...')
detect_fn = tf.saved_model.load(PATH_TO_MODEL_DIR)

category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)

latest_stats = {'occupiedSpaces': 0, 'totalSpaces': 100}

def test_image(image_path):
    try:
        image = cv2.imread(image_path)
        
        if image is None:
            print(f"Failed to load image at {image_path}")
            return

        image_rgb = cv2.cvtColor(image, cv2.COLOR_BGR2RGB)

        detections = detect_vehicles(image_rgb)

        update_stats(detections)
        print("Showing test image stats...")
        print(get_latest_stats())
    except Exception as e:
        logger.ERROR(f"Failed to process image at {image_path}: {e}")

def detect_vehicles(image):
    try:
        """Detect vehicles in the image."""
        input_tensor = tf.convert_to_tensor(image)
        input_tensor = input_tensor[tf.newaxis, ...]

        detections = detect_fn(input_tensor)

        num_detections = int(detections.pop('num_detections'))
        detections = {key: value[0, :num_detections].numpy()
                    for key, value in detections.items()}
        detections['num_detections'] = num_detections
        detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

        return detections
    except Exception as e:
        logger.ERROR(f"Failed to detect vehicles: {e}")
        return None

def update_stats(detections):
    """
    Update the global `latest_stats` based on detections.
    This is a placeholder function; you'll need to implement actual logic
    based on your detection results and parking lot layout.
    """
    occupied_spaces = len([d for d in detections['detection_classes'] if d == 1])
    latest_stats['occupiedSpaces'] = occupied_spaces

# repurpose to grab screenshot of current videofeed from cameras
# (optionally have camera systems take the screenshot and ping an endpoint with the image)
def process_video_feed(video_source):
    try:
        cap = cv2.VideoCapture(video_source)
        last_update_time = time.time()  # Initialize with the current time

        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                print("Failed to grab frame")
                break

            current_time = time.time()
            if current_time - last_update_time >= 60:
                image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                detections = detect_vehicles(image_np)
                update_stats(detections)
                print(f"Updated stats: {latest_stats}")

                last_update_time = current_time

        cap.release()
    except Exception as e:
        logger.ERROR(f"Failed to process video feed: {e}")

def get_latest_stats():
    """Return the latest parking lot statistics."""
    return latest_stats

def start_processing(video_source):
    """Start processing the video feed in a background thread."""
    thread = threading.Thread(target=process_video_feed, args=(video_source,))
    thread.daemon = True 
    thread.start()
