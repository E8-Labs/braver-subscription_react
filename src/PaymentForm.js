import React, { useState } from 'react';
import styled from 'styled-components'
import './App.css';
import Account from './Account';
import { PaymentElement, 
  CardElement, useStripe, useElements} from '@stripe/react-stripe-js';

const PaymentForm = () => {
    const stripe = useStripe();
    const elements = useElements();
  
    const [errorMessage, setErrorMessage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const {error: submitError} = await elements.submit();
    if (submitError) {
      // Show error to your customer
      setErrorMessage(submitError.message);
      return;
    }

    let card = elements.getElement("card");
    //console.log("Card", card)

    
  };

  return(
    
    <FormContainer>
    <form className='row form ' id='paymentform' onSubmit={handleSubmit}>
        <div className='col-12 cardelement'>
            <CardElement />
            
        </div>

        <div className='col-12'>
            <button>Pay</button>
        </div>
    </form>
    </FormContainer>
  )
  
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
.cardelement{
    height: 10vh;
    margin-top: 4rem;
    padding: 2rem;
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


export default PaymentForm;