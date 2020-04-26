const Tour = require('../models/tourModel');

exports.aliasTopTours = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,duration';
  next();
};
exports.getAllTours = async (req, res) => {
  try {
    //BUILD QUERY
    //1) FILTERING
    const queryObj = { ...req.query };
    const excludedFields = ['page', 'limit', 'sort', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);

    //2) ADVANCE FILTERING
    let queryString = JSON.stringify(queryObj);
    queryString = queryString.replace(
      /\b(gt|gte|lt|lte)\b/g,
      match => `$${match}`
    );
    // {duration: {$gte: 5}, difficulty: 'easy'}
    // { duration: { gte: '5' }, difficulty: 'easy' }

    let query = Tour.find(JSON.parse(queryString));
    // .where('duration')
    // .equals(5)
    // .where('difficulty')
    // .equals('easy');
    // SORTING
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
      //sort('price ratingsAverage')
    } else {
      query = query.sort('-createdAt');
    }

    if (req.query.fields) {
      const fields = req.query.fields.split(',').join(' ');
      query = query.select(fields);
      // select('name price ratingsAverage duration')
    } else {
      query = query.select('-__v');
    }

    //PAGINATION

    const limit = req.query.limit * 1 || 100;
    const page = req.query.page * 1 || 1;
    const skip = (page - 1) * limit;

    query = query.skip(skip).limit(limit);
    if (req.query.page) {
      const numTours = await Tour.countDocuments();
      if (skip >= numTours) throw new Error('This page does not exist');
    }

    // EXECUTE QUERY
    const tours = await query;

    // SEND RESPONSE
    res.status(200).json({
      status: 'Success',
      result: tours.length,
      requestedAt: req.requestTime,
      data: {
        tours
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.getTour = async (req, res) => {
  try {
    // const tour = await Tour.findOne({_id: req.params.id});
    // tour.save();
    const tour = await Tour.findById(req.params.id);
    res.status(200).json({
      status: 'Success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'Fail',
      message: err
    });
  }
};

exports.createTour = async (req, res) => {
  try {
    // const newTour = new Tour({});
    // newTour.save().then();
    const newTour = await Tour.create(req.body);
    res.status(201).json({
      status: 'success',
      data: {
        tour: newTour
      }
    });
  } catch (err) {
    res.status(400).json({
      status: 'Fail',
      message: err
    });
  }
};
exports.updateTour = async (req, res) => {
  try {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    res.status(200).json({
      status: 'success',
      data: {
        tour
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};

exports.deleteTour = async (req, res) => {
  try {
    await Tour.findByIdAndDelete(req.params.id);
    res.status(204).json({
      status: 'success',
      data: {
        tour: null
      }
    });
  } catch (err) {
    res.status(404).json({
      status: 'fail',
      message: err
    });
  }
};
