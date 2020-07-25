const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  tour: {
    type: mongoose.Schema.ObjecetId,
    ref: 'Tour',
    required: [true, 'A booking must have a Tour!']
  },
  user: {
    type: mongoose.Schema.ObjecetId,
    ref: 'User',
    required: [true, 'A booking must have a User!']
  },
  price: {
    type: Number,
    required: [true, 'A booking must have a Price!']
  },
  createdAt: {
    type: Date,
    default: Date.now()
  },
  paid: {
    type: Boolean,
    default: true
  }
});

const Booking = mongoose.model('Booking', bookingSchema);

bookingSchema.pre(/^find/, function(next) {
  this.populate('user').populate({
    path: 'tour',
    select: 'name'
  });
});

module.exports = Booking;
