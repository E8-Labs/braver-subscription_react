import react, {useState, useEffect} from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import styled from 'styled-components'
import {ElementsConsumer, PaymentElement} from '@stripe/react-stripe-js';
import Stripe from 'stripe'
// import {Stripe} from '@stripe/react-stripe-js';
// import Logo from '../assets/logo.png'
// import AppIcon from '../assets/appicon.svg'
import axios from 'axios';

// import { ToastContainer, toast } from 'react-toastify';
  // import 'react-toastify/dist/ReactToastify.css';
// import { loginRoute } from '../utils/APIRoutes';


function AddCard(props){
    const navigate = useNavigate();
    const location = useLocation()
    const stripe = Stripe('sk_test_51JfmvpC2y2Wr4Becgv8amGZMeUsm1Y9CgJTeJVcX7fCxWdeIHXh0tLmxewFN1d71uSZKxCpQIwkdmS0QG2c8Vdw600KxxN1UwK');
  const [values, setValues] = useState({
    cardnumber: "",
    cardholdername: "",
    cvv: "",
    expirydate: ""
  })

  
    const handleSubmit = async (event)=>{
      console.log("Callin api");
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


        const tok = await stripe.tokens.create({
            card: {
              number: cardnumber,
              exp_month: 8,
              exp_year: 2024,
              cvc: cvv,
            },
          });

            console.log("Creating token")
             console.log(tok)
            if(tok){
                if(tok.id){
                    console.log("Token obtained " + tok.id)
                    const data = await axios.post("http://braverhospitalityapp.com/braver/api/addcard", {
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
                        props.closePopup()
                        // navigate("/")
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
    <>
    //onClick={()=>props.closePopup()}
    <FormContainer >
        <form >
            <div className='brand'>
                {/* <img src={AppIcon} alt="Logo"/> */}
                <h1 className='fs-6'>Add Card</h1>
            </div>
            
            <input type='text' placeholder='Card Number' name='cardnumber' onChange={e => handleChange(e)}></input>
            <input type='text' placeholder='Card Holder Name' name='cardholdername' onChange={e => handleChange(e)}></input>
            <input type='text' placeholder='CVV' name='cvv' onChange={e => handleChange(e)}></input>
            <input type='text' placeholder='Expiry Date' name='expirydate' onChange={e => handleChange(e)}></input>
            <button type='submit' onClick={handleSubmit}>Add Card</button>
        </form>
    </FormContainer>
    {/* <ToastContainer /> */}
    </>
    );
}

const FormContainer = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  justify-content: center; // vertical center
  gap: 1rem;
  align-items: center; //horizontal center
  background-color: transparent;
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
    // align-items: center;
    gap: 2rem;
    background-color: #000000;
    border-radius: 2rem;
    padding: 3rem 5rem;
  }
  input {
    background-color: transparent;
    padding: 1rem;
    border: 0.1rem solid #4e0eff;
    border-radius: 0.4rem;
    color: white;
    width: 100%;
    font-size: 1rem;
    &:focus {
      border: 0.1rem solid #997af0;
      outline: none;
    }
  }
  button {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
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