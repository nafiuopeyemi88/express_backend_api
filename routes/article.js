const express = require('express')

const router = express.Router()

const {
    createArticle,
    deleteArticle,
    getAllArticles,
    updateArticle,
    getArticle
} = require('../controllers/articles')

router.route('/').post(createArticle).get(getAllArticles)

router.route('/:id').get(getArticle).delete(deleteArticle).patch(updateArticle)

module.exports = router