const { body,  validationResult } = require('express-validator');


const validateProject = [
  body('tools')
  .exists({ checkFalsy: true })
  .withMessage("Tools  is required")
  .isArray({ max: 5})
  .withMessage('Cannot have more than 5 plugins'),
  body('plugins')
  .exists({ checkFalsy: true})
  .withMessage("Plugins is required")
  .isArray({ max: 5})
  .withMessage('Cannot have more than 5 plugins'),
   body('tags')
  .exists({ checkFalsy: true})
  .withMessage("Tags is required")
  .isArray({ max: 5})
  .withMessage('Cannot have more than 5 tags'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
},
]

module.exports = validateProject;
