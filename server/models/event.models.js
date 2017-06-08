import mongoose from 'mongoose';
import { isURL } from 'validator';

/* eslint func-names: 0*/
/* eslint prefer-arrow-callback: 0*/

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
  eventInformation: {
    type: {
      address: String,
      state: String,
      city: String,
      imageUrl: String
    },
    required: true,
  },
  eventUrl: {
    type: String,
    validate: [{ validator: value => isURL(value), msg: 'Invalid url.' }]
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  attendees: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  isPrivate: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// make event an online event if it has a url
EventSchema.pre('save', function (next) {
  if (this.eventUrl) {
    this.isOnline = true;
  }
  next();
});

const Event = mongoose.model('Event', EventSchema);

export default Event;
