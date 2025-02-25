import { useState, useEffect } from "react";
import {
  FaUniversalAccess,
  FaSearchPlus,
  FaSearchMinus,
  FaAdjust,
  FaSearch,
  FaMicrophone,
  FaVolumeUp,
  FaQuestionCircle,
} from "react-icons/fa";
import ToastMessage from "./ToastMessage";
import { createRoot } from "react-dom/client";
import HelpModal from "./HelpModal";
import { transcribeSpeech } from "../awsFunctions/awsTranscribe";
import { synthesizeSpeech } from "../awsFunctions/awsPolly";

const AccessibilityMenu = () => {
  const [fontSize, setFontSize] = useState(() => {
    return parseInt(localStorage.getItem("fontSize")) || 16;
  });
  const [contrast, setContrast] = useState(() => {
    return JSON.parse(localStorage.getItem("contrast")) || false;
  });
  const [enableSpeech, setEnableSpeech] = useState(() => {
    return JSON.parse(localStorage.getItem("enableSpeech")) || false;
  });
  const [enableTextToSpeech, setEnableTextToSpeech] = useState(() => {
    return JSON.parse(localStorage.getItem("enableTextToSpeech")) || false;
  });
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoom, setZoom] = useState(1);
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const showHelpModal = () => setShowHelp(true);
  const closeHelpModal = () => setShowHelp(false);

  useEffect(() => {
    if (isMenuOpen) {
      setIsAnimating(true);
    } else {
      setTimeout(() => setIsAnimating(false), 300);
    }
  }, [isMenuOpen]);

  useEffect(() => {
    localStorage.setItem(
      "enableTextToSpeech",
      JSON.stringify(enableTextToSpeech)
    );
    const paragraphs = document.querySelectorAll("p");
    paragraphs.forEach((p) => {
      if (enableTextToSpeech) {
        if (
          !p.previousSibling ||
          !p.previousSibling.classList.contains("speaker-button")
        ) {
          const speakerButton = document.createElement("button");
          speakerButton.classList.add("speaker-button");
          speakerButton.type = "button";
          speakerButton.onclick = async (event) => {
            event.preventDefault();
            await handleSpeak(p.innerText);
          };
          p.parentNode.insertBefore(speakerButton, p);
          createRoot(speakerButton).render(<FaVolumeUp />);
        }
      } else {
        document
          .querySelectorAll(".speaker-button")
          .forEach((button) => button.remove());
      }
    });
  }, [enableTextToSpeech]);

  useEffect(() => {
    localStorage.setItem("fontSize", fontSize);
    document.body.style.fontSize = `${fontSize}px`;
  }, [fontSize]);

  useEffect(() => {
    localStorage.setItem("contrast", JSON.stringify(contrast));
    if (contrast) {
      document.body.style.backgroundColor = "#F5F5F5";
      document.body.style.color = "#333333";
      document.body.style.backgroundImage = "none";
      document.querySelectorAll("input, a").forEach((element) => {
        element.style.backgroundColor = "#FFFFFF";
        element.style.color = "#000000";
        element.style.border = "2px solid #333333";
      });
    } else {
      document.body.style.backgroundColor = "";
      document.body.style.color = "";
      document.body.style.backgroundImage = "";
      document.querySelectorAll("input, a").forEach((element) => {
        element.style.backgroundColor = "";
        element.style.color = "";
        element.style.border = "";
      });
    }
  }, [contrast]);

  const increaseFontSize = () => {
    try {
      setToastMessage("🔠 Increasing font size...");
      setShowToast(true);

      setFontSize((prev) => {
        const newSize = Math.min(prev + 2, 24);
        localStorage.setItem("fontSize", newSize);
        document.body.style.fontSize = `${newSize}px`;

        setToastMessage(`✅ Font size increased to ${newSize}px.`);
        return newSize;
      });
    } catch (error) {
      setToastMessage("❌ Font adjustment failed");
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const decreaseFontSize = () => {
    try {
      setToastMessage("🔠 Decreasing font size...");
      setShowToast(true);

      setFontSize((prev) => {
        const newSize = Math.max(prev - 2, 12);
        localStorage.setItem("fontSize", newSize);
        document.body.style.fontSize = `${newSize}px`;

        setToastMessage(`✅ Font size decreased to ${newSize}px.`);
        return newSize;
      });
    } catch (error) {
      setToastMessage("❌ Font adjustment failed");
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const toggleContrast = () => {
    try {
      setToastMessage("🔄 Updating contrast settings...");
      setShowToast(true);

      setContrast((prev) => {
        const newContrast = !prev;
        localStorage.setItem("contrast", JSON.stringify(newContrast));

        if (newContrast) {
          document.body.classList.add("high-contrast");
        } else {
          document.body.classList.remove("high-contrast");
        }

        setToastMessage("✅ Contrast updated successfully!");
        return newContrast;
      });
    } catch (error) {
      setToastMessage("❌ Page does not support contrast mode");
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const magnify = (event) => {
    try {
      setToastMessage("🔍 Adjusting zoom...");
      setShowToast(true);

      if (event.detail === 2) {
        setIsZoomed(false);
        setZoom(1);
        document.body.style.transition = "transform 0.3s ease-out";
        document.body.style.transform = "";
        document.body.style.transformOrigin = "";
        document.body.style.height = "";
        document.body.style.overflow = "";

        setToastMessage("🔄 Zoom reset to default.");
        setTimeout(() => {
          document.body.style.transition = "";
        }, 300);
        return;
      }

      const newZoomState = !isZoomed;
      setIsZoomed(newZoomState);
      setZoom(newZoomState ? 2 : 1);
      document.body.style.transition = "transform 0.3s ease-out";
      document.body.style.transform = newZoomState ? "scale(2)" : "";
      document.body.style.transformOrigin = newZoomState ? "top left" : "";
      document.body.style.height = newZoomState ? "200%" : "";
      document.body.style.overflow = newZoomState ? "auto" : "";

      setToastMessage(newZoomState ? "✅ Zoomed in!" : "✅ Zoomed out!");

      setTimeout(() => {
        document.body.style.transition = "";
      }, 300);
    } catch (error) {
      setToastMessage("❌ Maximum zoom level reached");
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  const toggleSpeech = (event) => {
    event.preventDefault();
    setEnableSpeech((prev) => !prev);
    if (!enableSpeech) {
      setIsListening(true);
      handleTranscribe();
    }
  };

  const toggleTextToSpeech = (event = null) => {
    if (event) event.preventDefault();
    setEnableTextToSpeech((prev) => {
      const newValue = !prev;
      localStorage.setItem("enableTextToSpeech", JSON.stringify(newValue));
      return newValue;
    });
  };

  const handleTranscribe = async () => {
    try {
      setToastMessage("🎤 Listening...");
      setShowToast(true);

      const result = await transcribeSpeech(setToastMessage, setShowToast);
      const command = result.toLowerCase().trim();

      setToastMessage(`✅ Heard: "${command}"`);

      switch (true) {
        case command.includes("read aloud"):
          toggleTextToSpeech();
          break;

        case command.includes("open menu"):
          setIsMenuOpen(true);
          break;

        case command.includes("close menu"):
          setIsMenuOpen(false);
          break;

        case command.includes("increase font size"):
          increaseFontSize();
          break;

        case command.includes("decrease font size"):
          decreaseFontSize();
          break;

        case command.includes("enable contrast"):
          setContrast(true);
          break;

        case command.includes("disable contrast"):
          setContrast(false);
          break;

        case command.includes("zoom in"):
          setIsZoomed(true);
          setZoom(2);
          document.body.style.transform = "scale(2)";
          break;

        case command.includes("zoom out"):
          setIsZoomed(false);
          setZoom(1);
          document.body.style.transform = "";
          break;

        case command.includes("open help"):
          setShowHelp(true);
          break;

        case command.includes("close help"):
          setShowHelp(false);
          break;

        default:
          setToastMessage("⚠️ Command not recognized.");
      }
    } catch (error) {
      setToastMessage("❌ " + error.message);
    } finally {
      setTimeout(() => setShowToast(false), 3000);
      setEnableSpeech(false);
      setIsListening(false);
    }
  };

  const handleSpeak = async (text) => {
    try {
      console.log("🔊 Attempting to synthesize speech...");
      setToastMessage("🔊 Preparing to speak...");
      setShowToast(true);

      const audioUrl = await synthesizeSpeech(text);
      console.log("Generated Audio URL:", audioUrl);
      if (!audioUrl) {
        throw new Error("Failed to generate speech audio");
      }

      const audio = new Audio(audioUrl);
      audio.play();
      setToastMessage("✅ Speaking text aloud.");
    } catch (error) {
      setToastMessage("❌ " + error);
    } finally {
      setTimeout(() => setShowToast(false), 3000);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 16,
        right: 16,
        zIndex: 99,
        display: "flex",
        alignItems: "center",
      }}
    >
      <button
        className={`fab-button mic-button ${isListening ? "listening" : ""}`}
        onClick={toggleSpeech}
        style={{ marginRight: 8 }}
      >
        <FaMicrophone color="#fff" />
        <span className="fab-tooltip">Enable Voice Command</span>
      </button>

      {/* Floating Action Button */}
      <button
        className="fab-button"
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        onMouseEnter={() => setIsMenuOpen(true)}
      >
        <FaUniversalAccess size={24} color="#fff" />
        <span className="fab-tooltip">Assistive Menu</span>
      </button>

      {/* Assistive Menu */}
      {isAnimating && (
        <div className={`fab-menu ${isMenuOpen ? "show" : "hide"}`}>
          <button className="fab-menu-item" onClick={toggleTextToSpeech}>
            <FaVolumeUp color="#fff" />
            <span className="tooltip">Enable Read Aloud</span>
          </button>
          <button className="fab-menu-item" onClick={increaseFontSize}>
            <FaSearchPlus color="#fff" />
            <span className="tooltip">Increase Font Size</span>
          </button>
          <button className="fab-menu-item" onClick={decreaseFontSize}>
            <FaSearchMinus color="#fff" />
            <span className="tooltip">Decrease Font Size</span>
          </button>
          <button className="fab-menu-item" onClick={toggleContrast}>
            <FaAdjust color="#fff" />
            <span className="tooltip">Toggle Contrast</span>
          </button>
          <button className="fab-menu-item" onClick={magnify}>
            <FaSearch color="#fff" />
            <span className="tooltip">Toggle Magnify</span>
          </button>
          <button className="fab-menu-item" onClick={showHelpModal}>
            <FaQuestionCircle color="#fff" />
            <span className="tooltip">Help</span>
          </button>
        </div>
      )}

      {/* Toast Message */}
      <ToastMessage show={showToast} message={toastMessage} />
      <HelpModal show={showHelp} handleClose={closeHelpModal} />

      {/* Styles for mic and speaker buttons */}
      <style>
        {`
          .mic-button, .speaker-button {
            background-color: #6b6034;
            color: white;
            border: none;
            padding: 8px;
            margin-right: 8px;
            border-radius: 50%;
            cursor: pointer;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            font-size: 16px;
          }

          .mic-button:hover, .speaker-button:hover {
            background-color: #5a522e;
          }

          .fab-button {
            background-color: #6b6034;
            border: 0.5px solid #fff;
            border-radius: 50%;
            width: 56px;
            height: 56px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            position: relative;
          }

          .fab-button:hover .fab-tooltip {
            visibility: visible;
            opacity: 1;
          }

          .fab-tooltip {
            visibility: hidden;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            text-align: center;
            padding: 4px 8px;
            border-radius: 4px;
            position: absolute;
            right: 35%;
            transform: translateX(-50%);
            white-space: nowrap;
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s, visibility 0.3s;
          }

          .fab-menu {
            position: absolute;
            bottom: 64px;
            left: 77%;
            transform: translateX(-50%);
            display: flex;
            flex-direction: column;
            gap: 8px;
            align-items: center;
            opacity: 0;
            visibility: hidden;
          }

          .fab-menu.show {
            animation: slide-up 0.3s ease-out forwards;
            visibility: visible;
          }

          .fab-menu.hide {
            animation: slide-down 0.3s ease-out forwards;
            visibility: visible; /* Keeps visibility during animation */
          }

          @keyframes slide-up {
            from {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
            to {
              opacity: 1;
              transform: translate(-50%, 0);
            }
          }

          @keyframes slide-down {
            from {
              opacity: 1;
              transform: translate(-50%, 0);
            }
            to {
              opacity: 0;
              transform: translate(-50%, 20px);
            }
          }

          .fab-menu-item {
            background-color: #6b6034;
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            position: relative;
          }

          .fab-menu-item:hover {
            background-color: #5a522e;
          }

          .tooltip {
            visibility: hidden;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            text-align: center;
            padding: 4px 8px;
            border-radius: 4px;
            position: absolute;
            top: 50%;
            right: 110%;
            white-space: nowrap;
            transform: translateY(-50%);
            font-size: 12px;
            opacity: 0;
            transition: opacity 0.3s, visibility 0.3s;
          }

          .fab-menu-item:hover .tooltip {
            visibility: visible;
            opacity: 1;
          }

          .mic-button.listening {
            animation: pulse 1s infinite;
            background-color: #ff5252; /* Red glow when listening */
          }

          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 0 5px rgba(255, 82, 82, 0.5);
            }
            50% {
              transform: scale(1.1);
              box-shadow: 0 0 15px rgba(255, 82, 82, 1);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 0 5px rgba(255, 82, 82, 0.5);
            }
          }

          .high-contrast {
            background-color: black !important;
            color: white !important;
            }

            .high-contrast input, 
            .high-contrast a, 
            .high-contrast button {
            background-color: black !important;
            color: yellow !important;
            border: 2px solid white !important;
            }
        `}
      </style>
    </div>
  );
};

export default AccessibilityMenu;
