const { User } = require('../../models');

module.exports = {
  queries: {
    async users() {
      const result = await User.find({});
      return result;
    }
  }
};
