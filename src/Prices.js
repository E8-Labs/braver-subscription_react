import React, { useState, useEffect } from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


import { useNavigate, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components'
import Subscribe from './Subscribe';

import ReactModal from 'react-modal';
import AddCard from './AddCard';

import axios from 'axios';
import Stripe from 'stripe'

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const Prices = () => {
  const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [prices, setPrices] = useState([{id: "price_1Ne3NLC2y2Wr4BecZqIUeYwc", name: "Monthly Plan", unit_amount: "$99.99/mo", trial: "90 day free trial"},
  {id: "price_1Ne3NLC2y2Wr4BecgGF4TPG6", name: "6 Month Plan", unit_amount: "$999.99/6mo", trial: "90 day free trial"}]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plan, setPlan] = useState("121h1283hser")
  const [isAddCardPopupOpen, setIsPopupOpen] = useState(false);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState(false) // If true? show payment methods screen

  useEffect(() => {
    

    // loadCards()
    // fetchPrices();
  }, [])


  const loadCards = async ()=>{
    console.log("User key " + process.env.REACT_APP_LocalSavedUser)
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
        const user = JSON.parse(d)
        console.log("User is " + user.userid)
        setUser(user)
    const url = `https://braverhospitalityapp.com/braver/api/cardlist`
    const data = await axios.post(url, {
      userid: user.userid,
      apikey: "kinsal0349"
    })
    if(data.data.status === "1"){
      console.log(data.data);
      setCards(data.data.data)
      // navigate("/")
    }
    else{
      console.log( data.data)
      console.log("Error " + JSON.stringify(data.data.validation_errors))
    }
    console.log("Loading Cards")
    // console.log(res)
  }

const closePopup= ()=>{
  setIsPopupOpen(false)
}
  const handlePlanChange = (event)=>{
    const p = event.currentTarget.id
    console.log("Plan selected " + p)
    setPlan(p)
  }

  const createSubscription = async (priceId) => {
    // setIsPopupOpen(true)
    setPlan(priceId)
    console.log("Cards list")
    //{ state: { message: "Failed to submit form" } }
    navigate("/cards", {state: {
      plan: plan,
      cards: cards,
    }})
  }
  const createSubscription2 = async (priceId) => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    setUser(user)
    console.log("User is " + user.userid)
    if(cards.length === 0){
      console.log("No cards, please add a card")
      setIsPopupOpen(true)
      
    }
    else{
      // process the payment using one of the cards or let user select the card
      console.log("Payment method added, now process the payment")
      const data = await axios.post("https://braverhospitalityapp.com/braver/api/create_subscription", {
          userid: user.userid,
          plan: plan,
          apikey: "kinsal0349"
        });
        console.log("data loaded")
        if(data.data.status === "1"){
            console.log(data.data); // this will have the whole response from the api with status, message and data
            // toast(`User logged in as ${data.data.data.user.name}`);
            
            navigate("/account", {
              subscription: data.data.data
            })
        }
        else{
            // toast.error("Error : " + data.data.message)
            console.log("Error " + data.data.message)
        }
    }
    
  }

  

  if(subscriptionData) {
    return <Subscribe state={subscriptionData} />
  }

  // if(user !== null && user.is_premium === true){
  //   return (
  //     <FormContainer className='bg-image '>
        
  //       <h1 >Already subscribed</h1>
  //      </FormContainer>
  //   )
  // }

  return (
    <FormContainer className='bg-image'>
      {/* <Elements  stripe={stripePromise}>
          <ReactModal
                isOpen={isAddCardPopupOpen}
                contentLabel="Add card"
                onRequestClose={()=>{setIsPopupOpen(false)}}
                style={customStyles}
                ariaHideApp={false}
                className='row bg-red align-items-center justify-content-center'
                >
                <AddCard className='col-md-8' closePopup={closePopup} oncardAdded={loadCards} />
          </ReactModal>
      </Elements> */}
      <div className='transparent-bg'>
      </div>
          <div className='title'>
          <p className='text-white fs-2' >Select a subscription plan</p>
          </div>

          <div className="price-list row">
            {prices.map((price) => {
              return (
                <div className={price.id == plan ? "price-containerselected " : "price-container "} key={price.id} id={price.id} onClick={handlePlanChange}>
                  <div className='row pe-2'>
                    <h3  className='text-white  col-7'>{price.name}</h3>
                    
                    <p className='text-white text-end fs-5 col-4 price-container-amount'>
                      {price.unit_amount}
                    </p>
                    <p className='col-1'></p>
                  </div>
                  <div className='row'>
                    <p className='text-white fs-6 col-6' >{price.trial}</p>
                    <p className='col-4'></p>
                    <img className=' tickimage' src="/tickselected.png"></img>
                  </div>

              

                </div>
              )
            })}

          </div>
          
              <button className='col-8'  onClick={() => createSubscription(plan.id)}>
                  Continue
              </button>
            
          
      
    </FormContainer>
  );
}

const FormContainer = styled.div`
height: 100vh;
  width: 100vw;
  
  display: flex;
  flex-direction: column;
  justify-content: center; // vertical center if column and horizontal if row
  gap: 1rem;
  align-items: center; //horizontal center
  background-color: transparent;

  .transparent-bg{
    width: 100vw;
    height: 100vh;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    
  }
  .title{
    padding-left: 2rem;
    display: flex;
    // flex-grow: 1;
    height: 1rem;
    width: 100vw;
    align-items: left;
    background-color: transparent;
    justify-content: left;
  }
  .heading{
    font-size: 3.0vw;
    font-weight: bold;
  }

  // h1, button{
  //   z-index: 2;
  // }
  button{
    background-color: #FFFFFF15;
    color: white;
    padding: 1rem 2rem;
    border: none;
    // font-weight: normal;
    cursor: pointer;
    border-radius: 14px;
    font-size: 1rem;
    // text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
    
  }
  @media (max-width: 675px) {
    button {
      font-size: 2.4vh;
      // font-weight: bold;
    }
    .heading{
      font-size: 6vw;
      font-weight: bold;
    }
  }
  
  .price-list{
    // z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 2rem;
    padding: 0.5rem;
    background-color: transparent;
    border-radius: 0rem;

    margin: 0.5rem;
    .price-container{
      // box-sizing: border-box;
      // z-index: 1;
      flex-grow: 1;
      // width: 15rem;
      // margin: 0px,
      border: gray solid 0.1rem;
      // border-width: 1rem;
      padding: 1rem;
      border-radius: 0.8rem;
      margin-inline-end: 15px;
      .tickimage{
        display: none;
      }
      
    }
    .price-containerselected{
      // z-index: 1;
      flex-grow: 1;

      // width: 15rem;
      border: white solid 0.1rem;
      // border-width: 1rem;
      padding: 1rem;
      border-radius: 0.8rem;
      .tickimage{
        display: flex;
        width: 3.3rem;
        height: 1.8rem;
        display: flex;
        
      }
    }
  }
  .btndiv{
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: end;
  }
  
`
const customStyles = {
  
  overlay:{
      background: "000000"
  },
  content: {
    background: "#00000090",
    border: "none",
    
  },
  
};
export default (Prices);
