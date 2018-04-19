const Boom = require('boom');
const Tournament = require('../models/tournament-model');
const Team = require('../models/team-model');
const Game = require('../models/game-model');
const countries = require('../data/country-codes');
const { teams } = require('../data/qualified');
const games = require('../data/game-data');

const category = '5ad48dc61b350a07ec36548a';

// 1 -  create category
//2 - create tournament
// create teams
// add qualified teams
// create games

exports.addTeams = async () => {
  for (const country of countries) {
    if (country.FIFA !== null) {
      const team = {
        name: country['CLDR display name'],
        shortName: country.FIFA,
        category,
      };
      await new Team(team).save();
    }
  }
  return Team.find({}).sort({ name: 1 });
};

exports.addQualifiedTeams = async () => {
  try {
    const Teams = await Team.find({ name: teams });
    await Tournament.update(
      { name: 'World Cup 2018' },
      { $push: { qualifiedTeams: { $each: Teams } } },
    );
    return Tournament.find({ name: 'World Cup 2018' });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.addGames = async () => {
  try {
    const tournament = await Tournament.find({ name: 'World Cup 2018' });
    for (const game of games) {
      const teams = await Team.find({ name: game.teams });
      game.tournament = tournament._id;
      game.teams = teams;
      await new Game(game).save();
    }
    const Games = await Game.find({ tournament: tournament._id });
    await Tournament.update(
      { name: 'World Cup 2018' },
      { $push: { games: { $each: Games } } },
    );
    return Tournament.find({ name: 'World Cup 2018' });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.addGame = async (request) => {
  try {
    const {
      name, teams, startTime, finishTime,
    } = request.payload;
    let { tournament } = request.payload;
    tournament = await Tournament.find({ name: request.payload.tournamentName });
    const game = {
      tournament,
      name,
      teams: await Team.find({ name: teams }),
      startTime,
      finishTime,
    };
    await new Game(game).save();
    const Games = await Game.find({ tournament });
    await Tournament.update(
      { _id: tournament },
      { $push: { games: { $each: Games } } },
    );
    return Tournament.find({ _id: tournament });
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

