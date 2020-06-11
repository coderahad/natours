// review / rating / createdAt / ref to Tour / ref to User
const mongoose = require('mongoose');
const Tour = require('./tourModel');

const reviewSchema = new mongoose.Schema(
  {
    review: {
      type: String,
      reqiured: [true, "Review can't be empty"]
    },
    rating: {
      type: Number,
      default: 4.5,
      max: [5.0, 'Rating must be less than or equal to 5'],
      min: [1.0, 'Rating must be greater than or equal to 1']
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    tour: {
      type: mongoose.Schema.ObjectId,
      ref: 'Tour',
      required: [true, 'Review must belong to a tour']
    },
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Review must belong to a user']
    }
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

reviewSchema.statics.calcAverageRatings = async function(tourId) {
  const stats = await this.aggregate([
    {
      $match: { tour: tourId }
    },
    {
      $group: {
        _id: '$tour',
        nRatings: { $sum: 1 },
        avgRating: { $avg: '$rating' }
      }
    }
  ]);
  console.log(stats);
  await Tour.findByIdAndUpdate(tourId, {
    ratingsAverage: stats[0].avgRating,
    ratingsQuantity: stats[0].nRatings
  });
};

reviewSchema.post('save', function() {
  // this points to the current review
  this.constructor.calcAverageRatings(this.tour);
});

reviewSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'user',
    select: 'name photo'
  });
  next();
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
