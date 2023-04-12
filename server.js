const express = require('express');
const cors = require('cors');
const axios = require('axios');
const openingLines = require('./openingLines.json');
const closingLines = require('./closingLines.json');
require('dotenv').config();
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/speech-lines', (req, res) => {
  const { openingActor, closingActor } = req.query;

  if (!openingActor || !closingActor) {
    return res.status(400).json({ error: 'Both openingActor and closingActor must be provided' });
  }

  const getRandomLine = (lines) => lines[Math.floor(Math.random() * lines.length)];

  res.json({
    openingLine: getRandomLine(openingLines[openingActor]),
    closingLine: getRandomLine(closingLines[closingActor]),
  });
});

app.get('/api/actors', (req, res) => {
  const { type } = req.query;

  if (type === 'opening') {
    res.json(Object.keys(openingLines));
  } else if (type === 'closing') {
    res.json(Object.keys(closingLines));
  } else {
    res.status(400).json({ error: 'Invalid type parameter' });
  }
});

app.post('/api/generate-speech', async (req, res) => {
  const { openingLine, closingLine } = req.body;
  //const myPrompt = `Write a paragraph that starts with openingLine and finishes with closingLine. Generate content that would logically connect the two sentences. openingLine: ${openingLine} closingLine: ${closingLine}`;

  try {
    
    const response = await openai.createCompletion({
      model: "text-davinci-002",
      prompt: `Write a paragraph that starts with openingLine and finishes with closingLine. Generate content that would logically connect the two sentences. openingLine: ${openingLine} closingLine: ${closingLine}`,
      max_tokens: 256,
      n: 1,
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    res.json(response.data.choices[0].text);
    
  } catch (error) {
    console.error('Error generating speech:', error); // Add this line to log the error
    res.status(500).json({ error: 'Error generating speech' });
  }
});

app.post('/api/generate-dallE', async (req, res) => {
  try {
    const apiKey = process.env.OPENAI_API_KEY;
    const { openingActor, closingActor } = req.body;
    const response = await axios.post(
      "https://api.openai.com/v1/images/generations",
      {
        model: "image-alpha-001",
        prompt: `A mashup of ${openingActor} and ${closingActor} faces in a concept art style`,
        size: "512x512",
        response_format: "url",
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );
    const imageUrl = response.data.data[0].url;
    res.send({ imageUrl });
  } catch (error) {
      console.log(error)
    res.send({ error });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
