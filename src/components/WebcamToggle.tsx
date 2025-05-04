import { FaCamera } from "react-icons/fa";
import { useContext } from "react";
import { WebcamContext } from "../context/WebcamContext";

export default function WebcamToggle() {
  const { stream, startWebcam, stopWebcam } = useContext(WebcamContext);
  const enabled = !!stream;

  const handleClick = async () => {
    if (enabled) {
      stopWebcam();
    } else {
      await startWebcam(); // ✅ Force async permission request
    }
  };

  return (
    <button
      className={`icon-button ${enabled ? "icon-active" : ""}`}
      onClick={handleClick}
      title={enabled ? "Turn Off Webcam" : "Turn On Webcam"}
    >
      <FaCamera size={24} />
    </button>
  );
}
