import { Modal, Button } from "react-bootstrap";
import { FaMicrophone, FaVolumeUp, FaSearchPlus, FaSearchMinus, FaAdjust, FaSearch } from "react-icons/fa";

function HelpModal({ show, handleClose }) {
  const helpItems = [
    { 
      icon: <FaMicrophone />, 
      text: "Enable Voice Command: Click and speak a command to control accessibility features.",
      commands: [
        "'open menu' - Opens the accessibility menu",
        "'close menu' - Closes the accessibility menu",
        "'increase font size' - Makes text larger",
        "'decrease font size' - Makes text smaller",
        "'enable contrast' - Turns on high contrast mode",
        "'disable contrast' - Turns off high contrast mode",
        "'zoom in' - Zooms in on the page",
        "'zoom out' - Resets the zoom level",
        "'read aloud' - Enables text-to-speech",
        "'open help' - Opens this help menu",
        "'close help' - Closes this help menu",
      ]
      
    },
    { icon: <FaVolumeUp />, text: "Enable Read Aloud: Click to have the website read text aloud for you. Ensure your volume is up." },
    { icon: <FaSearchPlus />, text: "Increase Font Size: Click to make the text larger for easier reading." },
    { icon: <FaSearchMinus />, text: "Decrease Font Size: Click to make the text smaller if it's too big." },
    { icon: <FaAdjust />, text: "Toggle Contrast: Simplifies the website design to highlight important information." },
    { icon: <FaSearch />, text: "Magnify: Zooms in to view text and images in greater detail." },
  ];

  const formatText = (text) => {
    const parts = text.split(":");
    return (
      <span>
        <strong>{parts[0]}:</strong>{parts.slice(1).join(":")}
      </span>
    );
  };

  return (
    <Modal show={show} onHide={handleClose} backdrop="static" keyboard={false}>
      <Modal.Header closeButton>
        <Modal.Title>Accessibility Help</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {helpItems.map((item, index) => (
          <div key={index} style={{ marginBottom: "10px" }}>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ 
                flexShrink: 0, 
                width: "40px", 
                height: "40px", 
                background: "#6b6034", 
                borderRadius: "50%", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center", 
                color: "white", 
                fontSize: "1.2rem", 
                marginRight: "10px" 
              }}>
                {item.icon}
              </div>
              <span>{formatText(item.text)}</span>
            </div>
            
            {/* Render the command list if it exists */}
            {item.commands && (
              <ul style={{ paddingLeft: "50px", marginTop: "5px", fontSize: "0.9rem", color: "#555" }}>
                {item.commands.map((command, cmdIndex) => (
                  <li key={cmdIndex}>{command}</li>
                ))}
              </ul>
            )}

            {index < helpItems.length - 1 && <hr style={{ border: "0.5px solid #ddd", margin: "10px 0" }} />} 
          </div>
        ))}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default HelpModal;
