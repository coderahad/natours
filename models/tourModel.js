const mongoose = require('mongoose');
const slugify = require('slugify');
// const User = require('./userModel');
// const validator = require('validator');

const tourSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'A tour must have a name'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A tour must have a name less than or equal 40 characters'
      ],
      minlength: [
        10,
        'A tour must have a name more than or equal 10 characters'
      ]
      // validate: [validator.isAlpha, 'A tour name contains only letter']
    },
    slug: String,
    duration: {
      type: Number,
      required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
      type: Number,
      required: [true, 'A tour must have a group size']
    },
    ratingsAverage: {
      type: Number,
      default: 4.5,
      max: [5.0, 'A tour must have a ratingsAverage less than or equal 5.0'],
      min: [1.0, 'A tour must have a ratingsAverage more than or equal 1.0'],
      set: val => Math.round(val * 10) / 10 // 4.6666667, 46.6666667, 47, 4.7
    },
    ratingsQuantity: {
      type: Number,
      default: 0
    },
    difficulty: {
      type: String,
      required: [true, 'A tour must have a difficulty'],
      enum: {
        values: ['easy', 'medium', 'difficult'],
        message: 'Difficulty is either: easy, medium, difficult'
      }
    },
    summary: {
      type: String,
      trim: true,
      required: [true, 'A tour must have a description']
    },
    description: {
      type: String,
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'A tour must have a price']
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function(val) {
          // 'this' only points to the current document on NEW document creation and not for update
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below the tour price'
      }
    },
    imageCover: {
      type: String,
      required: [true, 'A tour must have a cover image']
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    startDates: {
      type: [Date],
      required: [true, 'A tour must have start dates']
    },
    secretTour: {
      type: Boolean,
      default: false
    },
    startLocation: {
      type: {
        type: String,
        default: 'Point',
        enum: ['Point']
      },
      coordinates: [Number],
      address: String,
      description: String
    },
    locations: [
      {
        type: {
          type: String,
          default: 'Point',
          enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String,
        day: Number
      }
    ],
    guides: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'User'
      }
    ]
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// tourSchema.index({ price: 1 });
tourSchema.index({ price: 1, ratingsAverage: -1 });
tourSchema.index({ slug: 1 });
tourSchema.index({ startLocation: '2dsphere' });

tourSchema.virtual('durationWeeks').get(function() {
  return this.duration / 7;
});

// Virtual populate
tourSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'tour',
  localField: '_id'
});

//DOCUMENT MIDDLEWARE: runs before .save() and .create()
tourSchema.pre('save', function(next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

// tourSchema.pre('save', async function(next) {
//   const guidesPromises = this.guides.map(async id => await User.findById(id));
//   this.guides = await Promise.all(guidesPromises);
//   next();
// });

// tourSchema.pre('save', function(next) {
//   console.log('Will save the document');
//   next();
// });

// tourSchema.post('save', function(doc, next) {
//   console.log(doc);
//   next();
// });

tourSchema.pre(/^find/, function(next) {
  this.find({ secretTour: { $ne: true } });
  this.start = Date.now();
  next();
});

tourSchema.pre(/^find/, function(next) {
  this.populate({
    path: 'guides',
    select: '-__v -passwordChangedAt'
  });
  next();
});

tourSchema.post(/^find/, function(docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds`);
  // console.log(docs);
  next();
});

// tourSchema.pre('aggregate', function(next) {
//   this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
//   // console.log(this.pipeline());
//   next();
// });

// as geoNear should be the first stage in aggregate this midlwre for checking sec tour need workaround.
tourSchema.pre('aggregate', function(next) {
  //check firstInPipeline
  const firstInPipeline = this.pipeline()[0];
  if (firstInPipeline.hasOwnProperty('$geoNear')) {
    //don't match secret tours, but splice "$match" stage after $geoNear in pipeline
    this.pipeline().splice(1, 0, {
      $match: { secretTour: { $ne: true } }
    });
    return next();
  }

  this.pipeline().unshift({ $match: { secretTour: { $ne: true } } });
  // console.log(this.pipeline());
  next();
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
