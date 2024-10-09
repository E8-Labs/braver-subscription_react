import React, { useState, useEffect } from 'react';
import {Elements} from '@stripe/react-stripe-js';
import {loadStripe} from '@stripe/stripe-js';


import { useNavigate, withRouter, useLocation } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components'
import Subscribe from './Subscribe';

import ReactModal from 'react-modal';
import AddCard from './AddCard';

import {ToastContainer, toast} from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

import axios from 'axios';
import Stripe from 'stripe'

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);
let stripeKey = process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_STRIPE_SECRET_KEY_LIVE : process.env.REACT_APP_STRIPE_SECRET_KEY
let envr = process.env.REACT_APP_ENVIRONMENT;

let promosArray = envr === "Production" ? [{code: "Braver23", id: process.env.REACT_APP_PROMO_BRAVER23_LIVE}, {code: "BraverLife", id: process.env.REACT_APP_PROMO_BRAVERLIFE_LIVE}, {code: "BraverYr23", id: process.env.REACT_APP_PROMO_BRAVER23_LIVE}] 
: [{code: "Braver23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV}, {code: "BraverLife", id:process.env.REACT_APP_PROMO_BRAVERLIFE_DEV}, {code: "BraverYr23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV}]









const CardsList = (props) => {
  const stripe = Stripe(process.env.stripeKey);
  //console.log("Using Environment " + process.env.REACT_APP_ENVIRONMENT)
  const navigate = useNavigate();
  const location = useLocation();
  //console.log("Params", location.state) 
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [selectedCard, setSelectedCard] = useState(null);
  const [promo, setPromo] = useState(null);
  // const [prices, setPrices] = useState([{id: "price_1Ne3NLC2y2Wr4BecZqIUeYwc", name: "Monthly Plan", unit_amount: "$99.99/mo", trial: "90 day free trial"},
  // {id: "price_1Ne3NLC2y2Wr4BecgGF4TPG6", name: "6 Month Plan", unit_amount: "$999.99/6mo", trial: "90 day free trial"}]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plan, setPlan] = useState("121h1283hser")
  // const [isAddCardPopupOpen, setIsPopupOpen] = useState(false);
  // const [selectPaymentMethod, setSelectPaymentMethod] = useState(false) // If true? show payment methods screen

  useEffect(() => {
    console.log("Plan on cards list is ", location.state.plan)
    //console.log("Props In CardList ", JSON.stringify(location.state.plan))
    if(localStorage.promo_temp){
      //console.log("Have Temp Promp Code ", localStorage.promo_temp)
      // setPromo(localStorage.promo_temp);
    }
    else {
      //console.log("Nothing in local storage")
     }
    loadCards()
    // fetchPrices();
  }, [])


  const loadCards = async ()=>{
    //console.log("User key " + process.env.REACT_APP_LocalSavedUser)
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
        const user = JSON.parse(d)
        //console.log("User is " + user.userid)
        setUser(user)
    const url = `https://braverhospitalityapp.com/braver/api/cardlist`
    const data = await axios.post(url, {
      userid: user.userid,
      apikey: "kinsal0349"
    })
    if(data.data.status === "1"){
      //console.log(data.data);
      let arr = data.data.data || [];
      arr.push({id: "addcard", stripecardid: ""})
      setCards(arr)
      // navigate("/")
    }
    else{
      //console.log( data.data)
      //console.log("Error " + JSON.stringify(data.data.validation_errors))
    }
    //console.log("Loading Cards")
    // //console.log(res)
  }

const closePopup= ()=>{
  // setIsPopupOpen(false)
}

function  promoCodeEdited (code) {
  setPromo(code)
}
  const handlePlanChange = (card)=>{
    setSelectedCard(card)
    //console.log("Card selected ", card)
  }

  const addNewCard = async (priceId) => {
    // setIsPopupOpen(true)
    navigate("/addcard", {state: {
      // promoCodeEdited: {promoCodeEdited},
      plan: location.state.plan,
    }})
  }

  const createSubscription = async () => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    const codeid = localStorage.promo_id;
    // if(codeid === null && code !== null){
    //     //console.log("Invalid promo code")
    //     toast('Invalid Promo Code', {
    //       position: toast.POSITION.BOTTOM_CENTER,
    //       className: 'toast-message'
    //   })
    // }
    // else{
        //console.log("User is " + user.userid)
    
      // process the payment using one of the cards or let user select the card
      //console.log("Payment method added, now process the payment")
      const params = {userid: user.userid,
        plan: location.state.plan.id,
        apikey: "kinsal0349",
        payment_method: selectedCard ? selectedCard.stripecardid : null,
        "promo_code": codeid,
      }
      //console.log("Params ", params)
      const data = await axios.post("https://braverhospitalityapp.com/braver/api/create_subscription", params);
        //console.log("data loaded")
        if(data.data.status === "1"){
            //console.log(data.data); // this will have the whole response from the api with status, message and data
            // toast(`User logged in as ${data.data.data.user.name}`);
            
            navigate("/account", {
              subscription: data.data.data,
              replace: true,
            })
        }
        else{
            // toast.error("Error : " + data.data.message)
            //console.log("Error " + data.data.message)
        }
    // }
   
  }

  const loadPromoCodeScreen = () => {
    if(cards.length === 1){ // only the button is in the array
      //console.log("No cards, please add a card")
      toast.error("No cards added, please add a card first", {
        position: "bottom-right",
        pauseOnHover: true,
        autoClose: 8000,
        theme: "dark"
      });
    }
    else{
      if(promo == null){ // if promo is null then go to get the promo code
        navigate("/addpromocode", {state: {
          plan: location.state.plan,
          card: selectedCard,
        }})
      }
      else{
        //console.log("Promo is not null so load the payment screen ", promo)
        createSubscription()
        // take the user to subscription screen
      }
    }
    
  }
  

  

  if(subscriptionData) {
    return <Subscribe state={subscriptionData} />
  }

  

  return (
    <FormContainer className=''>
      
      {/* heading row */}
      <div className='row headingrow  p-2'>
        <div className='col-2 btn' onClick={() => {
              //console.log("Back button clicked")
              navigate(-1)
            }}>
              <img className='backbtn' src="/backarrow.png"></img>
        </div>
        <div className='col centertitlediv'>
            <p className='text-white text-center fs-6'> Select Card</p>
        </div>

        <div className='col-2 btn' onClick={() => {
              //console.log("Add Card Button clicked")
              addNewCard()
            }}>
              <img className='backbtn' src="/addicon.png"></img>
        </div>
      </div>


          

          <div className="price-list row bg-red">
            <ul className='list'>
                {cards.map((card, index) => {
                  return (
                    index < cards.length - 1 ?(
                      <li key={card.stripecardid}>
                    <div className={"row price-container "} key={card.stripecardid} id={card.stripecardid} onClick={() => {
                      handlePlanChange(card)
                    }}>
                      <div className='col brandingimages'>
                        <img className='cardtick' src={(selectedCard != null && card.stripecardid == selectedCard.stripecardid) ? "/tickselected.png" : "/tickunselected.png"}></img>
                        <img className='cardbrand ms-2' src={card.cardbrand == "Visa" ? "/logo_visa.png" : "logo_mastercard.png"}></img>
                        <div className='row ms-1 carddetails'>
                          <p className='col-12 text-white fs-6 '>{card.cardnumber}</p>
                          <p className='col-12 text-white fs-6 '>Expiry {card.expirydate}</p>
                        </div>
                      </div>
                    </div>
                    <div className='row p-2'></div>
                    </li>
                    ) : 
                    (
                      <li className='justify-content-center align-items-center'>
                          <button className='col-12'  onClick={() => {
                            //console.log("Make payment here")
                            //New Logic: Take user to promo code
                            loadPromoCodeScreen()
                            // createSubscription()
                          }}>
                              Next/Add Promo Code
                          </button>
                      </li>
                    )
                  )
                })}
            </ul>
          </div>
          
              
          {/* <button className='col-12'  onClick={() => {
                            //console.log("Make payment here")
                            //New Logic: Take user to promo code
                            loadPromoCodeScreen()
                            // createSubscription()
                          }}>
                              Continue
                          </button> */}
          <ToastContainer />
      
    </FormContainer>
  );
}

const FormContainer = styled.div`
height: 100vh;
  width: 100vw;
  background-size : cover;
  display: flex;
  overflow: hidden;
  flex-direction: column;
  justify-content: top; // vertical center if column and horizontal if row
  gap: 1rem;
  align-items: center; //horizontal center
  background-color: #06090F;
.headingrow{
  padding-top: 1rem;
  
  justify-content: space-between;
  align-items: center;
  background-color: transparent;
  width: 100vw;
  .btn{
    display: flex;
    flex-direction: row;
    // background-color: red;
    justify-content: center;
    align-items: center;
  }
  .backbtn{
    // background-color: black;
    width: 15vw;
  }
  .centertitlediv{
    // width: 70vw;
    align-items: center;
    justify-content: center;
    background-color: transparent;
  }
}

  .transparent-bg{
    background-size : cover;
    width: 100vw;
    height: 100vh;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
    
  }
  
  button{
    background-color: #FFFFFF15;
    color: white;
    padding: 1rem 2rem;
    margin-bottom: 1rem;
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
 
  
  .price-list{

    // z-index: 1;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: 1rem;
    padding: 1.5rem;
    background-color: transparent;
    border-radius: 0rem;
    overflow: auto;
    .list{
      gap: 2rem;
      width: 90vw;
    }
    .price-container{
      // flex-grow: 1;
      border: none;
      // height: 6rem;
      padding: 1rem;
      border-radius: 0.8rem;
      // margin-inline-end: 15px;
      
      background-color: #FFFFFF15;
      .brandingimages{
        justify-content: start;
        align-items: center;
        display: flex;
      }
      .carddetails{
        display: flex;
        flex-direction: column;
        // background-color: red;
        justify-content: center;
        align-items: center;
        gap: 0.0rem;
        padding: 0;
      }
      .tickimage{
        display: none;
      }
      .cardbrand{
        width: 2rem;
      }
      .cardtick{
        width: 1.5rem;
      }
    }
    .price-containerselected{
      // z-index: 1;
      flex-grow: 1;

      // width: 15rem;
      border: none;
      // border-width: 1rem;
      padding: 1rem;
      border-radius: 0.8rem;
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
export default (CardsList);
