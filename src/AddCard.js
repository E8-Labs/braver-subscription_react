import react, {useState, useEffect, useMemo} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {ElementsConsumer, PaymentElement, 
  CardElement, useStripe, useElements, CardNumberElement,
  CardCvcElement,
  CardExpiryElement} from '@stripe/react-stripe-js';
import Stripe from 'stripe'
import axios from 'axios';

import {ToastContainer, toast} from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
// import {Elements} from '@stripe/react-stripe-js';
// import {loadStripe} from '@stripe/stripe-js';

// import CheckoutForm from './CheckoutForm';

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.


// const stripePromise = loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY);


let stripeKey = process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_STRIPE_SECRET_KEY_LIVE : process.env.REACT_APP_STRIPE_SECRET_KEY
let envr = process.env.REACT_APP_ENVIRONMENT;

let promosArray = envr === "Production" ? [{code: "Braver23", id: process.env.REACT_APP_PROMO_BRAVER23_LIVE}, {code: "BraverLife", id: process.env.REACT_APP_PROMO_BRAVERLIFE_LIVE}, {code: "BraverYr23", id: process.env.REACT_APP_PROMO_BRAVER23_LIVE}] 
: [{code: "Braver23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV}, {code: "BraverLife", id:process.env.REACT_APP_PROMO_BRAVERLIFE_DEV}, {code: "BraverYr23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV}]



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

const appearance = {
  theme: 'night',
  variables: {
    fontFamily: 'Sohne, system-ui, sans-serif',
    fontWeightNormal: '500',
    borderRadius: '8px',
    colorBackground: '#0A2540',
    colorPrimary: '#EFC078',
    colorPrimaryText: '#1A1B25',
    colorText: 'white',
    colorTextSecondary: 'white',
    colorTextPlaceholder: '#727F96',
    colorIconTab: 'white',
    colorLogo: 'dark'
  },
  rules: {
    '.Input, .Block': {
      backgroundColor: 'transparent',
      border: '1.5px solid var(--colorPrimary)'
    }
  }
};



const useOptions = () => {
  const fontSize = 12;//useResponsiveFontSize();
  const options = useMemo(
      () => ({
          style: {
              base: {
                  fontSize,
                  color: "#424770",
                  letterSpacing: "0.025em",
                  fontFamily: "Roboto, Source Code Pro, monospace, SFUIDisplay",
                  "::placeholder": {
                      color: "#aab7c4"
                  }
              },
              invalid: {
                  color: "#9e2146"
              },

          }
      }),
      [fontSize]
  );

  return options;
};



function AddCard(props){
  
    const navigate = useNavigate();
    const location = useLocation()
    const stripe = Stripe(stripeKey);
    const [codes, setCodes] = useState(promosArray)

    const stripeReact = useStripe();
  const elements = useElements();
  // const elements = stripe.elements({clientSecret, appearance});
  // let card = elements.cre
    
  const [values, setValues] = useState({
    cardnumber: "",
    cardholdername: "",
    cvv: "",
    expirydate: "",
    
  })

  function getExpiryFromDate () {
    const {cardholdername, cardnumber, cvv, expirydate} = values;
    const myArray = expirydate.split("/");
    if(myArray.length === 2){
        let m = Number(myArray[0].trim()) || 0;
        let y = Number(myArray[1].trim()) || 0;
        //console.log("Month " + m + " Year " + y)
        return [m, y];

    }
    else{
      
      //console.log("Invalid expiry");
      return null;
    }
  }

  

  const handleSubmitStripeCardElement = (event) => {
    if (!stripe || !elements) {
      // Stripe.js hasn't yet loaded.
      //console.log("Stripe not initialized")
      return;
    }
    const card = elements.getElement(CardElement);
    //console.log("User element card is ")
    //console.log(card)
    stripeReact.createToken(card).then(function(result) {
      // Handle result.error or result.token
      //console.log("result creating token")
      //console.log(result) //contains a card object as well
      
    });
  }
    const handleSubmit = async (event)=>{

      // let codeid = null;
      //   if(localStorage.promo_temp !== null){
      //       for(let i = 0; i < codes.length; i++){
      //           if(codes[i].code === localStorage.promo_temp){
      //               codeid = codes[i].id;
      //           }
      //       }
      //   }
      //   if(localStorage.promo_temp != null && codeid == null){
      //     //console.log("Invalid promo code")
      //     return
      //   }
        // localStorage.setItem("promo_id", codeid);
      //console.log("Callin api");
      //console.log("Stripe Secret Key " + stripeKey);
    //   this.props.closePopup()
        event.preventDefault();
        const validation = handleValidation()
        // navigate("/prices")
      if(!validation){
            //console.log("Validation error")
      }
      else{

        const {cardholdername, cardnumber, cvv, expirydate} = values;
        // const card = elements.getElement('card');
        if (!stripe || !elements) {
          // Stripe.js hasn't yet loaded.
          //console.log("Stripe not initialized")
          return;
        }
        const card = elements.getElement(CardElement);
    //     const nm = elements.getElement('cardNumber');
    //     //console.log("Card number ", nm);
    //     card.update({value: {cardNumber: cardnumber}});
    //     card.update({value: {cardExpiry: expirydate}});
    //     card.update({value: {cardCvc: cvv}});
    // console.log("User element card is ")
    // console.log(card)
    stripeReact.createToken(card).then( async function(tok) {
      // Handle result.error or result.token
      console.log("result creating token")
      console.log(tok) //contains a card object as well
      if(tok.token.id){

        const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
        const user = JSON.parse(d)
        //console.log("User is " + user.userid)
        if(user === null){
          return;
        }//cus_JgU9iurcpCxLOx
        //console.log("Token obtained " + tok.id)
        const data = await axios.post("https://braverhospitalityapp.com/braver/api/addcard", {
            cardnumber: "*****",
            cardholdername: "*****",
            cvc: "*****",
            expirydate: "*****",
            userid: user.userid,
            apikey: "kinsal0349",
            source: tok.token.id
        });
        if(data.data.status === "1"){
            //console.log(data.data); // this will have the whole response from the api with status, message and data
            // navigate("/prices")
            // props.oncardAdded()
            // props.closePopup()
            
            navigate(-1)
        }
        else{
            //console.log( data.data)
            //console.log("Error " + JSON.stringify(data.data.validation_errors))
            toast.error(data.data.message, {
              position: "bottom-right",
              pauseOnHover: true,
              autoClose: 8000,
              theme: "dark"
            });
        }
    }
    else if (tok.error){
      //console.log("Error ")
      //console.log(tok.error)
      toast.error(tok.error, {
        position: "bottom-right",
        pauseOnHover: true,
        autoClose: 8000,
        theme: "dark"
      });
    }
    });
        
        


        
      }
        // alert("form");
        
    }

    const handleChangePromo = (event)=>{
      //   setValues({...values, [event.target.name]: event.target.value })
      //console.log("Props in add card");
      //console.log(location.state)
      localStorage.setItem("promo_temp", event.target.value);

      
      }

    const handleChange = (event)=>{
      setValues({...values, [event.target.name]: event.target.value })
      
    }
    const handleValidation = ()=>{
      const {password, email} = values;
    //   if(password !== confirmPassword){
        // toast.error("Passwords do not match", {
        //   position: "bottom-right",
        //   pauseOnHover: true,
        //   autoClose: 8000,
        //   theme: "dark"
        // });
    //     return false;
    //   }
      return true;
    }


    return(
      
    <FormContainer >
      <div className='row headingrow  p-2'>
        <div className='col-2 btn' onClick={() => {
              //console.log("Back button clicked")
              navigate(-1)
            }}>
              <img className='backbtn' src="/backarrow.png"></img>
        </div>
        <div className='col centertitlediv'>
            <p className='text-white text-center fs-6'> Add New Card</p>
        </div>
        <div className='col-2 btn' onClick={() => {
              // //console.log("Add Card Button clicked")
              // addNewCard()
            }}>
              <img className='backbtn' src=""></img>
        </div>
        
      </div>
        <form >
            
            <div className='col-12 '>
              <CardElement className='card' options={{
                style: {
                  base: {
                    backgroundColor: "white"
                  } 
                },
              }}/>
            
            </div>

        
            {/* <input className='inputuser' type='text' placeholder='Card Holder Name' name='cardholdername' onChange={e => handleChange(e)}></input>
            <CardNumberElement   className='inputuser' type='text' placeholder='Card Number' name='cardnumber' onChange={e => handleChange(e)}></CardNumberElement>
            <div className='row justify-content-around'>
              <CardExpiryElement   className='inputuser col-5' type='text'  name='expirydate' onChange={e => handleChange(e)}></CardExpiryElement>
              <CardCvcElement   className='inputuser col-5' type='text' placeholder='CVV' name='cvv' onChange={e => handleChange(e)}></CardCvcElement>
            </div> */}

            {/* <div className='titleLabel'>
              <label>Have a promo code?</label>
            </div>
            <input className='inputuser' type='text' placeholder='Promo Code' name='code' onChange={e => handleChangePromo(e)}></input> */}
            <button type='submit' onClick={handleSubmit}>Save Card</button>
        </form>
        <ToastContainer />
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
  background-color: #06090F;
  .titleLabel{
    flex: 1,
    justify-content: left;
    align-items: left;
    width: 100vw;
    color: white;
    label{
      padding-left: 5px;
      color: white;
    }
  }
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
      background-color: #06090F;
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

  .toast-message {
    background: red;
    color: #fff;
    font-size: 1rem;
    width: 100vw;
    height: 5vh;
    padding: 1rem;
    margin-bottom: 2rem;
}
.card {
  background-color: white;
  padding: 10px 20px 11px;
  border-radius: 5px;
  width: 100%;
  border: 1px solid #afafaf;
  box-shadow: 0px 4px 5.5px 0px rgba(0, 0, 0, 0.07);
}
`;


export default AddCard; 