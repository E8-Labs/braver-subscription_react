import react, {useState, useEffect} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import styled from 'styled-components'
// import Logo from '../assets/logo.png'
// import AppIcon from '../assets/appicon.svg'
import axios from 'axios';

// import { ToastContainer, toast } from 'react-toastify';
  // import 'react-toastify/dist/ReactToastify.css';
// import { loginRoute } from '../utils/APIRoutes';


function Register(){
    const navigate = useNavigate();
  const [values, setValues] = useState({
    email: "",
    password: "",
  })
    const handleSubmit = async (event)=>{
      console.log("Callin api");
        event.preventDefault();
        const validation = handleValidation()
        // navigate("/prices")
      if(!validation){

      }
      else{
        const {email, password} = values;
        const data = await axios.post("http://braverhospitalityapp.com/braver/api/login", {
          email: email,
          password: password,
          apikey: "kinsal0349"
        });
        if(data.data.status === "1"){
            console.log(data.data); // this will have the whole response from the api with status, message and data
            // toast(`User logged in as ${data.data.data.user.name}`);
            localStorage.setItem(process.env.REACT_APP_LocalSavedUser, JSON.stringify(data.data.data));
            navigate("/prices")
        }
        else{
            // toast.error("Error : " + data.data.message)
            console.log("Error " + data.data.message)
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
    <FormContainer>
        <form onSubmit={(event)=>handleSubmit(event)}>
            <div className='brand'>
                {/* <img src={AppIcon} alt="Logo"/> */}
                <h1 className='fs-6'>Braver Hospitality</h1>
            </div>
            
            <input type='email' placeholder='Email' name='email' onChange={e => handleChange(e)}></input>
            <input type='password' placeholder='Password' name='password' onChange={e => handleChange(e)}></input>

            <button type='submit'>Login User</button>
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
  background-color: #131324;
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
    background-color: #00000076;
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


export default Register; 