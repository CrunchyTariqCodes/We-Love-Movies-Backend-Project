const moviesService = require("./movies.service");
const mapProperties = require("../utils/map-properties");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

const addCritic = mapProperties({
  critic_id: "critic.critic_id",
  preferred_name: "critic.preferred_name",
  surname: "critic.surname",
  organization_name: "critic.organization_name",
  created_at: "critic.created_at",
  updated_at: "critic.updated_at",
});

async function movieExists(req, res, next) {
  const { movieId } = req.params;
  const foundMovie = await moviesService.read(movieId);
  if (foundMovie) {
    res.locals.movieId = movieId;
    res.locals.foundMovie = foundMovie;
    return next();
  }
  return next({
    status: 404,
    message: `Movie not found: ${movieId}`,
  });
}

async function readTheaters(req, res, next) {
  const data = await moviesService.readTheaters(res.locals.movieId);
  res.json({ data });
}

async function listReviews(req, res) {
  const reviews = await moviesService.listReviews(res.locals.movieId);
  const data = reviews.map((review) => addCritic(review));

  res.json({ data });
}

async function list(req, res, next) {
  const isShowing = req.query.is_showing;
  if (isShowing) {
    const data = await moviesService.listShowing(isShowing);
    res.json({ data });
  }

  const data = await moviesService.list();
  res.json({ data });
}

function read(req, res, next) {
  res.json({ data: res.locals.foundMovie }).catch(next);
}

module.exports = {
  list: asyncErrorBoundary(list),
  read: [asyncErrorBoundary(movieExists), read],
  readTheaters: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(readTheaters),
  ],
  listReviews: [
    asyncErrorBoundary(movieExists),
    asyncErrorBoundary(listReviews),
  ],
};
