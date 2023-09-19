import react, {useState, useEffect} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {ElementsConsumer, PaymentElement, 
  CardElement, useStripe, useElements} from '@stripe/react-stripe-js';
import Stripe from 'stripe'
import axios from 'axios';
import {ToastContainer, toast} from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';
import { sha512 } from 'ethers';
// toast.configure()

function PromoCode(props){
    const navigate = useNavigate();
    const [code, setCode] = useState(null)
    const [codes, setCodes] = useState([{code: "Braver23", id: "promo_1NqB0NC2y2Wr4BecXhZvEzeA"}])
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
    

    const handleChange = (event)=>{
    //   setValues({...values, [event.target.name]: event.target.value })
      setCode(event.target.value)
      
    }
    const createSubscription = async () => {
        const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
        const user = JSON.parse(d)
        let codeid = null;
        if(code !== null){
            for(let i = 0; i < codes.length; i++){
                if(codes[i].code === code){
                    codeid = codes[i].id;
                }
            }
        }
        if(codeid === null && code !== null){
            console.log("Invalid promo code")
            toast('Invalid Promo Code', {
              position: toast.POSITION.BOTTOM_CENTER,
              className: 'toast-message'
          })
        }
        else{
            console.log("User is " + user.userid)
        
          // process the payment using one of the cards or let user select the card
          console.log("Payment method added, now process the payment")
          const params = {userid: user.userid,
            plan: location.state.plan,
            apikey: "kinsal0349",
            payment_method: location.state.card.stripecardid,
            "promo_code": codeid,
          }
          console.log("Params ", params)
          const data = await axios.post("https://braverhospitalityapp.com/braver/api/create_subscription", params);
            console.log("data loaded")
            if(data.data.status === "1"){
                console.log(data.data); // this will have the whole response from the api with status, message and data
                // toast(`User logged in as ${data.data.data.user.name}`);
                
                navigate("/account", {
                  subscription: data.data.data,
                  replace: true,
                })
            }
            else{
                // toast.error("Error : " + data.data.message)
                console.log("Error " + data.data.message)
            }
        }
       
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
            <p className='text-white text-center fs-6'> Have a Promo Code?</p>
        </div>
        {/* <div className='col-2 btn' onClick={() => {
              // console.log("Add Card Button clicked")
              // addNewCard()
            }}>
              <button type='submit' onClick={()=> {
                console.log("Skip here")
              }}>SKIP</button>
        </div> */}
        
      </div>
        <form >
            <input className='inputuser' type='text' placeholder='Promo Code' name='code' onChange={e => handleChange(e)}></input>
            
        </form>
        <button  onClick={() => {
                createSubscription()
            }}>Continue</button>
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
  .continuebtn{
    background-color: #FFFFFF15;
    color: white;
    padding: 1rem;
    border: none;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    // width: 5rem;
    cursor: pointer;
    border-radius: 0.9rem;
    font-size: 1rem;
    // text-transform: uppercase;
    &:hover {
      background-color: #FFFFFF45;
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
  .skipbtn{
    color: white;
    // background-color: red;
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
`;


export default PromoCode; 