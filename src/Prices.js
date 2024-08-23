import React, { useState, useEffect } from 'react';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';


import { useNavigate, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components'
import Subscribe from './Subscribe';


import ReactModal from 'react-modal';
import AddCard from './AddCard';

import axios from 'axios';
import Stripe from 'stripe'
import MonthlyPlansList from './MonthlyPlansList';
import YearlyPlansList from './YearlyPlansList';


// import {Logo} from './braver logo.png'

// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

let stripeKey = process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_STRIPE_SECRET_KEY_LIVE : process.env.REACT_APP_STRIPE_SECRET_KEY



let pricesArray = process.env.REACT_APP_ENVIRONMENT === "Production" ? [
  { id: "price_1PqqchC2y2Wr4BecnrBic37s", name: "Monthly Plan", unit_amount: "$1k", trial: "7 day free trial", type: "Monthly", identifier: "monthly_private" },
  { id: "price_1PqqerC2y2Wr4BecRTvEsD1u", name: "Monthly Plan", unit_amount: "$4k", trial: "7 day free trial", type: "Yearly", identifier: "monthly_executive"  },
  { id: "price_1PqqiXC2y2Wr4BecgL2a3LmO", name: "Yearly Plan", unit_amount: "$12k", trial: "7 day free trial", type: "Yearly", identifier: "yearly_private" },
  { id: "price_1Pqqj4C2y2Wr4BecXvK55VpD", name: "Yearly Plan", unit_amount: "$48k", trial: "7 day free trial", type: "Yearly", identifier: "yearly_executive"  }] :

  [{ id: "prod_QiS4Hoeiwm2jIJ", name: "Monthly Plan", unit_amount: "$1k", trial: "7 day free trial", type: "Monthly", identifier: "monthly_private" },
    { id: "prod_QiS4drXDfvStcU", name: "Monthly Plan", unit_amount: "$4k", trial: "7 day free trial", type: "Yearly", identifier: "monthly_executive"  },
    { id: "prod_QiS4xvOyoXmhwe", name: "Yearly Plan", unit_amount: "$12k", trial: "7 day free trial", type: "Yearly", identifier: "yearly_private" },
    { id: "prod_QiS6PVjRklYkr7", name: "Yearly Plan", unit_amount: "$48k", trial: "7 day free trial", type: "Yearly", identifier: "yearly_executive"  }]


const Prices = () => {
  const stripe = Stripe(stripeKey);
  //console.log("Using Environment " + process.env.REACT_APP_ENVIRONMENT)
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  //process.env.REACT_APP_MONTHLY_PLAN
  const [prices, setPrices] = useState(pricesArray);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plan, setPlan] = useState({})
  const [isAddCardPopupOpen, setIsPopupOpen] = useState(false);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState(false) // If true? show payment methods screen

  //toggle monthly and yearly buttons
  const [actMonthly, setActMonthly] = useState(true)
  const [actYearly, setActYearly] = useState(false)

  useEffect(() => {

  }, [])


  const loadCards = async () => {
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
    if (data.data.status === "1") {
      //console.log(data.data);
      setCards(data.data.data)
      // navigate("/")
    }
    else {
      //console.log( data.data)
      //console.log("Error " + JSON.stringify(data.data.validation_errors))
    }
    //console.log("Loading Cards")
    // //console.log(res)
  }

  const closePopup = () => {
    setIsPopupOpen(false)
  }
  const handlePlanChange = (event) => {
    const p = event.currentTarget.id
    console.log("Plan selected " + p)
    for (var i = 0; i < prices.length; i++) {
      if (prices[i].id === p) {
        setPlan(prices[i])
        console.log("Price selected is ", prices[i])
      }
    }
    // setPlan(p)
  }

  const createSubscription = async (priceId) => {
    // setIsPopupOpen(true)
    // setPlan(priceId)
    console.log("Cards list")
    //{ state: { message: "Failed to submit form" } }
    navigate("/cards", {
      state: {
        plan: plan,
        cards: cards,
      }
    })
  }
  const createSubscription2 = async (priceId) => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    setUser(user)
    //console.log("User is " + user.userid)
    if (cards.length === 0) {
      //console.log("No cards, please add a card")
      setIsPopupOpen(true)

    }
    else {
      // process the payment using one of the cards or let user select the card
      //console.log("Payment method added, now process the payment")
      const data = await axios.post("https://braverhospitalityapp.com/braver/api/create_subscription", {
        userid: user.userid,
        plan: plan,
        apikey: "kinsal0349"
      });
      //console.log("data loaded")
      if (data.data.status === "1") {
        //console.log(data.data); // this will have the whole response from the api with status, message and data
        // toast(`User logged in as ${data.data.data.user.name}`);

        navigate("/account", {
          subscription: data.data.data
        })
      }
      else {
        // toast.error("Error : " + data.data.message)
        //console.log("Error " + data.data.message)
      }
    }

  }



  if (subscriptionData) {
    return <Subscribe state={subscriptionData} />
  }

  // if(user !== null && user.is_premium === true){
  //   return (
  //     <FormContainer className='bg-image '>

  //       <h1 >Already subscribed</h1>
  //      </FormContainer>
  //   )
  // }


  const handlyMonthlyClick = () => {
    setActMonthly(true)
    setActYearly(false)
  }

  const handlyYearlyClick = () => {
    setActMonthly(false)
    setActYearly(true)
  }

  return (
    <FormContainer className='bg-image'>

      <div className='transparent-bg'>
      </div>
      {/* <div className=''> */}
      <img className='logo' src='/braverlogo.png' alt='Braver Logo' background='red' height={50}></img>
      <div className='bar-container'>

        <div className='button-container'>
          <button className='button' style={{ background: 'transparent' }}
            onClick={handlyMonthlyClick}
          >
            <div style={{ fontSize: actMonthly ? 20 : 16 }} >Monthly</div>
          </button>
          {
            actMonthly && (
              <div className='button-bar'></div>
            )
          }
        </div>

        <div className='button-container'>
          <button className='button' style={{ background: 'transparent' }}
            onClick={handlyYearlyClick}
          >
            <div style={{ fontSize: actYearly ? 20 : 16 }}>Yearly</div>
          </button>
          {
            actYearly && (
              <div className='button-bar'></div>
            )
          }
        </div>
      </div>


      <div style={{ height: "90%" ,width:'100%',alignItems:'center',justifyContent:'center',marginTop:'3rem'}}>
          {
            actMonthly ? (
              <MonthlyPlansList selectedPlan={plan.identifier}  planSelected={(plan)=> {
                console.log("Plan selected ", plan)
                pricesArray.forEach((item) => {
                  if(item.identifier === plan){
                    setPlan(item)
                  }
                })
              }}/>
            ) : (
              <YearlyPlansList selectedPlan={plan.identifier}  planSelected={(plan)=> {
                console.log("Plan selected yearly", plan)
                pricesArray.forEach((item) => {
                  if(item.identifier === plan){
                    setPlan(item)
                  }
                })
              }}/>
            )
          }
        </div>


      {/* <div className="price-list row">
        {prices.map((price) => {
              return (
                <div className={price.id == plan.id ? "price-containerselected " : "price-container "} key={price.id} id={price.id} onClick={handlePlanChange}>
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
      </div> */}

      <button style={{marginBottom:20}} className='col-8' onClick={() => createSubscription(plan.id)}>
        Continue
      </button>

      {/* </div> */}



    </FormContainer>
  );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100%;
  
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
    background-color: #0C1339; 
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
    .bar-container{
      display:flex;
      // width:60vw;
      // height:rem;
      // background-color:red;
      flex-direction: row;
      align-items:center;
      justify-content:space-between;
    }
      .button-container{
        flex-direction: column;
        align-items:center;
        margin-top:5px

      }
    .button-bar{
      // width:100px;
      height:2px;
      background-color:white;
      border-raduis:2;
      margin-top:10px;

    }
      .button{
        width:100px;
        height:30px;
        background-color: transparent;
        padding:0px;
      }
  
`
const customStyles = {

  overlay: {
    background: "000000"
  },
  content: {
    background: "#00000090",
    border: "none",

  },

};
export default (Prices);
