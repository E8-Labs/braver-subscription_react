import React from 'react';
import './App.css';
import { BrowserRouter as Switch, Routes, Route, BrowserRouter } from 'react-router-dom';

import Account from './Account';
import Cancel from './Cancel';
import Prices from './Prices';
import Register from './Register';
import Subscribe from './Subscribe';


// import {ElementsConsumer, PaymentElement, 
//   CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Stripe from 'stripe'
import axios from 'axios';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';




import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import AddCard from './AddCard';
import CardsList from './CardsList';
import PromoCode from './PromoCode';



const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

function App(props) {
  return (
    <Elements stripe={stripePromise}>
    <BrowserRouter>
      <Routes>
      <Route exact path="/:hash"  element={<Register />} >
        
      </Route>

      <Route exact path="/addpromocode"  element={<PromoCode />} >
        
      </Route>

      <Route exact path="/cards"  element={<CardsList />} >
        
      </Route>
      
      <Route path="/prices"  element={<Prices />} >
        
      </Route>

      <Route path="/addcard"  element={<AddCard />} >
        
      </Route>

      <Route path="/subscribe"  element={<Subscribe />} >
        
      </Route>
      <Route path="/account"  element={<Account />} >
        
      </Route>
      <Route path="/cancel"  element={<Cancel />} >
        
      </Route>
    </Routes>
    </BrowserRouter>
    </Elements>
  );
}

export default App;
