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
    getFeedProjects,
 } = require('../controllers/project')


router.route('/').post(validateProject, createProject).get(getAllProjects)
router.route('/feeds').get(getFeedProjects)
router.route('/:id').get(getProject).delete(deleteProject).patch(validateProject, updateProject).post(createComment).post(likeProject).post(bookmarkProject)
//router.route('/:id').get(getArticleComments)

module.exports = router


