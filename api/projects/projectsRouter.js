const express = require('express');
const Projects = require('../../data/helpers/projectModel');

const router = express.Router();

router.use(express.json());

const validateProject = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }

  const { name, description, completed } = req.body;

  if (name && description) {
    try {
      req.project = {
        name,
        description,
        completed: completed || false,
      };
      next();
    } catch (err) {
      next(err);
    }
  } else {
    res
      .status(400)
      .json({ error: 'All projects require a name and a description.' });
  }
};

router
  .route('/')
  .get(async (req, res, next) => {
    try {
      const projects = await Projects.get();
      res.status(200).json(projects);
    } catch (err) {
      next(err);
    }
  })
  .post(validateProject, async (req, res, next) => {
    try {
      const { project } = req;
      const response = await Projects.insert(project);
      res.status(200).json(response);
    } catch (err) {
      next(err);
    }
  });

const projectErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json({ error: 'Error while processing project operation.' });
};

router.use(projectErrorHandler);

module.exports = router;
