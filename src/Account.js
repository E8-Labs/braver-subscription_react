import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import { styled } from 'styled-components';
import { Alert } from 'bootstrap/dist/js/bootstrap.bundle';

import {ToastContainer, toast} from 'react-toastify';
// Import toastify css file
import 'react-toastify/dist/ReactToastify.css';

const AccountSubscription = ({subscription}) => {
  return (
    <section>
      <hr />
      <h4>
        <a href={`https://dashboard.stripe.com/test/subscriptions/${subscription.id}`}>
          {subscription.id}
        </a>
      </h4>

      <p>
        Status: {subscription.status}
      </p>

      <p>
        Card last4: {subscription.default_payment_method?.card?.last4}
      </p>

      <p>
        Current period end: {(new Date(subscription.current_period_end * 1000).toString())}
      </p>

      {/* <Link to={{pathname: '/change-plan', state: {subscription: subscription.id }}}>Change plan</Link><br /> */}
      <Link to={{pathname: '/cancel', state: {subscription: subscription.id }}}>Cancel</Link>
    </section>
  )
}

const Account = (props) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserDetails = async(user) =>{
      
      const url = `http://braverhospitalityapp.com/braver/api/getuserbyid?userid=${user.userid}&apikey=${process.env.REACT_APP_API_KEY}`
      const data = await axios.get(url)
      if(data.data.status === "1"){
        console.log(data.data);
        setUser(data.data.data)
        console.log("User data obtained from server " + data.data.data.name)
        // navigate("/")
      }
      else{
        console.log( data.data)
        console.log("Error " + JSON.stringify(data.data.validation_errors))
      }
      console.log("Loading User")
    }
    console.log("Print User")
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    setUser(user)
    loadUserDetails(user)
    console.log(user)
  }, []);

  
  const logout = (event)=>{
    console.log("Logout here")
  }

  const cancelSubscription = async(event) => {
    console.log("Cancel subscription here")
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    setUser(user)
    console.log("User is " + user.userid)
    
      // Cancel subscription api call
      const params = {userid: user.userid,
        apikey: "kinsal0349",
      }
      console.log("Params ", params)

      try{
        const data = await axios.post("https://braverhospitalityapp.com/braver/api/cancel_subscription", params);
        console.log("data loaded")
        console.log(data.data);// this will have the whole response from the api with status, message and data
        // toast(`User logged in as ${data.data.data.user.name}`);
        if(data.data.status === "1"){
            console.log(data.data.data); 
            
            navigate("/", {
              replace: true,
            })
        }
        else{
            // toast.error("Error : " + data.data.message)
            // Alert.alert("Error : ", data.data.message)
            console.log("Error " + data.data.message)
        }
      }
      catch(error){
        console.log("Exception ", error)
      }
    
  }


  //change apis to accept th payment method
  const upgradeSubscription = async () => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d)
    setUser(user)
    console.log("User is " + user.userid)
    
      // process the payment using one of the cards or let user select the card
      console.log("Payment method added, now process the payment")
      const params = {userid: user.userid,
        plan: process.env.REACT_APP_ENVIRONMENT === "Production" ? process.env.REACT_APP_YEARLY_PLAN_LIVE : process.env.REACT_APP_6MONTHLY_PLAN,//process.env.REACT_APP_6MONTHLY_PLAN,
        apikey: "kinsal0349",
      }
      console.log("Params ", params)
      const data = await axios.post("https://braverhospitalityapp.com/braver/api/upgrade_subscription", params);
        console.log("data loaded")
        if(data.data.status === "1"){
            console.log(data.data); // this will have the whole response from the api with status, message and data
            // toast(`User logged in as ${data.data.data.user.name}`);
            
            // navigate("/account", {
            //   subscription: data.data.data
            // })
            
            toast.warn(data.data.message, {
              position: "bottom-right",
              pauseOnHover: true,
              autoClose: 8000,
              theme: "dark"
            });
        }
        else{
            // toast.error("Error : " + data.data.message)
            console.log("Error " + data.data.message)
        }
    
  }


  if(user === null){
    return (
      <div>

      </div>
    )
  }

  return (
    <Container className='container-fluid bg-image '>
        <div className='row titlerow'>
          <div className='col'>
            <h1 className='text-white'>Welcome! {user.name}</h1>
          </div>
          <div className='col-auto ms-auto'>
            <button onClick={logout}>Logout</button>
          </div>
        </div>
        <div className='row secondrow justify-content-center mt-5'>
              <div className='col-12 d-flex justify-content-center align-items-center'>
                  <h3 className='text-white'>Active plan</h3>
              </div>
                <div className="price-container col-md-4 mt-5" >
                    <h3  className='text-white'>{user.plan.plan} Plan</h3>
                    <p className='text-white fs-6 description' ><strong>Status:</strong> {user.plan.status === "active" ? "Active" : "Trial"}</p>
                  
                    <div className='row'>
                        <div className='col-sm-6'>
                            <p className='description text-white'>
                              <strong>Price:</strong> {user.plan.plan === "Yearly" ? " USD 2000 / year" : "USD 200 / month"}
                            </p>
                        </div>
                    </div>
                    <p className='descriptiontext text-white'>This plan gives you full access to all resources for {user.plan.plan === "Yearly" ? " a year" : " a month"}</p>

                    <div className='col-auto ms-auto d-flex align-items-center justify-content-end'>
                          <button onClick={cancelSubscription}>Cancel Subscription</button>
                    </div>
              

                </div>

        </div>
      {/*  if monthly plan then show upgrade option here  */}
      {
        user.plan.plan === "Monthly" &&(
          <div className='col-auto my-5 d-flex align-items-center justify-content-center'>
                          <button className='upgradebtn' onClick={upgradeSubscription}>Upgrade</button>
          </div>
        )
      }
    <ToastContainer />
    </Container>
  );
}

const Container = styled.div`
width: 100vw;
height: 100vh;
padding: 1rem;
.titlerow{
  background-color: transparent;
  height: 3rem;
}
.secondrow{
  .status{
    font-size: 2rem;
    font-weight: bold;
  }
}
.upgradebtn{
  background-color: transparent;
  font-weight: bold;
  font-size: 1.5rem;
}

.price-container{
  // z-index: 1;
  // width: 15rem;
  border: white solid 0.1rem;
  // border-width: 1rem;
  padding: 1rem;
  border-radius: 0.3rem;
  .descriptiontext{
    font-size: 12;
    color: white;
  }
}
`;

export default Account;
