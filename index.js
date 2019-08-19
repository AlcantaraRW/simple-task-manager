const express = require('express');
const { PROJECTS, PROJECT_WITH_INDEX, PROJECT_TASKS } = require('./routes');

const server = express();
server.use(express.json());

let numberOfRequests = 0;
const data = [];

server.use((req, res, next) => {
  console.log(`Total requests: ${++numberOfRequests}`);
  next();
});

function projectExists(req, res, next) {
  const { id } = req.params;
  const exists = !!data.find(p => p.id == id);

  if (!exists) {
    return res.status(404).json({ error: 'Project does not exist' });
  }

  return next();
}

server.get(PROJECTS, (req, res) => {
  return res.json(data);
});

server.post(PROJECTS, (req, res) => {
  const project = req.body;

  if (!project.tasks) {
    project.tasks = [];
  }

  data.push(project);

  res.json(project);
});

server.put(PROJECT_WITH_INDEX, projectExists, (req, res) => {
  const { id } = req.params;
  const project = data.find(p => p.id == id);
  project.title = req.body.title;

  return res.json(project);
});

server.delete(PROJECT_WITH_INDEX, projectExists, (req, res) => {
  const { id } = req.params;
  const index = data.findIndex(p => p.id == id);

  data.splice(index, 1);

  return res.json(data);
});

server.post(PROJECT_TASKS, projectExists, (req, res) => {
  const { id } = req.params;
  const project = data.find(p => p.id == id);

  const newTask = req.body.title;
  project.tasks.push(newTask);

  return res.json(project);
});

server.listen(3000);
