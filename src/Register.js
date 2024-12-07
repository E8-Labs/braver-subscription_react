import react, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import styled from 'styled-components'
// import Logo from '../assets/logo.png'
// import AppIcon from '../assets/appicon.svg'
import axios from 'axios';
import { CircularProgress, Button } from '@mui/material';


// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { loginRoute } from '../utils/APIRoutes';


function Register() {
  const navigate = useNavigate();
  const params = useParams();
  //console.log("Params are ")
  //console.log(params.hash)
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);



  const handleSubmit = async (event) => {
    console.log("Callin api");
    console.log("Using Environment " + process.env.REACT_APP_ENVIRONMENT)
    event.preventDefault();
    const validation = handleValidation()
    // navigate("/prices")
    if (!validation) {
      setError("Enter valid credentials")
    }
    else {
      setLoading(true)
      const { email, password } = values;
      const data = await axios.post("https://braverhospitalityapp.com/braver/api/login", {
        email: email,
        password: password,
        apikey: "kinsal0349"
      });
      if (data.data.status === "1") {
        setLoading(false)
        //console.log(data.data); // this will have the whole response from the api with status, message and data
        // toast(`User logged in as ${data.data.data.user.name}`);
        localStorage.setItem(process.env.REACT_APP_LocalSavedUser, JSON.stringify(data.data.data));
        if (data.data.data.plan.status === "active" || data.data.data.plan.status === "trialing") {
          navigate("/account", {
            user: data.data.data
          })
        }
        else {
          navigate("/prices")
        }
      }
      else {
        // toast.error("Error : " + data.data.message)
        setError(data.data.message)
        setLoading(false)
        // console.log("Error " + data.data.message)
      }
    }
    // alert("form");

  }

  const authUserWithWebAccessCode = async () => {
    let code = params.hash;
    // const {code: code} = values;
    setAuthenticating(true)
    const data = await axios.post("https://braverhospitalityapp.com/braver/api/check_web_access_code", {
      code: code,
      apikey: "kinsal0349"
    });
    setAuthenticating(false)
    if (data.data.status === "1") {

      console.log(data.data); // this will have the whole response from the api with status, message and data
      // toast(`User logged in as ${data.data.data.user.name}`);
      localStorage.setItem(process.env.REACT_APP_LocalSavedUser, JSON.stringify(data.data.data));
      if (data.data.data.plan.status === "active" || data.data.data.plan.status === "trialing") {
        navigate("/account", {
          user: data.data.data
        })
      }
      else {
        navigate("/prices")
      }
    }
    else {
      // toast.error("Error : " + data.data.message)
      //console.log("Error " + data.data.message)
    }
  }

  const handleChange = (event) => {
    setError("")
    setValues({ ...values, [event.target.name]: event.target.value })

  }
  const handleValidation = () => {
    const { password, email } = values;
    console.log('values', values)

    if (!email || !password) {
      return false
    }
    return true;
  }

  useEffect(() => {
    //console.log("Params in UseEffect")
    //console.log(params.hash)
    authUserWithWebAccessCode()
  }, [])

  if (authenticating) {
    return (
      <div className='row' style={{
        width: '100vw', height: '100vh', justifyContent: 'center', alignItems: 'center',
        backgroundColor: '#06090F'
      }}>
        <div className='col-12' style={{
          height: '30vh', justifyContent: 'center', alignItems: 'center',
          backgroundColor: 'transparent'
        }}>
          <h2 className='text-white  text-center'>Authenticating...</h2>
          <label className='text-white text-center' style={{ width: '100vw' }}>Please wait</label>
        </div>
      </div>
    )
  }
  else {

  }

  return (
    <>
      <FormContainer>
        <form onSubmit={(event) => handleSubmit(event)}>
          <div className='brand'>
            {/* <img src={AppIcon} alt="Logo"/> */}
            <span className='label'>Enter your email and <br></br>password</span>
          </div>

          <input className='inputuser' type='email' placeholder='Email' name='email' onChange={e => handleChange(e)}></input>
          <input className='inputuser' type='password' placeholder='Password' name='password' onChange={e => handleChange(e)}></input>
          <div style={{ fontSize: 15, color: 'red', fontWeight: '400' }}>
            {error}
          </div>
          {loading ? (
            <CircularProgress style={{alignSelf:'flex-end'}} />
          ) : (
            <div className='btndiv'>
              <button type='submit'>Sign In</button>
            </div>
          )}
          {/* <span>Create an account <Link to="/register">Register</Link></span> */}
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
  background-color: #06090F;
  
  

  form {
    display: flex;
    flex-direction: column;
    justify-content: left;
    align-items: left;
    gap: 2rem;
    width: 85vw;
    background-color: #06090F;
    border-radius: 0rem;
    padding: 0rem 0rem;
    .brand {
      display: flex;
      align-items: left;
      gap: 1rem;
      justify-content: left;
      .label {
        font-size: 25px;
        color: white;
        
      }
    }
    .inputuser {
      background-color: #06090F;
      padding: 0.6rem;
      border: none;
      border-bottom: 0.1rem solid white;
     
      color: white;
      width: 100%;
      font-size: 1rem;
      &:focus {
        border-bottom: 0.1rem solid white;
        outline: none;
      }
    }
    .btndiv{
      display: flex;
      flex-direction: row;
      justify-content: end;
      align-items: end;
    }

    input:-webkit-autofill,
    input:-webkit-autofill:hover, 
    input:-webkit-autofill:focus, 
    input:-webkit-autofill:active{
      -webkit-box-shadow: 0 0 0 30px #06090F inset !important;
      -webkit-text-fill-color: white !important;
    }
  }
  
  button {
    background-color: #FFFFFF15;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 18px;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
  
`;


export default Register; 