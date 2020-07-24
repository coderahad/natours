// this class comes from the stripe library linked to the tour.pug page.
import axios from 'axios';

const stripe = Stripe(
  'pk_test_51H83D9CGOvvjwdDpMkJ1oPaO9CRx51qTEYe7g9DOTyxrEgyw82YAKTqAVRzQNmOXuceaF5TBaiTF6VmE4MxxxqNX00XaejWHbm'
);
// this tourId parameter will take tourId comes from the webpage through data attribute. This function will be called in index.js with an event listener in next commit

export const bookTour = async tourId => {
  // 1) Get checkout session from API
  // no need method as this is only a simple get request
  const session = await axios(`http://127.0.0.1:3000/api/v1/bookings/checkout-session/${tourId}`);

  console.log(session);

  // 2) create chedkout form + charge credit card
}