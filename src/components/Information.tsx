// components/Information.tsx
import { FaInfoCircle } from "react-icons/fa";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

interface Props {
  gender: string;
  genderProbability: number;
  topEmotion: string;
  emotionConfidence: number;
  age: number;
}

export default function Information({
  gender,
  genderProbability,
  topEmotion,
  emotionConfidence,
  age,
}: Props) {
  const malePercent =
    gender === "male" ? genderProbability * 100 : (1 - genderProbability) * 100;
  const femalePercent = 100 - malePercent;

  return (
    <div className="text-center w-100">
      <div className="fs-5 mb-3">
        <FaInfoCircle className="me-2" />
        Detected Features
      </div>

      <div className="d-flex justify-content-center flex-wrap gap-4">
        {/* Gender: Male */}
        <div style={{ width: 100 }}>
          <CircularProgressbar
            value={malePercent}
            text={`Male ${malePercent.toFixed(0)}%`}
            styles={buildStyles({
              textSize: "12px",
              pathColor: "dodgerblue",
              textColor: "#000",
            })}
          />
        </div>

        {/* Gender: Female */}
        <div style={{ width: 100 }}>
          <CircularProgressbar
            value={femalePercent}
            text={`Female ${femalePercent.toFixed(0)}%`}
            styles={buildStyles({
              textSize: "12px",
              pathColor: "hotpink",
              textColor: "#000",
            })}
          />
        </div>

        {/* Top Emotion */}
        <div style={{ width: 100 }}>
          <CircularProgressbar
            value={emotionConfidence * 100}
            text={`${topEmotion} ${(emotionConfidence * 100).toFixed(0)}%`}
            styles={buildStyles({
              textSize: "12px",
              pathColor: "orange",
              textColor: "#000",
            })}
          />
        </div>

        {/* Age */}
        <div style={{ width: 100 }}>
          <CircularProgressbar
            value={Math.min(age, 100)}
            text={`Age ${Math.floor(age)}`}
            styles={buildStyles({
              textSize: "12px",
              pathColor: "green",
              textColor: "#000",
            })}
          />
        </div>
      </div>
    </div>
  );
}
