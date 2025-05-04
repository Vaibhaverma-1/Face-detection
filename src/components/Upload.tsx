import { FaUpload } from "react-icons/fa";

export default function Upload() {
  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/*";
    input.click();
  };

  return (
    <button className="icon-button" onClick={handleUpload}>
      <FaUpload size={24} />
    </button>
  );
}
