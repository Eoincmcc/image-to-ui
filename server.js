import express from express;
import fetchMenuDataFromImage from './services/imageToJSON';
const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Middleware to parse JSON bodies

// Endpoint to receive an image URL and process it
app.post('/api/extract-menu', async (req, res) => {
  const imagePath = req.body.imagePath;
  const menuData = await fetchMenuDataFromImage(imagePath);
  res.json(menuData);
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

