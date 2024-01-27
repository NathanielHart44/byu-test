from PIL import Image
import cv2
import numpy as np
import tensorflow as tf
from object_detection.utils import label_map_util
from object_detection.utils import visualization_utils as viz_utils

# Path to the frozen detection graph .pb file, which contains the model.
PATH_TO_MODEL_DIR = 'byutest/data/saved_model'

# Path to the label map file
PATH_TO_LABELS = 'byutest/data/label_map.pbtxt'

# Load the model
print('Loading model...')
detect_fn = tf.saved_model.load(PATH_TO_MODEL_DIR)

# Load the label map
category_index = label_map_util.create_category_index_from_labelmap(PATH_TO_LABELS, use_display_name=True)

def load_image_into_numpy_array(path):
    """Load an image from file into a numpy array."""
    return np.array(Image.open(path))

def detect_vehicles(image):
    """Detect vehicles in the image."""
    input_tensor = tf.convert_to_tensor(image)
    input_tensor = input_tensor[tf.newaxis, ...]

    detections = detect_fn(input_tensor)

    num_detections = int(detections.pop('num_detections'))
    detections = {key: value[0, :num_detections].numpy()
                  for key, value in detections.items()}
    detections['num_detections'] = num_detections

    # Detection_classes should be ints.
    detections['detection_classes'] = detections['detection_classes'].astype(np.int64)

    return detections

def process_video(video_path):
    """Process a video file to detect vehicles frame by frame."""
    video = cv2.VideoCapture(video_path)
    while video.isOpened():
        ret, frame = video.read()
        if not ret:
            break

        # Convert the frame to RGB
        image_np = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)

        # Actual detection
        detections = detect_vehicles(image_np)

        # Visualization of the results of a detection
        viz_utils.visualize_boxes_and_labels_on_image_array(
            image_np,
            detections['detection_boxes'],
            detections['detection_classes'],
            detections['detection_scores'],
            category_index,
            use_normalized_coordinates=True,
            max_boxes_to_draw=200,
            min_score_thresh=.30,
            agnostic_mode=False)

        # Convert back to BGR for OpenCV
        image_np_bgr = cv2.cvtColor(image_np, cv2.COLOR_RGB2BGR)
        cv2.imshow('Parking Lot Detection', image_np_bgr)

        if cv2.waitKey(25) & 0xFF == ord('q'):
            break

    video.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    process_video('path/to/your/video/file')

