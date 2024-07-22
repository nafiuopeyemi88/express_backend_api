const Project = require('../models/articles/Project')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, NotFoundError } = require('../errors') 
const { body, validationResult } = require("express-validator");



// create project, delete project, get project for a user, get all projects - paginate, like project, bookmark project, comment on a project


const getFeedProjects = async (req, res) => {
  
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  let result = Project.find({ is_draft: false, is_private: false} )

  result = result.skip(skip).limit(limit)

  const projects = await result;

  const totalProjects = await Project.countDocuments({ is_draft: false, is_private: false})
  const numOfPages = Math.ceil(totalProjects/ limit);
  res.status(StatusCodes.OK).json({ projects, totalProjects, numOfPages})
}



// all projects by a user - paginate it
const getAllProjects = async (req, res) => {
    const queryObject = {
      owner: req.user.userId,
    };
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    let result = Project.find(queryObject)

    result = result.skip(skip).limit(limit);

    const projects = await result;
    
    const totalProjects = await Project.countDocuments(queryObject);

    const numOfPages = Math.ceil(totalProjects / limit);
    res.status(StatusCodes.OK).json({ projects, totalProjects, numOfPages})
}



const getProject = async (req, res) => {
    const {
        user: { userId },
        params: { id: projectId },
      } = req

    const project = await Project.findOne({
        _id: projectId,
        owner: userId,
      })
      if (!project) {
        throw new NotFoundError(`No project with id ${projectId}`)
      }
    res.status(StatusCodes.OK).json({ project })
}


const createProject = async (req, res) => {

    req.body.owner = req.user.userId; 
      const { tags, plugins, tools, ...projectData } = req.body;
      const project = new Project({
        ...projectData,
        tags: tags || [],
        plugins: plugins || [],
        tools: tools || []
    });

    await project.save();

    res.status(StatusCodes.CREATED).json({ project });

  }


const updateProject = async (req, res) => {
    const {
      body: { tags, plugins, tools, ...projectData },
      user: { userId },
      params: { id: projectId },
    } = req
  
    const project = await Project.findByIdAndUpdate(
      { _id: projectId, owner: userId },
      req.body,
      { new: true, runValidators: true }
    )
    if (!project) {
      throw new NotFoundError(`No project with id ${projectId}`)
    }
    res.status(StatusCodes.OK).json({ project })

}

const deleteProject = async (req, res) => {
    const {
      user: { userId },
      params: { id: projectId },
    } = req
  
    const project = await Project.findByIdAndRemove({
      _id: projectId,
      author: userId,
    })
    if (!project) {
      throw new NotFoundError(`No project with id ${projectId}`)
    }
    res.status(StatusCodes.OK).send()
  }


const createComment = async (req, res) => {
    const { body: { body }, user: { userId }, params: { id: projectId } } = req;
  
    if (!body) {
      throw new BadRequestError('Comment body cannot be empty');
    }

    const comment = {
      author: userId,
      body: body,
    };

    const project = await Project.findByIdAndUpdate(
      { _id: projectId },
      { $push: { comments: comment } },
      { new: true, runValidators: false }
    );

    if (!project) {
      throw new NotFoundError(`No project with id ${projectId}`);
    }

    res.status(StatusCodes.OK).json({ project });
};


const bookmarkProject = async (req, res) => {
  const { userId } = req.user
  const { projectId } = req.params

  const project = await Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { bookmarks: userId } }, 
    { new: true }
  );

  if (!project) {
      throw new NotFoundError(`No project with id ${projectId}`);
  }

  res.status(StatusCodes.OK).json({ project });
}


const likeProject = async (req, res) => {
  const { userId } = req.user
  const { projectId } = req.params

  const project = await Project.findOneAndUpdate(
    { _id: projectId },
    { $addToSet: { comments: userId } }, 
    { new: true }
  );

  if (!project) {
      throw new NotFoundError(`No project with id ${projectId}`);
  }

  res.status(StatusCodes.OK).json({ project });
}



module.exports = {
  getProject,
  getAllProjects,
  createProject,
  updateProject,
  deleteProject,
  createComment,
  bookmarkProject,
  likeProject,
  getFeedProjects,
}


