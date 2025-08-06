const express = require('express');
const cors = require('cors');
const multer = require('multer');
const csv = require('csv-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());

const upload = multer({ dest: 'uploads/' });

let projects = [];
let allocatedProjects = {};

let totalTeams = 0;

// POST /api/setup
app.post('/api/setup', upload.single('file'), (req, res) => {
  if (!req.file || !req.body.numTeams) {
    return res.status(400).json({ error: 'File and number of teams are required.' });
  }

  totalTeams = parseInt(req.body.numTeams);

  const results = [];
  const filePath = path.resolve(req.file.path);

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (data) => {
      // Assuming CSV has column 'Title' (case sensitive)
      if (data.Title) results.push(data.Title.trim());
    })
    .on('end', () => {
      // Delete temp uploaded file
      fs.unlinkSync(filePath);

      if (results.length < totalTeams) {
        return res.status(400).json({ error: 'Not enough projects for the number of teams.' });
      }

      projects = shuffle(results);
    //   console.log(`projects are: ${projects}`)
      // You can store projects and teams globally or in-memory for now

      res.json({ message: 'Setup successful', totalProjects: projects.length });
    })
    .on('error', (err) => {
      res.status(500).json({ error: `Failed to parse CSV file. ${err}` });
    });
});

// Return current cards - hidden or null if assigned
app.get('/api/cards', (req, res) => {
  const cards = projects.map((p) => (p ? 'HIDDEN' : null));
  res.json({ cards });
});

app.post('/api/assign', express.json(), (req, res) => {
  const { teamNumber, index } = req.body;

  if (!teamNumber || index === undefined) {
    return res.status(400).json({ error: 'teamNumber and index required.' });
  }

  if (allocatedProjects[teamNumber]) {
    return res.status(400).json({ error: 'Team already has an assigned project.' });
  }

  if (!projects[index]) {
    return res.status(400).json({ error: 'Invalid or already assigned card.' });
  }

  const projectTitle = projects[index];
  allocatedProjects[teamNumber] = projectTitle;
  projects[index] = null;

  res.json({ message: 'Project assigned', project: projectTitle });
});

app.get('/api/results', (req, res) => {
  res.json({ allocatedProjects });
});

// GET /api/totalTeams
app.get('/api/totalTeams', (req, res) => {
  res.json({ totalTeams });
});

// Helper shuffle function
function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
