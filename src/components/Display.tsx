import { useContext, useEffect, useRef, useState } from "react";
import { WebcamContext } from "../context/WebcamContext";
import { FaVideoSlash } from "react-icons/fa";
import * as faceapi from "face-api.js";
import Information from "./Information";

interface Props {
  darkMode: boolean;
}

export default function Display({ darkMode }: Props) {
  // State variables for facial data output
  const [gender, setGender] = useState("");
  const [genderProb, setGenderProb] = useState(0);
  const [topEmotion, setTopEmotion] = useState("");
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [age, setAge] = useState(0);

  // Access webcam stream from context
  const { stream, error } = useContext(WebcamContext);

  // Refs for the video and canvas elements
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Load FaceAPI models from the /models directory once when component mounts
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models";
      await Promise.all([
        faceapi.nets.tinyFaceDetector.loadFromUri(
          `${MODEL_URL}/tiny_face_detector`
        ),
        faceapi.nets.ageGenderNet.loadFromUri(`${MODEL_URL}/age_gender_model`),
        faceapi.nets.faceExpressionNet.loadFromUri(
          `${MODEL_URL}/face_expression`
        ),
      ]);
      console.log("✅ FaceAPI models loaded");
      setModelsLoaded(true);
    };

    loadModels();
  }, []);

  // Attach the webcam stream to the <video> element once it's available
  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      console.log("🎥 Webcam stream attached");
    }
  }, [stream]);

  // Detect faces and draw results continuously using requestAnimationFrame
  useEffect(() => {
    let animationId: number;

    const detectFaces = async () => {
      if (
        modelsLoaded &&
        videoRef.current &&
        videoRef.current.readyState === 4 &&
        canvasRef.current
      ) {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        // Match canvas size to video feed dimensions
        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };
        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        faceapi.matchDimensions(canvas, displaySize);

        // Run face detection and include age, gender, and expressions
        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withAgeAndGender()
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);

        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Process each detected face
        resized.forEach(
          ({ detection, age, gender, genderProbability, expressions }) => {
            const { x, y, width, height } = detection.box;

            // Extract the most confident emotion
            const sortedExpressions = Object.entries(expressions).sort(
              (a, b) => b[1] - a[1]
            );
            const emotion = sortedExpressions[0][0];
            const emotionProb = sortedExpressions[0][1];

            // Update states for display in the UI
            setGender(gender);
            setGenderProb(genderProbability);
            setTopEmotion(emotion);
            setEmotionConfidence(emotionProb);
            setAge(age);

            // Draw bounding box and label text on canvas
            const label = `Age: ${age.toFixed(0)}, Gender: ${gender} (${(
              genderProbability * 100
            ).toFixed(0)}%), Emotion: ${emotion}`;
            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);
            ctx.font = "16px sans-serif";
            ctx.fillStyle = "lime";
            ctx.fillText(label, x, y - 10);
          }
        );
      }

      // Repeat detection on next animation frame
      animationId = requestAnimationFrame(detectFaces);
    };

    // Start detection if models are loaded and webcam is active
    if (modelsLoaded && stream) {
      animationId = requestAnimationFrame(detectFaces);
    }

    // Cleanup on unmount
    return () => cancelAnimationFrame(animationId);
  }, [modelsLoaded, stream]);

  return (
    <div className="text-center d-flex flex-column align-items-center position-relative w-100">
      <div className="fs-5 fw-semibold mb-2">Webcam View</div>
      {stream && <span className="badge bg-success mb-2">Webcam On</span>}

      {/* Container for webcam and overlay canvas */}
      <div style={{ position: "relative", width: "100%", maxWidth: "720px" }}>
        {stream ? (
          <>
            {/* Video feed */}
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                width: "100%",
                height: "auto",
                borderRadius: "12px",
                zIndex: 1,
              }}
            />
            {/* Canvas overlay for drawing face data */}
            <canvas
              ref={canvasRef}
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 2,
              }}
            />
          </>
        ) : error ? (
          <>
            <FaVideoSlash
              size="60%"
              className="mb-3"
              color={darkMode ? "#fff" : "#000"}
            />
            <p className="text-danger fw-medium">{error}</p>
          </>
        ) : (
          <>
            <FaVideoSlash
              size="60%"
              className="mb-3"
              color={darkMode ? "#fff" : "#000"}
            />
            <p>Waiting for webcam...</p>
          </>
        )}
      </div>

      {/* Pass face data to Information section below webcam */}
      <div className="mt-3 w-100 d-flex justify-content-center">
        <Information
          gender={gender}
          genderProbability={genderProb}
          topEmotion={topEmotion}
          emotionConfidence={emotionConfidence}
          age={age}
        />
      </div>
    </div>
  );
}
