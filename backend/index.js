require('dotenv').config();
const express = require('express');
const vision = require('@google-cloud/vision');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));

const client = new vision.ImageAnnotatorClient({
  keyFilename: 'google-credentials.json',
});

app.get('/test', (req, res) => {
  res.send('Backend is running!');
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

async function detectIngredients(imageBuffer) {
  try {
    const [result] = await client.labelDetection(imageBuffer);
    const labels = result.labelAnnotations;

    if (labels.length === 0) {
      throw new Error("Could not recognize ingredients in the image. Please type ingredients manually.");
    }

    const ingredients = labels.map((label) => label.description);

    return ingredients;
  } catch (error) {
    console.error('Error during label detection:', error);
    throw error; 
  }
}

app.post('/identify-ingredients', async (req, res) => {
  try {
    const imageBuffer = Buffer.from(req.body.image, 'base64');
    const ingredients = await detectIngredients(imageBuffer);
    res.json({ ingredients });
  } catch (error) {
    console.error('Error identifying ingredients:', error);
    res.status(500).json({ error: error.message });
  }
});