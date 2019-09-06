const express = require('express');
const Projects = require('../../data/helpers/projectModel');
const Actions = require('../../data/helpers/actionModel');

const router = express.Router();

router.use(express.json());

const validateProjectId = async (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    try {
      const project = await Projects.get(id);

      if (project) {
        req.project = project;
        next();
      } else {
        res.status(404).json({ error: 'There is no project with that id.' });
      }
    } catch (err) {
      next(err);
    }
  }
};

const validateProject = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }

  const { name, description, completed } = req.body;

  if (name && description) {
    try {
      req.newProject = {
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

const validateAction = (req, res, next) => {
  if (!req.body) {
    res.status(400).json({ error: 'Request body is empty.' });
    return;
  }

  // eslint-disable-next-line camelcase
  const { notes, description, completed } = req.body;
  const { id } = req.params;

  // eslint-disable-next-line camelcase
  if (notes && description) {
    try {
      req.newAction = {
        project_id: id,
        description,
        notes,
        completed: completed || false,
      };
      next();
    } catch (err) {
      next(err);
    }
  } else {
    res.status(400).json({
      error: 'All actions require a description and notes.',
    });
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
      const { newProject } = req;
      const project = await Projects.insert(newProject);
      res.status(200).json(project);
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id')
  .all(validateProjectId)
  .get((req, res) => {
    const { project } = req;
    res.status(200).json(project);
  })
  .delete(async (req, res, next) => {
    const { project } = req;
    const { id } = project;
    try {
      const deleted = await Projects.remove(id);

      if (deleted) {
        res.status(200).json(project);
      } else {
        throw new Error();
      }
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    const { project } = req;
    const { id } = project;
    const { name, description, completed } = req.body;
    const updatedProject = {
      name: name || project.name,
      description: description || project.description,
      completed: completed || project.completed,
    };
    try {
      const updated = await Projects.update(id, updatedProject);

      if (updated) {
        res.status(200).json({
          ...updatedProject,
          id,
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      next(err);
    }
  });

router
  .route('/:id/actions')
  .all(validateProjectId)
  .get(async (req, res, next) => {
    const { project } = req;
    const { id } = project;
    try {
      const actions = await Projects.getProjectActions(id);
      res.status(200).json(actions);
    } catch (err) {
      next(err);
    }
  })
  .post(validateAction, async (req, res, next) => {
    try {
      const { newAction } = req;
      const action = await Actions.insert(newAction);
      res.status(200).json(action);
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
