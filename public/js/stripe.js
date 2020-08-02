// this class comes from the stripe library linked to the base.pug page.
import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51H83D9CGOvvjwdDpMkJ1oPaO9CRx51qTEYe7g9DOTyxrEgyw82YAKTqAVRzQNmOXuceaF5TBaiTF6VmE4MxxxqNX00XaejWHbm'
);

export const bookTour = async tourId => {
  try{
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
  
    // console.log(session);
  
    // 2) create checkout form + charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })

  } catch(err) {
    console.log(err);
    showAlert('error', err);
  }
}