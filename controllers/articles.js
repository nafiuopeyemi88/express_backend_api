const Article = require('../models/articles/Article')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors') 



//const get all articles in the db
// get all article belonging to a specific user
// get a single article


const getAllArticles = async (req, res) => {
    const articles = await Article.find({ createdBy: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ articles, count: articles.length })
  }


const getArticle = async (req, res) => {
    const {
        user: { userId },
        params: { id: articleId },
      } = req

    const article = await Article.findOne({
        _id: articleId,
        createdBy: userId,
      })
      if (!article) {
        throw new NotFoundError(`No article with id ${articleId}`)
      }
    res.status(StatusCodes.OK).json({ article })
}


const createArticle = async (req, res) => {
    req.body.createdBy = req.user.userId
    const article = await Article.create(req.body)
    res.status(StatusCodes.CREATED).json({ article })
  }


const updateArticle = async (req, res) => {
    const {
      body: { title, sub_title, content, optional_image },
      user: { userId },
      params: { id: articleId },
    } = req
  
    if (title === '' || sub_title === '' || content === '') {
      throw new BadRequestError('Title or Subtitle or Content fields cannot be empty')
    }
    const article = await Article.findByIdAndUpdate(
      { _id: articleId, createdBy: userId },
      req.body,
      { new: true, runValidators: true }
    )
    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`)
    }
    res.status(StatusCodes.OK).json({ article })
  }
  
const deleteArticle = async (req, res) => {
    const {
      user: { userId },
      params: { id: articleId },
    } = req
  
    const article = await Article.findByIdAndRemove({
      _id: articleId,
      createdBy: userId,
    })
    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`)
    }
    res.status(StatusCodes.OK).send()
  }


module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getArticle,
}


  