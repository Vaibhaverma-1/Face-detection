import { useContext, useEffect, useRef, useState } from "react";
import { WebcamContext } from "../context/WebcamContext";
import { FaVideoSlash } from "react-icons/fa";
import * as faceapi from "face-api.js";
import Information from "./Information";

interface Props {
  darkMode: boolean;
}

export default function Display({ darkMode }: Props) {
  const [gender, setGender] = useState("");
  const [genderProb, setGenderProb] = useState(0);
  const [topEmotion, setTopEmotion] = useState("");
  const [emotionConfidence, setEmotionConfidence] = useState(0);
  const [age, setAge] = useState(0);

  const { stream, error } = useContext(WebcamContext);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

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

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
      videoRef.current.play();
      console.log("🎥 Webcam stream attached");
    }
  }, [stream]);

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

        const displaySize = {
          width: video.videoWidth,
          height: video.videoHeight,
        };

        canvas.width = displaySize.width;
        canvas.height = displaySize.height;
        faceapi.matchDimensions(canvas, displaySize);

        const detections = await faceapi
          .detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
          .withAgeAndGender()
          .withFaceExpressions();

        const resized = faceapi.resizeResults(detections, displaySize);
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        resized.forEach(
          ({ detection, age, gender, genderProbability, expressions }) => {
            const { x, y, width, height } = detection.box;
            const sortedExpressions = Object.entries(expressions).sort(
              (a, b) => b[1] - a[1]
            );
            const emotion = sortedExpressions[0][0];
            const emotionProb = sortedExpressions[0][1];

            setGender(gender);
            setGenderProb(genderProbability);
            setTopEmotion(emotion);
            setEmotionConfidence(emotionProb);
            setAge(age);

            const label = `Age: ${age.toFixed(0)}, Gender: ${gender} (${(
              genderProbability * 100
            ).toFixed(0)}%), Emotion: ${emotion}`;

            ctx.strokeStyle = "lime";
            ctx.lineWidth = 2;
            ctx.strokeRect(x, y, width, height);

            ctx.font = "14px sans-serif";
            ctx.fillStyle = "lime";
            ctx.fillText(label, x, y - 10);
          }
        );
      }

      animationId = requestAnimationFrame(detectFaces);
    };

    if (modelsLoaded && stream) {
      animationId = requestAnimationFrame(detectFaces);
    }

    return () => cancelAnimationFrame(animationId);
  }, [modelsLoaded, stream]);

  return (
    <div className="text-center d-flex flex-column align-items-center position-relative w-100">
      <div className="fs-6 fw-semibold mb-1">Webcam View</div>
      {stream && <span className="badge bg-success mb-2">Webcam On</span>}

      <div style={{ position: "relative", width: "100%", maxWidth: "480px" }}>
        {stream ? (
          <>
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

      {/* Info chart below webcam */}
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
