import Toggle from "./Toggle";
import Upload from "./Upload";
import WebcamToggle from "./WebcamToggle";

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Navbar({ darkMode, setDarkMode }: Props) {
  return (
    <nav
      className={`d-flex justify-content-between align-items-center px-4 py-3 sticky-top ${
        darkMode ? "navbar-dark" : "navbar-light"
      }`}
    >
      <span
        className="fw-bold"
        style={{ fontSize: "1.75rem", color: darkMode ? "#fff" : "#000" }}
      >
        FaceVision
      </span>
      <div className="d-flex align-items-end gap-4 ms-auto text-center">
        <Toggle darkMode={darkMode} setDarkMode={setDarkMode} />
        <Upload />
        <WebcamToggle />
      </div>
    </nav>
  );
}
