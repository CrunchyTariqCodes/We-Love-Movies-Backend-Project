const theatersService = require("./theaters.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function listTheatersAndMovies(req, res) {
  const data = await theatersService.listTheatersAndMovies();
  res.json({ data });
}

module.exports = {
  listTheatersAndMovies: asyncErrorBoundary(listTheatersAndMovies),
};