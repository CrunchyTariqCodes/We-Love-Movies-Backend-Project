const reviewService = require("./reviews.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function reviewExists(req, res, next) {
  const { reviewId } = req.params;
  const foundReview = await reviewService.read(reviewId);

  if (foundReview) {
    res.locals.reviewId = reviewId;
    return next();
  }
  return next({
    status: 404,
    message: `cannot be found ${reviewId}`,
  });
}

async function update(req, res) {
  const updatedReview = {
    ...req.body.data,
    review_id: res.locals.reviewId,
  };
  await reviewService.update(updatedReview);
  const data = await reviewService.getReviewAndCritic(res.locals.reviewId);
  res.json({ data });
}

async function destroy(req, res) {
  await reviewService.delete(res.locals.reviewId);
  res.sendStatus(204);
}

module.exports = {
  update: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(update)],
  destroy: [asyncErrorBoundary(reviewExists), asyncErrorBoundary(destroy)],
};
