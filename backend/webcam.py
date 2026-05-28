import cv2
import time
from ultralytics import YOLO

# Load model
model = YOLO("E:/Vidyut_net/model/best.pt")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():

    print("Camera not working")

    exit()

# Detection history
history = []

# FPS variables
prev_time = 0

while True:

    ret, frame = cap.read()

    if not ret:

        break

    # YOLO Tracking
    results = model.track(
        frame,
        persist=True
    )

    # Draw detections
    annotated_frame = results[0].plot()

    # FPS Calculation
    current_time = time.time()

    fps = 1 / (current_time - prev_time)

    prev_time = current_time

    # Show FPS
    cv2.putText(

        annotated_frame,

        f"FPS: {int(fps)}",

        (20, 40),

        cv2.FONT_HERSHEY_SIMPLEX,

        1,

        (0, 255, 255),

        2
    )

    # Detection history
    if len(results[0].boxes) > 0:

        for box in results[0].boxes:

            cls_id = int(box.cls[0])

            label = model.names[cls_id]

            # Save unique history
            if label not in history:

                history.append(label)

    # Show history
    y = 80

    for item in history[-5:]:

        cv2.putText(

            annotated_frame,

            f"Detected: {item}",

            (20, y),

            cv2.FONT_HERSHEY_SIMPLEX,

            0.8,

            (0, 255, 0),

            2
        )

        y += 30

    # Show webcam
    cv2.imshow(

        "VidyutNet Live AI",

        annotated_frame
    )

    # Quit
    if cv2.waitKey(1) & 0xFF == ord('q'):

        break

cap.release()

cv2.destroyAllWindows()