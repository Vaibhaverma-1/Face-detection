import React, { createContext, useState } from "react";

interface WebcamContextType {
  stream: MediaStream | null;
  startWebcam: () => Promise<void>;
  stopWebcam: () => void;
  error: string;
  setError: (val: string) => void;
}

export const WebcamContext = createContext<WebcamContextType>({
  stream: null,
  startWebcam: async () => {},
  stopWebcam: () => {},
  error: "",
  setError: () => {},
});

export const WebcamProvider = ({ children }: { children: React.ReactNode }) => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState("");

  const startWebcam = async () => {
    try {
      setError("");
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      setStream(mediaStream);
    } catch (err) {
      console.error("Webcam error:", err);
      setError("Webcam access denied or unavailable. Please allow permission.");
    }
  };

  const stopWebcam = () => {
    stream?.getTracks().forEach((track) => track.stop());
    setStream(null);
  };

  return (
    <WebcamContext.Provider
      value={{ stream, startWebcam, stopWebcam, error, setError }}
    >
      {children}
    </WebcamContext.Provider>
  );
};
