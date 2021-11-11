const { prisma } = require('../../lib/prisma');

exports.createComment = async (req, res) => {
  try {
    const { movieId } = req.params;

    const { text } = req.body;

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
        movieId: +movieId,
        text,
      },
    });

    res.status(200).json({ success: true, data: newMovie });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.fetchComments = async (req, res) => {
  try {
    const commenterIpAddress = req.ip;

    const comments = await prisma.comment.findMany();

    const formattedResponse = comments
      .map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt).toUTCString(),
        updatedAt: new Date(comment.updatedAt).toUTCString(),
        commenterIpAddress,
      }))
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );

    res.status(200).json({ success: true, data: formattedResponse });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

exports.fetchMovieComments = async (req, res) => {
  try {
    const { movieId } = req.params;

    const commenterIpAddress = req.ip;

    const comments = await prisma.comment.findMany();

    const formattedResponse = comments
      .map((comment) => ({
        ...comment,
        createdAt: new Date(comment.createdAt).toUTCString(),
        updatedAt: new Date(comment.updatedAt).toUTCString(),
        commenterIpAddress,
      }))
      .filter(
        (returnedComment) => returnedComment.movieId === parseInt(movieId)
      )
      .sort(
        (a, b) =>
          new Date(b.createdAt).valueOf() - new Date(a.createdAt).valueOf()
      );

    if (!formattedResponse.length) {
      return res.status(404).json({
        success: false,
        message: 'Sorry, there is no comment to be retrieved',
      });
    }

    res.status(200).json({ success: true, data: formattedResponse });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};
