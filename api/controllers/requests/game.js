const Boom = require('boom');
const Utils = require('./auth-controller');

const Game = require('../../models/game-model');

const PlayerHelper = require('../helpers/player');
const PredictionHelper = require('../helpers/prediction');
const ScoreHelper = require('../helpers/score');
const TeamHelper = require('../helpers/team');
const TournamentHelper = require('../helpers/tournament');

exports.createOne = async request => {
  try {
    return new Game(request.payload).save();
  } catch (e) {
    return Boom.badImplementation(`error creating game: ${e}`);
  }
};

exports.createMany = async request => {
  try {
    let { tournament } = request.payload.upload;
    const { games } = request.payload.upload;
    const newGames = [];
    tournament = await TournamentHelper.retrieveOneByName(tournament);
    for (let i = 0; i < games.length; i += 1) {
      const {
        name,
        stage,
        teams,
        gameNumber,
        startTime,
        winnerToGame,
        runnerUpToGame
      } = games[i];

      const finishTime =
        new Date(startTime).getTime() + (stage === 1 ? 2 : 3) * 60 * 60 * 1000;

      // eslint-disable-next-line no-await-in-loop
      const teamDocs = await TeamHelper.findByName(teams);
      const teamIds = teamDocs.map(team => team._id);

      const game = {
        tournament: tournament._id,
        name,
        stage,
        gameNumber,
        startTime: new Date(startTime),
        finishTime: new Date(finishTime),
        teams: teamIds,
        winnerToGame,
        runnerUpToGame
      };
      newGames.push(game);
    }

    return Game.collection.insert(newGames);
  } catch (err) {
    return Boom.badImplementation(`error accessing db ${err}`);
  }
};

exports.retrieveOne = async request => {
  try {
    return Game.findOne({ _id: request.params.id });
  } catch (e) {
    return Boom.badImplementation(`error getting game: ${e}`);
  }
};

exports.retrieve = async request => {
  const currentDate = new Date();
  const player = await Utils.getPlayerIdFromRequest(request);
  const { tournament, filter } = request.url.query;
  async function getGameIdsWithPredictions() {
    // find games for tournament
    const games = await Game.find({ tournament });
    // reduce to only ids
    const gameIds = games.map(game => game._id);
    // find predictions for tournament
    const predictions = await PredictionHelper.retrieveFromGameList(
      player,
      gameIds
    );
    // reduce to ids
    return predictions.map(prediction => prediction.game);
  }
  try {
    switch (filter) {
      case 'all':
        return Game.find({ tournament })
          .sort({ startTime: 1 })
          .populate('teams');

      case 'past':
        return Game.find({ tournament, finishTime: { $lt: currentDate } })
          .sort({ startTime: 1 })
          .populate('teams');

      case 'future':
        return Game.find({ tournament, startTime: { $gt: currentDate } })
          .sort({ startTime: 1 })
          .populate('teams');

      case 'inPlay':
        return Game.find({
          tournament,
          startTime: { $lt: currentDate },
          finishTime: { $gt: currentDate }
        })
          .sort({ startTime: 1 })
          .populate('teams');

      case 'prediction': {
        // find games with predictions
        const gameIds = await getGameIdsWithPredictions();
        return Game.find({ _id: { $in: gameIds } })
          .sort({ startTime: 1 })
          .populate('teams');
      }
      case 'noPrediction': {
        // find games in tournament without predictions
        const gameIds = await getGameIdsWithPredictions();
        return Game.find({ _id: { $nin: gameIds } }, tournament)
          .sort({ startTime: 1 })
          .populate('teams');
      }
      default:
        // defaults to all
        return Game.find({ tournament })
          .sort({ startTime: 1 })
          .populate('teams');
    }
  } catch (e) {
    return Boom.badImplementation(`error getting game: ${e}`);
  }
};

exports.setResult = async request => {
  // TODO
  // verify winner and runner-up come from the right group/game
  // verify winner and runner-up are not the same

  try {
    const { game, winner, runnerUp } = request.payload;

    // update game object
    const updatedGame = await Game.findOneAndUpdate(
      { _id: game },
      { $set: { winner, runnerUp } },
      { new: true }
    );

    const nextRoundGames = {};
    if (updatedGame.winnerToGame) {
      nextRoundGames.a = await Game.findOneAndUpdate(
        { gameNumber: updatedGame.winnerToGame },
        { teams: { $addToSet: updatedGame.winner } },
        { new: true }
      );
    }

    if (updatedGame.runnerUpToGame) {
      nextRoundGames.b = await Game.findOneAndUpdate(
        { gameNumber: updatedGame.runnerUpToGame },
        { teams: { $addToSet: updatedGame.runnerUp } },
        { new: true }
      );
    }

    const { tournament } = updatedGame;
    // increment events complete for tournament
    const updatedTournament = await TournamentHelper.eventComplete(tournament);

    // set correct predictions
    const correctPredictions = await PredictionHelper.setCorrect(game, winner);

    // set incorrect predictions
    const incorrectPredictions = await PredictionHelper.setIncorrect(
      game,
      winner
    );

    // find players with a prediction made
    const predictionsMade = await PredictionHelper.retrieveForGame(game);

    // reduce to ids
    const playerIdsWithPredictionMade = predictionsMade.map(
      prediction => prediction.player
    );

    const predictionDataforUpdate = predictionsMade.map(prediction => ({
      player: prediction.player,
      weighting: prediction.weighting,
      correct: prediction.correct ? 1 : 0
    }));

    // find players with no prediction made
    const playersWithNoPredictionMade = await PlayerHelper.excludeFromIdList(
      playerIdsWithPredictionMade
    );
    // reduce to ids
    const playerIdsWithNoPredictionMade = playersWithNoPredictionMade.map(
      player => player._id
    );

    const updatedScoreSetsCorrect = await Promise.all(
      predictionDataforUpdate.map(async prediction => {
        await ScoreHelper.update(tournament, prediction);
      })
    );

    // update score sets for tournament for players with no prediction made
    const updatedScoreSetsAbsent = await ScoreHelper.update(
      playerIdsWithNoPredictionMade,
      tournament
    );

    return {
      updatedGame,
      nextRoundGames,
      updatedTournament,
      correctPredictions,
      incorrectPredictions,
      updatedScoreSetsCorrect,
      updatedScoreSetsAbsent
    };
  } catch (e) {
    return Boom.badImplementation(`error setting result: ${e}`);
  }
};
