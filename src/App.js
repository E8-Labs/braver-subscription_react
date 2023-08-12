import React from 'react';
import './App.css';
import { BrowserRouter as Switch, Routes, Route, BrowserRouter } from 'react-router-dom';

import Account from './Account';
import Cancel from './Cancel';
import Prices from './Prices';
import Register from './Register';
import Subscribe from './Subscribe';

import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle";
import AddCard from './AddCard';

function App(props) {
  return (
    <BrowserRouter>
      <Routes>
      <Route exact path="/"  element={<Register />} >
        
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
  );
}

export default App;
