import { useRef, useState } from "react";
import axios from "axios";
import Webcam from "react-webcam";

export default function App() {

  const webcamRef = useRef(null);

  const [image, setImage] = useState(null);

  const [preview, setPreview] = useState("");

  const [detections, setDetections] =
    useState([]);

  const [loading, setLoading] =
    useState(false);

  // Upload image
  const handleImage = (e) => {

    const file = e.target.files[0];

    if (file) {

      setImage(file);

      setPreview(
        URL.createObjectURL(file)
      );
    }
  };

  // Detect uploaded image
  const detectImage = async () => {

    if (!image) {

      alert("Please upload image");

      return;
    }

    try {

      setLoading(true);

      const formData = new FormData();

      formData.append("file", image);

      const response = await axios.post(

        "http://127.0.0.1:5000/detect",

        formData
      );

      if (response.data.detections) {

        setDetections(
          response.data.detections
        );
      }

    } catch (error) {

      console.log(error);

      alert("Backend Error");
    }

    setLoading(false);
  };

  // Webcam capture
  const captureWebcam = async () => {

    try {

      setLoading(true);

      const imageSrc =
        webcamRef.current.getScreenshot();

      if (!imageSrc) {

        alert("Webcam not ready");

        setLoading(false);

        return;
      }

      const blob = await fetch(imageSrc)
        .then(res => res.blob());

      const formData = new FormData();

      formData.append(
        "file",
        blob,
        "webcam.jpg"
      );

      const response = await axios.post(

        "http://127.0.0.1:5000/detect",

        formData
      );

      if (response.data.detections) {

        setDetections(
          response.data.detections
        );
      }

    } catch (error) {

      console.log(error);

      alert("Webcam Detection Error");
    }

    setLoading(false);
  };

  return (

    <div style={styles.container}>

      <h1 style={styles.title}>
        VidyutNet ⚡
      </h1>

      <p style={styles.subtitle}>
        AI Electronics Detection System
      </p>

      <div style={styles.grid}>

        {/* Upload */}
        <div style={styles.card}>

          <h2>📷 Upload Image</h2>

          <input
            type="file"
            onChange={handleImage}
          />

          {preview && (

            <img
              src={preview}
              alt="preview"
              style={styles.image}
            />
          )}

          <button
            onClick={detectImage}
            style={styles.button}
          >

            {loading
              ? "Detecting..."
              : "Detect Uploaded Image"}

          </button>

        </div>

        {/* Webcam */}
        <div style={styles.card}>

          <h2>🎥 Live Webcam</h2>

          <Webcam
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            style={styles.image}
          />

          <button
            onClick={captureWebcam}
            style={styles.button}
          >

            {loading
              ? "Detecting..."
              : "Capture & Detect"}

          </button>

        </div>

      </div>

      {/* Results */}
      <div style={styles.resultSection}>

        <h2>
          🤖 Detection Results
        </h2>

        {detections.length === 0 && (

          <p>
            No detections yet.
          </p>
        )}

        {detections.map((item, index) => (

          <div
            key={index}
            style={styles.resultCard}
          >

            <h3>
              {item.label}
            </h3>

            <p>
              {item.explanation}
            </p>

            <p>
              Confidence:
              {item.confidence}%
            </p>

            <p>
              Time:
              {item.timestamp}
            </p>

          </div>
        ))}

      </div>

    </div>
  );
}

const styles = {

  container: {

    minHeight: "100vh",

    background:
      "linear-gradient(135deg,#020617,#111827,#000000)",

    padding: "30px",

    color: "white",

    fontFamily: "Arial"
  },

  title: {

    textAlign: "center",

    fontSize: "60px",

    color: "#facc15"
  },

  subtitle: {

    textAlign: "center",

    color: "#94a3b8",

    marginBottom: "40px"
  },

  grid: {

    display: "grid",

    gridTemplateColumns:
      "1fr 1fr",

    gap: "30px"
  },

  card: {

    background:
      "rgba(255,255,255,0.05)",

    padding: "25px",

    borderRadius: "20px"
  },

  image: {

    width: "100%",

    borderRadius: "15px",

    marginTop: "20px"
  },

  button: {

    width: "100%",

    marginTop: "20px",

    padding: "15px",

    border: "none",

    borderRadius: "12px",

    background: "#facc15",

    fontWeight: "bold",

    cursor: "pointer"
  },

  resultSection: {

    marginTop: "40px",

    background:
      "rgba(255,255,255,0.05)",

    padding: "25px",

    borderRadius: "20px"
  },

  resultCard: {

    background: "#111827",

    padding: "20px",

    borderRadius: "15px",

    marginTop: "20px"
  }
};