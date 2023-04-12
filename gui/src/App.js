import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';


const App = () => {
  const [closingActor, setClosingActor] = useState('');
  const [closingActorList, setClosingActorList] = useState([]);
  const [closingLine, setClosingLine] = useState('');
  const [generatedSpeech, setGeneratedSpeech] = useState('');
  const [openingActor, setOpeningActor] = useState('');
  const [openingActorList, setOpeningActorList] = useState([]);
  const [openingLine, setOpeningLine] = useState('');
  const [promptValue, setPromptValue] = useState('');
  const [imageUrl, setImageUrl] = useState('');


  useEffect(() => {
    fetchActorList();
  }, []);

  const fetchActorList = async () => {
    try {
      const openingActors = await axios.get('http://localhost:3001/api/actors?type=opening');
      const closingActors = await axios.get('http://localhost:3001/api/actors?type=closing');
      setOpeningActorList(openingActors.data);
      setClosingActorList(closingActors.data);
    } catch (error) {
      console.error('Error fetching actor list:', error);
    }
  };

  const fetchSpeechLines = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/speech-lines', {
        params: {
          openingActor,
          closingActor,
        },
      });
      setOpeningLine(response.data.openingLine);
      setClosingLine(response.data.closingLine);

      // Generate the speech content
      const speechResponse = await axios.post('http://localhost:3001/api/generate-speech', {
        openingLine: response.data.openingLine,
        closingLine: response.data.closingLine,
      });

      console.log('Generated speech content:', speechResponse.data);
      setGeneratedSpeech(speechResponse.data);
    } catch (error) {
      console.error('Error fetching speech lines:', error);
    }
  };

  const GenerateDallEImage = async () => {
    try {
      const response = await axios.get('http://localhost:3001/api/generate-dallE', {
        params: {
          openingActor,
          closingActor,
        },
      });
      setOpeningLine(response.data.openingLine);
      setClosingLine(response.data.closingLine);

      // Generate the speech content
      const speechResponse = await axios.post('http://localhost:3001/api/generate-speech', {
        openingLine: response.data.openingLine,
        closingLine: response.data.closingLine,
      });

      console.log('Generated speech content:', speechResponse.data);
      setGeneratedSpeech(speechResponse.data);
    } catch (error) {
      console.error('Error fetching speech lines:', error);
    }
  };

  const handleInputChange = (event) => {
    setPromptValue(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/api/generate-dallE', {
        prompt: promptValue
      });
      console.log(response.data); // Do something with the response data
      setImageUrl(response.data.imageUrl);
    } catch (error) {
      console.error(error);
    }
  };


  return (
    <div className="app-container">
      <h1>Speech Generator</h1>
      <div className="form-section">
        <label htmlFor="openingActor">Opening Actor: </label>
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
      <div className="form-section">
        <label htmlFor="closingActor">Closing Actor: </label>
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
      <p>Opening line: {openingLine}</p>
      <p>Closing line: {closingLine}</p>
      <button
        onClick={fetchSpeechLines}
        disabled={!openingActor || !closingActor}
      >
        Generate new speech lines
      </button>
      <div className="generated-speech">
        <h2>Generated Speech</h2>
        <textarea
          value={generatedSpeech}
          readOnly
          rows={10}
          cols={50}
          style={{ resize: 'none' }}
        ></textarea>
        <div>
      <form onSubmit={handleSubmit}>
        <label>
          Input value:
          <input type="text" value={promptValue} onChange={handleInputChange} />
        </label>
        <button type="submit">Submit</button>
      </form>
      {imageUrl && <img src={imageUrl} alt="Result" />}
    </div>
      </div>
    </div>
  );
}

export default App;