const express = require('express');
const Actions = require('../../data/helpers/actionModel');
const Projects = require('../../data/helpers/projectModel');

const router = express.Router();

router.use(express.json());

const validateActionId = async (req, res, next) => {
  const id = Number(req.params.id);

  if (Number.isNaN(id) || !Number.isFinite(id)) {
    res.status(400).json({ error: 'The id is not a valid number.' });
  } else {
    try {
      const action = await Actions.get(id);

      if (action) {
        req.action = action;
        next();
      } else {
        res.status(404).json({ error: 'There is no action with that id.' });
      }
    } catch (err) {
      next(err);
    }
  }
};

// const validateProject = (req, res, next) => {
//   if (!req.body) {
//     res.status(400).json({ error: 'Request body is empty.' });
//     return;
//   }

//   const { name, description, completed } = req.body;

//   if (name && description) {
//     try {
//       req.newProject = {
//         name,
//         description,
//         completed: completed || false,
//       };
//       next();
//     } catch (err) {
//       next(err);
//     }
//   } else {
//     res
//       .status(400)
//       .json({ error: 'All projects require a name and a description.' });
//   }
// };

router.get('/', async (req, res, next) => {
  try {
    const actions = await Actions.get();
    res.status(200).json(actions);
  } catch (err) {
    next(err);
  }
});

router
  .route('/:id')
  .all(validateActionId)
  .get(async (req, res) => {
    const { action } = req;
    res.status(200).json(action);
  });
//   .delete(async (req, res, next) => {
//     const { project } = req;
//     const { id } = project;
//     try {
//       const deleted = await Projects.remove(id);

//       if (deleted) {
//         res.status(200).json(project);
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       next(err);
//     }
//   })
//   .put(async (req, res, next) => {
//     const { project } = req;
//     const { id } = project;
//     const { name, description, completed } = req.body;
//     const updatedProject = {
//       name: name || project.name,
//       description: description || project.description,
//       completed: completed || project.completed,
//     };
//     try {
//       const updated = await Projects.update(id, updatedProject);

//       if (updated) {
//         res.status(200).json({
//           ...updatedProject,
//           id,
//         });
//       } else {
//         throw new Error();
//       }
//     } catch (err) {
//       next(err);
//     }
//   });

const actionErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json({ error: 'Error while processing action operation.' });
};

router.use(actionErrorHandler);

module.exports = router;
