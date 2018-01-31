const login = require('./actions/login');
const createTherapist = require('./actions/createTherapist');
const pageOfTherapists = require('./queries/pageOfTherapists');

module.exports = (actions, queries) => {
  actions.register(login);
  actions.register(createTherapist);

  queries.register(pageOfTherapists);
};