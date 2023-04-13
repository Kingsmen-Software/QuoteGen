import React, { useState, useEffect } from "react";
import axios from "axios";
import backgroundImage from "./assets/background.png";
import bannerImage from "./assets/fullHeader.png";
import frameImage from "./assets/frame.png";
import SocialMediaBar from "./components/SocialMediaBar";
import leftGif from "./assets/Left-KS-Ad.gif";
import rightGif from "./assets/Right-KS-Ad.gif";
import { FaSpinner } from "react-icons/fa";
import "./App.css";

const searchUrl = 'https://itunes.apple.com/search';

const App = () => {
  const [closingActor, setClosingActor] = useState("");
  const [closingActorList, setClosingActorList] = useState([]);
  const [closingLine, setClosingLine] = useState("");
  const [generatedSpeech, setGeneratedSpeech] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [openingActor, setOpeningActor] = useState("");
  const [openingActorList, setOpeningActorList] = useState([]);
  const [openingLine, setOpeningLine] = useState("");
  const [selectedSong, setSelectedSong] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const response = await axios.get("http://localhost:3001/api/speech-lines", { params: { openingActor, closingActor } });
      setOpeningLine(response.data.openingLine);
      setClosingLine(response.data.closingLine);

      // Generate the speech content
      const speechResponse = await axios.post("http://localhost:3001/api/generate-speech", { openingLine: response.data.openingLine, closingLine: response.data.closingLine });

      console.log("Generated speech content:", speechResponse.data);
      setGeneratedSpeech(speechResponse.data);

      const dallEResponse = await axios.post("http://localhost:3001/api/generate-dallE", { openingActor, closingActor });

      console.log(dallEResponse.data);
      setImageUrl(dallEResponse.data.imageUrl);

      const params = new URLSearchParams({
        term: openingActor,
        media: 'music',
        entity: 'song',
        limit: 1,
      });

      const songResponse = await fetch(`${searchUrl}?${params}`);
      const data = await songResponse.json();

      if (data.resultCount === 0) {
        alert(`No songs found for ${openingActor}`);
        return;
      }

      const result = data.results[0];
      const newSong = {
        title: result.trackName,
        artist: result.artistName,
        album: result.collectionName,
        artwork: result.artworkUrl100,
        previewUrl: result.previewUrl,
      };
      setSelectedSong(newSong);
      setIsPlaying(true);
      setIsLoading(false);

    } catch (error) {
      console.error("Error fetching speech lines:", error);
    }
  };

  function handleAudioEnded() {
    setIsPlaying(false);
  }

  return (
    <div>
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
            <img src={bannerImage} alt="Banner" style={{ width: "100vw" }} />
          </div>

          <div className="form-container">
            <div className="form-section">
              <label htmlFor="openingActor" className="edgy-label">
                Opening Actor <div className="edgy-label-line /" />
              </label>
              <select
                id="openingActor"
                value={openingActor}
                onChange={(e) =>
                  setOpeningActor(e.target.value)
                }
                className="dropdown"
              >
                <option value="">Select an actor</option>
                {openingActorList.map((actor) => (
                  <option key={actor} value={actor}>
                    {actor}
                  </option>
                ))}
              </select>
            </div>

            <div className="form-section">
              <label htmlFor="closingActor" className="edgy-label">
                Closing Actor <div className="edgy-label-line /" />
              </label>
              <select
                className="dropdown"
                id="closingActor"
                onChange={(e) => setClosingActor(e.target.value)}
                value={closingActor}
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

        <button
          onClick={fetchSpeechLines}
          disabled={!openingActor || !closingActor}
          className="edgy-button"
        >
          {isLoading ? <FaSpinner className="spinner" /> : 'CREATE MASHUP'}
        </button>

        <SocialMediaBar />

        <div className="generated-content-container">
          <img src={leftGif} alt="Left Gif" className="left-gif" />
          <div
            className={`flex-container-fade ${
              imageUrl && generatedSpeech ? "visible" : ""
            }`}
          >
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
                  maxWidth: "80%",
                  maxHeight: "80%",
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

            <div className="generated-speech">
              <div className="giant-quotes-top">"</div>
              {generatedSpeech}
              <div className="giant-quotes-bottom">"</div>
            </div>
          </div>
          <img src={rightGif} alt="Right Gif" className="right-gif" />
        </div>

        <div
          className={`flex-container-slide ${
            imageUrl && generatedSpeech ? "down" : ""
          }`}
        >
          <div className="quote">
            <div className="quote-label">Opening Actor Input:</div>
            <div className="dividing-line" />
            <p className={`text-box ${openingLine ? "active" : ""}`}>
              {openingLine}
            </p>
          </div>

          <div className="quote">
            <div className="quote-label">Closing Actor Input:</div>
            <div className="dividing-line" />
            <p className={`text-box ${closingLine ? "active" : ""}`}>
              {closingLine}
            </p>
          </div>
        </div>

        {selectedSong && (
          <div className="song-container">
            <div className="song-img-container">
              <img src={selectedSong.artwork} alt="Album artwork" />
            </div>
            <div className="song-details-container">
              <h4>{selectedSong.title}</h4>
              <p>
                {selectedSong.artist} - {selectedSong.album}
              </p>
              <audio
                src={selectedSong.previewUrl}
                controls
                autoPlay={isPlaying}
                onEnded={handleAudioEnded}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
