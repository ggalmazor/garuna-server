const createPatient = require('./actions/createPatient');
const pageOfPatients = require('./queries/pageOfPatients');

module.exports = (actions, queries) => {
  actions.register(createPatient);

  queries.register(pageOfPatients);
};