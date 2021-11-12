const { prisma } = require('../../lib/prisma');
const { convertToUTC } = require('../utils');

/**
 * @description: This controller creates comment for specific movie
 * @route /api/v1/comments
 * @requestBody accepts text and movieId
 * @method POST
 */

exports.createMovieComment = async (req, res) => {
  try {
    const { text, movieId } = req.body;

    // text length has been set to take at most 500 characters
    // we will just perform another check just incase it does exceed
    if (text.length > 500) {
      return res.status(400).json({
        success: false,
        message: 'Sorry, you have exceeded the maximum number of characters',
      });
    }

    const newMovie = await prisma.comment.create({
      data: {
        movieId: parseInt(movieId),
        text,
      },
    });

    res.status(201).json({
      success: true,
      data: newMovie,
      message: 'Comment created successfully',
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * @description: This controller fetches all comments on the DB
 * @route /api/v1/comments
 * @method GET
 */

exports.fetchAllComments = async (req, res) => {
  try {
    const commenterIpAddress = req.ip;

    const comments = await prisma.comment.findMany();

    const formattedResponse = comments
      .map((comment) => ({
        ...comment,
        createdAt: convertToUTC(comment.createdAt),
        updatedAt: convertToUTC(comment.updatedAt),
        commenterIpAddress,
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );

    if (!formattedResponse?.length) {
      res.status(404).json({
        success: false,
        message: 'Sorry, Could not fetch any comment',
      });
    }

    res.status(200).json({
      success: true,
      data: formattedResponse,
      message: 'Comment fetched successfully',
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * @description: This controller fetches comments for specific movie
 * @route /api/v1/comments
 * @requestParams accepts movieId
 * @method GET
 */
exports.fetchMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;

    const commenterIpAddress = req.ip;

    const comments = await prisma.comment.findMany();

    // let's check if we have comments on the db

    if (!comments.length) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, there is no comment to be retrieved',
      });
    }

    const formattedResponse = comments
      .map((comment) => ({
        ...comment,
        createdAt: convertToUTC(comment.createdAt),
        updatedAt: convertToUTC(comment.updatedAt),
        commenterIpAddress,
      }))
      .filter(
        (returnedComment) => returnedComment.movieId === parseInt(movieId)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );

    if (!formattedResponse?.length) {
      res.status(404).json({
        success: false,
        message: 'Sorry, Could not fetch any comment',
      });
    }

    res.status(200).json({
      success: true,
      data: formattedResponse,
      message: 'Movie Comments fetched successfully',
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * @description: This controller updates comment for specific movie
 * @route /api/v1/comments/:movieId/:commentId
 * @requestParams accepts movieId  and commentId
 * @requestBody accepts text
 * @method PUT
 */
exports.updateMovieComment = async (req, res) => {
  try {
    let { movieId, commentId } = req.params;

    const { text } = req.body;

    movieId = parseInt(movieId);
    commentId = parseInt(commentId);

    if (!movieId) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, we could not find the comment',
      });
    }

    const comment = await prisma.comment.findFirst({
      where: {
        movieId,
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, we could not find the comment',
      });
    }

    const updatedComment = await prisma.comment.update({
      where: {
        id: commentId,
      },
      data: {
        text,
      },
    });

    return res.status(200).json({
      success: false,
      data: updatedComment,
      message: 'Comment updated successfully',
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

/**
 * @description: This controller updates comment for specific movie
 * @route /api/v1/comments/:movieId/:commentId
 * @requestParams accepts movieId  and commentId
 * @method DELETE
 */

exports.deleteMovieComment = async (req, res) => {
  try {
    let { movieId, commentId } = req.params;

    movieId = parseInt(movieId);
    commentId = parseInt(commentId);

    if (!movieId) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, we could not find the comment',
      });
    }

    const comment = await prisma.comment.findFirst({
      where: {
        movieId,
        id: commentId,
      },
    });

    if (!comment) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, we could not find the comment',
      });
    }

    await prisma.comment.delete({
      where: {
        id: commentId,
      },
    });

    return res
      .status(200)
      .json({ success: false, message: 'Comment deleted successfully' });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
