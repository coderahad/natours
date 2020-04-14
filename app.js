const fs = require('fs');
const express = require('express');

const app = express();
app.use(express.json());

// app.get('/', (req, res) => {
//   res
//     .status(200)
//     .json({ message: 'Hello from the server side', app: 'natours' });
// });

// app.post('/', (req, res) => {
//   res.send('You can send post to this endpoint....');
// });

const tours = JSON.parse(
  fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`)
);
app.get('/api/v1/tours', (req, res) => {
  res.status(200).json({
    status: 'Success',
    result: tours.length,
    data: {
      tours
    }
  });
});

app.get('/api/v1/tours/:id', (req, res) => {
  const id = req.params.id * 1;
  const tour = tours.find(el => el.id === id);
  // if (id > tours.length) {
  //   res.status(404).json({
  //     status: 'fail',
  //     data: 'There is no tour with that id'
  //   });
  // }
  if (!tour) {
    res.status(404).json({
      status: 'fail',
      data: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'Success',
    data: {
      tour
    }
  });
});

app.post('/api/v1/tours', (req, res) => {
  const newId = tours[tours.length - 1].id + 1;
  const newTour = Object.assign({ id: newId }, req.body);

  tours.push(newTour);
  fs.writeFile(
    `${__dirname}/dev-data/data/tours-simple.json`,
    JSON.stringify(tours),
    err => {
      res.status(201).json({
        status: 'success',
        data: {
          tour: newTour
        }
      });
    }
  );
  // console.log(req.body);
  // res.send('Done');
});
app.patch('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      data: 'Invalid ID'
    });
  }
  res.status(200).json({
    status: 'success',
    data: {
      tour: '<Updated tour>'
    }
  });
});

app.delete('/api/v1/tours/:id', (req, res) => {
  if (req.params.id * 1 > tours.length) {
    res.status(404).json({
      status: 'fail',
      data: 'Invalid ID'
    });
  }
  res.status(204).json({
    status: 'success',
    data: {
      tour: null
    }
  });
});

const port = 3000;
app.listen(port, () => {
  console.log(`App running on port ${port}.....`);
});
