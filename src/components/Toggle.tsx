import { FaSun, FaMoon } from "react-icons/fa";

interface Props {
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export default function Toggle({ darkMode, setDarkMode }: Props) {
  return (
    <button
      className="icon-button"
      onClick={() => setDarkMode(!darkMode)}
      title="Toggle Appearance"
    >
      {darkMode ? <FaMoon size={24} /> : <FaSun size={24} />}
    </button>
  );
}
