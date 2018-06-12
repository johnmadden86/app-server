const Hapi = require('hapi');
const bell = require('bell');
const Auth = require('./api/controllers/requests/auth-controller');

const routes = require('require.all')('./routes');

const start = async () => {
  try {
    const Server = Hapi.server({
      host: 'localhost',
      port: 3000
    });

    await Server.register(bell);
    Server.auth.scheme(Auth.schemeName, Auth.scheme);
    Server.auth.strategy(Auth.strategyName, Auth.schemeName);
    Server.auth.strategy('google', 'bell', Auth.googleOAuthOptions(Server));
    // Server.auth.default(Auth.strategyName); // no auth strategy

    // eslint-disable-next-line global-require
    require('./api/data/db');

    const teams = require('./api/data/draw-data');

    for (let i = 0; i < teams.length; i += 8) {
      teams.sort((a, b) => a.worldRanking - b.worldRanking);
      const ranking = teams.slice(i, i + 8);
      // console.log('Ranking:', ranking.map(team => team.shortName));
    }

    function getSum(tot, num) {
      return tot + num;
    }

    const odds = [];
    teams.forEach(team => {
      odds.push(1 / team.bookiesOdds);
    });

    const margin = odds.reduce(getSum);

    const actualChance = [];

    teams.forEach(team => {
      team.actualChance = Math.round(1000 / (team.bookiesOdds * margin)) / 10;
      actualChance.push(team.actualChance);
    });

    const max = Math.max(...actualChance);

    for (let i = 0; i < teams.length; i += 8) {
      teams.sort((a, b) => {
        if (a.pot === b.pot) {
          return a.worldRanking - b.worldRanking;
        }
        return a.pot - b.pot;
      });
      const pot = teams.slice(i, i + 8);
      // console.log('Pot:', pot.map(team => team.shortName));
    }

    for (let i = 0; i < teams.length; i += 8) {
      teams.sort((a, b) => {
        if (a.bookiesOdds === b.bookiesOdds) {
          return a.worldRanking - b.worldRanking;
        }
        return a.bookiesOdds - b.bookiesOdds;
      });
      const pot = teams.slice(i, i + 8);
      // console.log('Odds:', pot.map(team => `${team.shortName} ${team.actualChance}`));
    }

    Object.keys(routes).forEach(key => {
      Server.route(routes[key]);
    });

    await Server.start();
    return Server;
  } catch (e) {
    throw e;
  }
};

start()
  .then(server => {
    console.log(`Server running at: ${server.info.uri}`);
  })
  .catch(err => {
    throw err;
  });
