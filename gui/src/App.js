import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "./assets/background.png";
import bannerImage from "./assets/header.png";
import logoImage from "./assets/logo.png";
import frameImage from "./assets/frame.png";
import "./App.css";

const App = () => {
  const [closingActor, setClosingActor] = useState("");
  const [closingActorList, setClosingActorList] = useState([]);
  const [closingLine, setClosingLine] = useState("");
  const [generatedSpeech, setGeneratedSpeech] = useState("");
  const [openingActor, setOpeningActor] = useState("");
  const [openingActorList, setOpeningActorList] = useState([]);
  const [openingLine, setOpeningLine] = useState("");
  const [promptValue, setPromptValue] = useState("");
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    fetchActorList();
  }, []);

  const fetchActorList = async () => {
    try {
      const openingActors = await axios.get("http://localhost:3001/api/actors?type=opening");
      const closingActors = await axios.get("http://localhost:3001/api/actors?type=closing");
      setOpeningActorList(openingActors.data);
      setClosingActorList(closingActors.data);
    } catch (error) {
      console.error("Error fetching actor list:", error);
    }
  };

  const fetchSpeechLines = async () => {
    try {
      const response = await axios.get("http://localhost:3001/api/speech-lines", { params: { openingActor, closingActor }});
      setOpeningLine(response.data.openingLine);
      setClosingLine(response.data.closingLine);

      // Generate the speech content
      const speechResponse = await axios.post(
        "http://localhost:3001/api/generate-speech",
        {
          openingLine: response.data.openingLine,
          closingLine: response.data.closingLine,
        }
      );

      console.log("Generated speech content:", speechResponse.data);
      setGeneratedSpeech(speechResponse.data);

      const dallEResponse = await axios.post("http://localhost:3001/api/generate-dallE", { openingActor, closingActor });
      console.log(dallEResponse.data); // Do something with the response data
      setImageUrl(dallEResponse.data.imageUrl);
    } catch (error) {
      console.error("Error fetching speech lines:", error);
    }
  };

  const handleInputChange = (event) => {
    setPromptValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3001/api/generate-dallE",
        {
          prompt: promptValue,
        }
      );
      console.log(response.data); // Do something with the response data
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div
      className="app-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        
        <div className="img-container">
          <img
            src={bannerImage}
            alt="Banner"
            style={{ width: "100vw" }}
          />
          <img src={logoImage} alt="Logo"
            style={{
              position: "relative",
              top: "0",
              left: "50%",
              transform: "translate(-50%, -130%)",
              width: "auto",
            }}
          />
        </div>

        <div className="form-section">
          <div className="dropdown-wrapper">
            <label htmlFor="openingActor" style={{ paddingRight: "10px" }}>Opening Actor: </label>
            <select
              id="openingActor"
              value={openingActor}
              onChange={(e) => setOpeningActor(e.target.value)}
            >
              <option value="">Select an actor</option>
              {openingActorList.map((actor) => (
                <option key={actor} value={actor}>
                  {actor}
                </option>
              ))}
            </select>
          </div>

        <div className="dropdown-wrapper">
          <label htmlFor="closingActor" style={{ paddingRight: "10px" }}>Closing Actor: </label>
          <select
            id="closingActor"
            value={closingActor}
            onChange={(e) => setClosingActor(e.target.value)}
          >
            <option value="">Select an actor</option>
            {closingActorList.map((actor) => (
              <option key={actor} value={actor}>
                {actor}
              </option>
            ))}
          </select>
        </div>
        </div>
        </div>

      <p className="quote">Opening line: {openingLine}</p>
      <p className="quote">Closing line: {closingLine}</p>

      <button
        onClick={fetchSpeechLines}
        disabled={!openingActor || !closingActor}
      >
        CREATE MASHUP
      </button>

      <div>
        {imageUrl && (
        <div
          style={{
            width: "500px",
            height: "500px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            backgroundImage: `url(${frameImage})`,
          }}
        >
            <img
              src={imageUrl}
              alt="Result"
              style={{
                maxWidth: "90%",
                maxHeight: "90%",
                objectFit: "cover",
                position: "absolute", // This positions the image within the frame
                top: "0",
                left: "0",
                right: "0",
                bottom: "0",
                margin: "auto", // This centers the image
              }}
            />
        </div>
          )}
      </div>
      <div className="generated-speech">
        <textarea
          value={generatedSpeech}
          readOnly
          rows={10}
          cols={50}
          style={{ resize: "true", width: "600px" }}
        ></textarea>
      </div>
    </div>
  );
};

export default App;
