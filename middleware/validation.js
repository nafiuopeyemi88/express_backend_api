const { check, body,  validationResult } = require('express-validator');


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



// const validateProject = [
//   body('tools').custom((tools) => {
//     if (tools && tools.length > 5){
//         throw new Error('Tools cannot exceed 5 items');
//     }
//     return true;
//   }),
//   body('tags').custom((tags) => {
//     if (tags && tags.length > 5){
//         throw new Error('Tags cannot exceed 5 items');
//     }
//     return true;
//   }),
//   body('plugin').custom((plugin) => {
//     if (plugin && plugin.length > 5){
//         throw new Error('plugins cannot exceed 5 items');
//     }
//     return true;
//   }),
//   (req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return res.status(400).json({ errors: errors.array() });
//     }
//     next();
//   },
// ];


module.exports = validateProject;
