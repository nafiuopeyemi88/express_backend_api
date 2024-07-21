const Article = require('../models/articles/Article')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors') 



//const get all articles in the db
// get all article belonging to a specific user
// get a single article


const getAllArticles = async (req, res) => {
    const articles = await Article.find({ author: req.user.userId }).sort('createdAt')
    res.status(StatusCodes.OK).json({ articles, count: articles.length })
  }


const getArticle = async (req, res) => {
    const {
        user: { userId },
        params: { id: articleId },
      } = req

    const article = await Article.findOne({
        _id: articleId,
        author: userId,
      })
      if (!article) {
        throw new NotFoundError(`No article with id ${articleId}`)
      }
    res.status(StatusCodes.OK).json({ article })
}


const createArticle = async (req, res) => {
    req.body.author = req.user.userId
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
      { _id: articleId, author: userId },
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
      author: userId,
    })
    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`)
    }
    res.status(StatusCodes.OK).send()
  }

  const createComment = async (req, res) => {
    const { body: { body }, user: { userId }, params: { id: articleId } } = req;
  
    if (!body) {
      throw new BadRequestError('Comment body cannot be empty');
    }

    const comment = {
      author: userId,
      body: body,
    };

    const article = await Article.findByIdAndUpdate(
      { _id: articleId },
      { $push: { comments: comment } },
      { new: true, runValidators: false }
    );

    if (!article) {
      throw new NotFoundError(`No article with id ${articleId}`);
    }

    res.status(StatusCodes.OK).json({ article });
};
 
 const updateComment = async (req, res) => {
  const {
    body: { body },
    user: { userId },
    params: { comment_id: commentId, article_id: articleId },
  } = req

  if (!body) {
    throw new BadRequestError('Body field can not be empty')
  }
  const article = await Article.findOneAndUpdate(
    { _id: articleId, "comments._id": commentId, "comments.author": userId },
    { $set: { "comments.$.body": body, } },
    { new: true, runValidators: false }
);

  if (!article) {
    throw new NotFoundError(`No comment with id ${articleId} for this`)
  }
  res.status(StatusCodes.OK).json({ article })
 }





module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getArticle,
  createComment,
  updateComment,
}


