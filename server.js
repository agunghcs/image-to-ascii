const express = require('express');
const multer = require('multer');
const { spawn } = require('child_process');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.post('/', upload.single('image'), (req, res) => {
  const imagePath = req.file.path;

  // Jalankan jp2a (sesuaikan parameter sesuai kebutuhan)
  const jp2a = spawn('jp2a', ['--width=80', imagePath]);

  let asciiArt = '';
  jp2a.stdout.on('data', (data) => {
    asciiArt += data.toString();
  });

  jp2a.on('close', (code) => {
    if (code === 0) {
      res.send(asciiArt);
    } else {
      res.status(500).send('Error converting image');
    }
  });
});

app.listen(3000, () => {
  console.log('Server listening on port 3000');
});
