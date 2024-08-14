const Article = require('../models/articles/Article')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors') 



const getFeedArticles = async (req, res ) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let result = Article.find({ is_draft: false, is_private: false} )

  result = result.skip(skip).limit(limit)

  const articles = await result;

  const totalArticles = await Article.countDocuments({ is_draft: false, is_private: false})

  const numOfPages = Math.ceil(totalArticles/ limit);
  res.status(StatusCodes.OK).json({ articles, totalArticles, numOfPages})
}



const getAllArticles = async (req, res) => {
  const queryObject = {
    owner: req.user.userId,
  };
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let result = Article.find(queryObject)

  result = result.skip(skip).limit(limit);

  const articles = await result;
  
  const totalArticles = await Article.countDocuments(queryObject);

  const numOfPages = Math.ceil(totalArticles / limit);
  res.status(StatusCodes.OK).json({ articles, totalArticles, numOfPages})
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
      body: { title, sub_title, content, optional_image, is_draft, is_private,  },
      user: { userId },
      params: { id: articleId },
    } = req
    

    const article = await Article.findById(articleId)

    if (!article){
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No article with id ${articleId}` });
    }

    if (project.owner.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You do not have permission to edit this article' });
    }

    await Article.findByIdAndUpdate(
      { _id: articleId, author: userId },
      req.body,
      { new: true, runValidators: true }
    )
   
    res.status(StatusCodes.OK).json({ article })
  }
  


const deleteArticle = async (req, res) => {
    const {
      user: { userId },
      params: { id: articleId },
    } = req

    const article = await Article.findById(articleId)
    if (!article){
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No article with id ${articleId}` });
    }

    if (article.owner.toString() !== userId) {
      return res.status(StatusCodes.FORBIDDEN).json({ message: 'You do not have permission to edit this article' });
    }

    await Article.findByIdAndDelete(articleId);
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


const getArticleComments = async (req, res) => {
    const {
      params: { id: articleId }
    } = req
    
    const article = await Article.findOne({
      _id: articleId,
    }).select('comments').populate('comments.author', 'username'); 

    if (!article) {
      return res.status(StatusCodes.NOT_FOUND).json({ message: `No article with id ${articleId}` });
    }

    res.status(StatusCodes.OK).json({ comments: article.comments });
    
}



module.exports = {
  createArticle,
  updateArticle,
  deleteArticle,
  getAllArticles,
  getFeedArticles,
  getArticle,
  createComment,
  updateComment,
  getArticleComments
}


