const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate');

const IncidentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },
    description: {
      type: String
    },
    assignee: {
      type: String,
      required: true
    },
    status: {
      type: String,
      enum: ['Created', 'Acknowledged', 'Resolved']
    }
  },
  { timestamps: true }
);
IncidentSchema.plugin(mongoosePaginate);

const Incident = mongoose.model('Incident', IncidentSchema);

module.exports = Incident;
