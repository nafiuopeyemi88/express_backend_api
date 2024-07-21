const express = require('express')

const router = express.Router()
const validateProject = require('../middleware/validation')

const {
    getProject,
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    createComment,
    likeProject,
    bookmarkProject,
 } = require('../controllers/project')


router.route('/').post(validateProject, createProject).get(getAllProjects)
router.route('/:id').get(getProject).delete(deleteProject).patch(validateProject, updateProject).post(createComment).post(likeProject).post(bookmarkProject)
//router.route('/:project_id/comments/:comment_id').patch(updateComment)


module.exports = router


