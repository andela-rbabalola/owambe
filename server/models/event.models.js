import mongoose from 'mongoose';

const Schema = mongoose.Schema;

mongoose.Promise = require('bluebird');

const EventSchema = new Schema({
  eventName: {
    type: String,
    unique: true,
    required: true,
    trim: true
  },
  eventDate: {
    type: Date,
    required: true
  },
  eventLocation: {
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
}, {
  timestamps: true
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
