import react, {useState, useEffect} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {ElementsConsumer, PaymentElement, 
  CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Stripe from 'stripe'
import axios from 'axios';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.


// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);

const CARD_ELEMENT_OPTIONS = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: "antialiased",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

function AddCard(props){
    const navigate = useNavigate();
    const location = useLocation()
    const stripe = Stripe(process.env.REACT_APP_STRIPE_SECRET_KEY);

    const stripeReact = useStripe();
  const elements = useElements();
    
  const [values, setValues] = useState({
    cardnumber: "",
    cardholdername: "",
    cvv: "",
    expirydate: ""
  })

  const handleSubmitStripeCardElement = (event) => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      console.log("Stripe not initialized")
      return;
    }
    const card = elements.getElement(CardElement);
    // console.log(card)
    stripeReact.createToken(card).then(function(result) {
      // Handle result.error or result.token
      console.log("result creating token")
      console.log(result) //contains a card object as well
      
    });
  }
    const handleSubmit = async (event)=>{
      console.log("Callin api");
      console.log("Stripe Secret Key " + process.env.REACT_APP_STRIPE_SECRET_KEY);
    //   this.props.closePopup()
        event.preventDefault();
        const validation = handleValidation()
        // navigate("/prices")
      if(!validation){
            console.log("Validation error")
      }
      else{

        const {cardholdername, cardnumber, cvv, expirydate} = values;
        const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
        const user = JSON.parse(d)
        console.log("User is " + user.userid)

//uncomment below code to generate tokens when in live mode
        // const tok = await stripe.tokens.create({
        //     card: {
        //       number: cardnumber,
        //       exp_month: 8,
        //       exp_year: 2024,
        //       cvc: cvv,
        //     },
        //   }, function(err, token) {
        //     // asynchronously called
        //     console.log("Error creating token")
        //     console.log(err)
        //   });

        const tok = {id: "tok_visa"};
            console.log("Creating token")
             console.log(tok)
            if(tok){
                if(tok.id){
                    console.log("Token obtained " + tok.id)
                    const data = await axios.post("https://braverhospitalityapp.com/braver/api/addcard", {
                        cardnumber: cardnumber,
                        cardholdername: cardholdername,
                        cvc: cvv,
                        expirydate: expirydate,
                        userid: "60ca7a842d8b8",
                        apikey: "kinsal0349",
                        source: tok.id
                    });
                    if(data.data.status === "1"){
                        console.log(data.data); // this will have the whole response from the api with status, message and data
                        // navigate("/prices")
                        // props.oncardAdded()
                        // props.closePopup()
                        
                        navigate(-1)
                    }
                    else{
                        console.log( data.data)
                        console.log("Error " + JSON.stringify(data.data.validation_errors))
                    }
                }
            }

        
      }
        // alert("form");
        
    }

    const handleChange = (event)=>{
      setValues({...values, [event.target.name]: event.target.value })
      
    }
    const handleValidation = ()=>{
      const {password, email} = values;
    //   if(password !== confirmPassword){
    //     toast.error("Passwords do not match", {
    //       position: "bottom-right",
    //       pauseOnHover: true,
    //       autoClose: 8000,
    //       theme: "dark"
    //     });
    //     return false;
    //   }
      return true;
    }


    return(
    <FormContainer >
      <div className='row headingrow  p-2'>
        <div className='col-2 btn' onClick={() => {
              console.log("Back button clicked")
              navigate(-1)
            }}>
              <img className='backbtn' src="/backarrow.png"></img>
        </div>
        <div className='col centertitlediv'>
            <p className='text-white text-center fs-6'> Add New Card</p>
        </div>
        <div className='col-2 btn' onClick={() => {
              // console.log("Add Card Button clicked")
              // addNewCard()
            }}>
              <img className='backbtn' src=""></img>
        </div>
        
      </div>
        <form >
            
            
            
            <input className='inputuser' type='text' placeholder='Card Holder Name' name='cardholdername' onChange={e => handleChange(e)}></input>
            <input className='inputuser' type='text' placeholder='Card Number' name='cardnumber' onChange={e => handleChange(e)}></input>
            <div className='row justify-content-around'>
              <input className='inputuser col-5' type='text' placeholder='Expiry Date' name='expirydate' onChange={e => handleChange(e)}></input>
              <input className='inputuser col-5' type='text' placeholder='CVV' name='cvv' onChange={e => handleChange(e)}></input>
            </div>
            
            
            <button type='submit' onClick={handleSubmit}>Save Card</button>
        </form>
    </FormContainer>
    //  </Elements>
    );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: top; // vertical center
  gap: 0rem;
  align-items: center; //horizontal center
  background-color: #0C1339;

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
  .innerLabel{
    background-color: white;
    height: 40vh;

  }
  .brand {
    display: flex;
    align-items: center;
    gap: 1rem;
    justify-content: center;
    img {
      height: 5rem;
    }
    h1 {
      color: white;
      text-transform: uppercase;
    }
  }

  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    gap: 2rem;
    // background-color: red;
    border-radius: 2rem;
    padding: 1rem 1rem;
    .inputuser {
      background-color: #0C1339;
      padding: 0.6rem;
      border: none;
      border-bottom: 0.1rem solid white;
     
      color: white;
      // width: 100%;
      font-size: 1rem;
      &:focus {
        border-bottom: 0.1rem solid white;
        outline: none;
      }
    }
  }
  
  button {
    background-color: #FFFFFF15;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.9rem;
    font-size: 1rem;
    // text-transform: uppercase;
    &:hover {
      background-color: #FFFFFF45;
    }
  }
  span {
    color: white;
    text-transform: uppercase;
    a {
      color: #4e0eff;
      text-decoration: none;
      font-weight: bold;
    }
  }
`;


export default AddCard; 