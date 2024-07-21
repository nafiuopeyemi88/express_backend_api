const express = require('express')

const router = express.Router()

const {
    createArticle,
    deleteArticle,
    getAllArticles,
    updateArticle,
    getArticle,
    createComment,
    updateComment,
} = require('../controllers/articles')

router.route('/').post(createArticle).get(getAllArticles)

router.route('/:id').get(getArticle).delete(deleteArticle).patch(updateArticle).post(createComment)
router.route('/:article_id/comments/:comment_id').patch(updateComment)


module.exports = router