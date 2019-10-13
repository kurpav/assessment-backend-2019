const { Incident, User } = require('../../models');
const { UserInputError } = require('apollo-server-express');

const Status = {
  Created: 'Created',
  Resolved: 'Resolved',
  Acknowledged: 'Acknowledged'
};

const updateIncident = async (id, update) => {
  const result = await Incident.findByIdAndUpdate(id, update, { new: true });
  return result;
};

const queries = {
  async incidents(_, { input: { offset = 0, limit = 4, sort , dir = 'asc' } }) {
    const opts = { offset, limit };
    if (sort) {
      opts.sort = { [sort]: dir };
    }
    const result = await Incident.paginate({}, opts);
    return result;
  },
  async incident(_, { id }) {
    const result = await Incident.findById(id);
    return result;
  }
};

const mutations = {
  async createIncident(_, { input: { title, description = '' } }) {
    const engineer = await User.findOne({ role: 'Engineer'});

    const incident = new Incident({
      title,
      description: description,
      assignee: engineer.toJSON().email,
      status: Status.Created
    });

    try {
      await incident.save();
    } catch (err) {
      console.error('ERROR: ' + err);
    }

    return incident.toJSON();
  },
  async assignIncident(_, { input: { id, email } }) {
    const engineer = await User.findOne({ email });

    if (!engineer) {
      throw new UserInputError('Invalid user email');
    }

    try {
      incident = await updateIncident(id, { assignee: engineer.toJSON().email });
    } catch (err) {
      console.error('ERROR: ' + err);
    }

    return incident.toJSON();
  },
  async acknowledgeIncident(_, { input: { id } }) {
    let incident;
    try {
      incident = await updateIncident(id, { status: Status.Acknowledged });
    } catch (err) {
      console.error('ERROR: ' + err);
    }

    return incident ? incident.toJSON() : { };
  },
  async resolveIncident(_, { input: { id } }) {
    let incident;
    try {
      incident = await updateIncident(id, { status: Status.Resolved });
    } catch (err) {
      console.error('ERROR: ' + err);
    }

    return incident ? incident.toJSON() : { };
  },
  async deleteIncident(_, { input: { id } }) {
    let res = true;
    try {
      await Incident.findByIdAndDelete(id);
    } catch (err) {
      console.error('ERROR: ' + err);
      res = false;
    }

    return res;
  }
}

module.exports = {
  queries,
  mutations,
  types: {
    Incident: {
      id(obj) {
        return obj._id;
      }
    }
  }
};
