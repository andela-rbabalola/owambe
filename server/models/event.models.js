import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const EventSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    address: String,
    state: String,
    city: String
  },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: {
    type: Boolean,
    default: false
  },
  imageUrl: String
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
