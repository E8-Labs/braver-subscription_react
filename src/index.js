import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';

const root = ReactDOM.createRoot(document.getElementById('root'));

//pk_test_51JfmvpC2y2Wr4BecD5qeIqkwOaNCMScIgL6TdhNQNoFdNkMbqKhSn3xjrC5K9X483QuMApm7h8uAnjcDW7XMqHmy00vHYLByuW
let stripePublickKey = process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY_LIVE : process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY
const stripePromise = loadStripe(stripePublickKey);
const options = {
  // passing the client secret obtained from the server
  clientSecret: 'SecretClientBraver0349',
};
root.render(
  
  <Elements stripe={stripePromise} >
    <App />
  </Elements>
  
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
