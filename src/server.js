const express = require('express');
const multer = require('multer');
const sharp = require('sharp');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json({ limit: '10mb' }));

app.post('/api/compress', multer().single('image'), async (req, res) => {
  const { image, ratio } = req.body;
  const buffer = Buffer.from(image.split(',')[1], 'base64');
  const compressedBuffer = await sharp(buffer)
    .jpeg({ quality: Math.floor(ratio * 100) })
    .toBuffer();
  res.json({
    compressedImage: `data:image/jpeg;base64,${compressedBuffer.toString('base64')}`,
    compressedSize: compressedBuffer.length,
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
}); 