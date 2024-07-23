const express = require('express')

const router = express.Router()

const {
    createArticle,
    deleteArticle,
    getAllArticles,
    updateArticle,
    getArticle,
    getFeedArticles,
    createComment,
    updateComment,
    getArticleComments,
} = require('../controllers/articles')

router.route('/').post(createArticle).get(getAllArticles)
router.route('/feeds').get(getFeedArticles)

router.route('/:id').get(getArticle).delete(deleteArticle).patch(updateArticle).post(createComment)
router.route('/:article_id/comments/:comment_id').patch(updateComment)
router.route('/:id/comments').get(getArticleComments)

module.exports = router