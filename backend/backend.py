from flask import Flask, request, jsonify
from flask_cors import CORS
from ultralytics import YOLO
from datetime import datetime
import os

print("⚡ Starting VidyutNet Backend")

# Flask App
app = Flask(__name__)

# Enable CORS
CORS(app)

# Load YOLO Model
print("📦 Loading YOLO Model...")

model = YOLO(
    "E:/Vidyut_net/model/best.pt"
)

print("✅ Model Loaded")

# Detection History
history = []

# Component Explanations
component_info = {

    "Resistor":
    "A resistor limits electric current.",

    "Capacitor":
    "A capacitor stores electrical energy.",

    "Diode":
    "A diode allows current in one direction.",

    "LED":
    "An LED emits light when current passes through it.",

    "Transistor":
    "A transistor is used for switching and amplification."
}

# Home Route
@app.route('/')

def home():

    return jsonify({

        "project": "VidyutNet",

        "status": "Running",

        "version": "2.0"
    })

# Detection Route
@app.route('/detect', methods=['POST'])

def detect():

    print("📸 Detection Request Received")

    # Receive file
    file = request.files['file']

    # Save temp image
    path = "temp.jpg"

    file.save(path)

    print("💾 Image Saved")

    # YOLO Detection
    results = model(path)

    detections = []

    # Process detections
    for box in results[0].boxes:

        cls_id = int(box.cls[0])

        confidence = float(box.conf[0])

        label = model.names[cls_id]

        explanation = component_info.get(

            label,

            "No explanation available."
        )

        detection_data = {

            "label": label,

            "confidence":
            round(confidence * 100, 2),

            "explanation":
            explanation,

            "timestamp":
            datetime.now().strftime(
                "%H:%M:%S"
            )
        }

        detections.append(
            detection_data
        )

        history.append(
            detection_data
        )

    print("✅ Detection Complete")

    return jsonify({

        "success": True,

        "total_detections":
        len(detections),

        "detections":
        detections,

        "history":
        history[-10:]
    })

# History Route
@app.route('/history')

def get_history():

    return jsonify({

        "history":
        history[-20:]
    })

# Start Server
if __name__ == "__main__":

    app.run(

        debug=True,

        host="0.0.0.0",

        port=5000
    )