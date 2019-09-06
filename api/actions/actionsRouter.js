const express = require('express');
const Actions = require('../../data/helpers/actionModel');

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
  .get((req, res) => {
    const { action } = req;
    res.status(200).json(action);
  })
  .delete(async (req, res, next) => {
    const { action } = req;
    const { id } = action;
    try {
      const deleted = await Actions.remove(id);

      if (deleted) {
        res.status(200).json(action);
      } else {
        throw new Error();
      }
    } catch (err) {
      next(err);
    }
  })
  .put(async (req, res, next) => {
    const { action } = req;
    const { id } = action;
    // eslint-disable-next-line camelcase
    const { project_id, description, notes, completed } = req.body;
    const updatedAction = {
      // eslint-disable-next-line camelcase
      project_id: project_id || action.project_id,
      notes: notes || action.notes,
      description: description || action.description,
      completed: completed || action.completed,
    };
    try {
      const updated = await Actions.update(id, updatedAction);

      if (updated) {
        res.status(200).json({
          ...updatedAction,
          id,
        });
      } else {
        throw new Error();
      }
    } catch (err) {
      next(err);
    }
  });

const actionErrorHandler = (err, req, res, next) => {
  if (res.headersSent) {
    next(err);
  }
  console.log(err);
  res.status(500).json({ error: 'Error while processing action operation.' });
};

router.use(actionErrorHandler);

module.exports = router;
