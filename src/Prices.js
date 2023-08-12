import React, { useState, useEffect } from 'react';
import { useNavigate, withRouter } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import styled from 'styled-components'
import Subscribe from './Subscribe';

import ReactModal from 'react-modal';
import AddCard from './AddCard';

import axios from 'axios';
import Stripe from 'stripe'

const Prices = () => {
  const stripe = Stripe('sk_test_51JfmvpC2y2Wr4Becgv8amGZMeUsm1Y9CgJTeJVcX7fCxWdeIHXh0tLmxewFN1d71uSZKxCpQIwkdmS0QG2c8Vdw600KxxN1UwK');
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [cards, setCards] = useState([]);
  const [prices, setPrices] = useState([{id: "price_1Ne3NLC2y2Wr4BecZqIUeYwc", name: "Monthly Plan", unit_amount: "USD 99.99 / mo", trial: "90 day free trial"},
  {id: "price_1Ne3NLC2y2Wr4BecgGF4TPG6", name: "6 Month Plan", unit_amount: "USD 999.99 / half year", trial: "90 day free trial"}]);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [plan, setPlan] = useState("121h1283hser")
  const [isAddCardPopupOpen, setIsPopupOpen] = useState(false);
  const [selectPaymentMethod, setSelectPaymentMethod] = useState(false) // If true? show payment methods screen

  useEffect(() => {
    

    loadCards()
    // fetchPrices();
  }, [])


  const loadCards = async ()=>{
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

  if(user !== null && user.is_premium === true){
    return (
      <FormContainer className='bg-image '>
        
        <h1 >Already subscribed</h1>
       </FormContainer>
    )
  }

  return (
    <FormContainer className='bg-red bg-image'>
      <ReactModal
            isOpen={isAddCardPopupOpen}
            contentLabel="Add card"
            onRequestClose={()=>{setIsPopupOpen(false)}}
            style={customStyles}
            ariaHideApp={false}
            >
            <AddCard closePopup={closePopup} oncardAdded={loadCards} />
      </ReactModal>
      <div className='transparent-bg'>
      </div>
          <p className='text-white heading' >Select a subscription plan</p>

          <div className="price-list row">
            {prices.map((price) => {
              return (
                <div className={price.id == plan ? "price-containerselected col-2" : "price-container col-2"} key={price.id} id={price.id} onClick={handlePlanChange}>
                  <h3  className='text-white'>{price.name}</h3>
                  <p className='text-white fs-6' >{price.trial}</p>
                  <p className='text-white fs-5'>
                    {price.unit_amount}
                  </p>
              

                </div>
              )
            })}

          </div>
          <button className='col-md-3 col-6' onClick={() => createSubscription(plan.id)}>
                  Subscribe
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
  background-color: #131324;

  .transparent-bg{
    width: 100vw;
    height: 100vh;
    display: flex;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
  }

  .heading{
    font-size: 3.0vw;
    font-weight: bold;
  }

  h1, button{
    z-index: 2;
  }
  button{
    border-radius: 0.3rem;
    font-size: 2.2vw;
    
  }
  @media (max-width: 675px) {
    button {
      font-size: 3.0vh;
      font-weight: bold;
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
    padding: 1rem;
    background-color: #00000070;
    border-radius: 1rem;

    margin: 1rem;
    .price-container{
      // z-index: 1;
      width: 15rem;
      border: gray solid 0.1rem;
      // border-width: 1rem;
      padding: 1rem;
      border-radius: 0.3rem;
    }
    .price-containerselected{
      // z-index: 1;
      width: 15rem;
      border: white solid 0.1rem;
      // border-width: 1rem;
      padding: 1rem;
      border-radius: 0.3rem;
    }
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
