import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

let envr = process.env.REACT_APP_ENVIRONMENT;

let stripeKey =
  envr === "Production"
    ? process.env.REACT_APP_STRIPE_SECRET_KEY_LIVE
    : process.env.REACT_APP_STRIPE_SECRET_KEY;

let LivePromoCodes = [
  {
    code: "BraverMonthOff70",
    id: process.env.REACT_APP_PROMO_BRAVEROFFMONTH70,
    type: "Monthly",
    discount: 70,
  },
  {
    code: "BraverMonthOff50",
    id: process.env.REACT_APP_PROMO_BRAVEROFFMONTH50,
    type: "Monthly",
    discount: 50,
  },
  {
    code: "BraverMonthOff40",
    id: process.env.REACT_APP_PROMO_BRAVEROFFMONTH40,
    type: "Monthly",
    discount: 40,
  },
  {
    code: "BraverMonthOff20",
    id: process.env.REACT_APP_PROMO_BRAVEROFFMONTH20,
    type: "Monthly",
    discount: 20,
  },
  {
    code: "BRAVEROFF100",
    id: process.env.REACT_APP_PROMO_BRAVEROFF100,
    type: "Monthly",
    discount: 100,
  },
  {
    code: "BraverYrOff60",
    id: process.env.REACT_APP_PROMO_BRAVEROFFYR60,
    type: "Yearly",
    discount: 60,
  },
  {
    code: "BraverYrOff50",
    id: process.env.REACT_APP_PROMO_BRAVEROFFYR50,
    type: "Yearly",
    discount: 50,
  },
  {
    code: "BraverYrOff40",
    id: process.env.REACT_APP_PROMO_BRAVEROFFYR40,
    type: "Yearly",
    discount: 40,
  },
  {
    code: "BraverYrOff20",
    id: process.env.REACT_APP_PROMO_BRAVEROFFYR20,
    type: "Yearly",
    discount: 20,
  },
  {
    code: "BRAVEROFF100",
    id: process.env.REACT_APP_PROMO_BRAVEROFF100,
    type: "Yearly",
    discount: 100,
  },
];

let promosArray =
  envr === "Production"
    ? LivePromoCodes
    : [
        { code: "Braver23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV },
        { code: "BraverLife", id: process.env.REACT_APP_PROMO_BRAVERLIFE_DEV },
        { code: "BraverYr23", id: process.env.REACT_APP_PROMO_BRAVER23_DEV },
      ];

function PromoCode(props) {
  const navigate = useNavigate();
  const [code, setCode] = useState("");
  const [amount, setAmount] = useState(0);
  const [codeValid, setCodeValid] = useState(false);
  const [codes] = useState(promosArray);
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [validatingCode, setValidatingCode] = useState(false);
  const [actBtn, setActBtn] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (code) {
        checkPromoCode(code);
      }
    }, 500); // 1-second debounce

    return () => clearTimeout(timer); // Clear the timeout if code changes before 1 second
  }, [code]);

  const checkPromoCode = async (code) => {
    if (!code) {
      return;
    }
    let params = {
      apikey: "kinsal0349",
      coupon_code: code,
    };
    console.log("Trying to validate promo code");
    setValidatingCode(true);

    try {
      const response = await axios.post(
        "https://braverhospitalityapp.com/braver/api/validate_coupon",
        params
      );
      console.log("Promo code validation status:", response.data.status);
      setValidatingCode(false);
      if (response.data.status == "1") {
        setError("");
        handleDiscount(response.data.coupon);
        setCodeValid(true);
        // Clear any previous errors
      } else {
        setError("Invalid promo code");
        setCodeValid(false);
        setAmount(0); // Reset amount on invalid code
      }
    } catch (error) {
      setCodeValid(false);
      console.error("Error validating promo code:", error);
      setError("Error validating promo code");
    }
  };

  const handleDiscount = (code) => {
    let codeid = null;
    let discountAmount = 0;
    // if (code !== null) {
    //   for (let i = 0; i < codes.length; i++) {
    //     console.log(`Matching Plan ${location.state.plan.type} with Code ${codes[i].code} : ${codes[i].type}`);
    //     if (codes[i].code === code && codes[i].type === location.state.plan.type) {
    //       codeid = codes[i].id;
    //       let d = codes[i].discount;
    //       let planPrice = location.state.plan.price;// === "Monthly" ? 700 : 5000;
    //       discountAmount = planPrice - (planPrice / 100 * d);
    //       console.log("Discounted Price is ", discountAmount);
    //       setActBtn(true)
    //       setAmount(discountAmount);
    //     }
    //   }
    // } else {
    //   console.log('code is null in handle function')
    // }
    let planPrice = location.state.plan.price; // === "Monthly" ? 700 : 5000;
    if (code.percent_off) {
      discountAmount = planPrice - (planPrice / 100) * code.percent_off;
    } else if (code.amount_off && code.amount_off < planPrice) {
      discountAmount = planPrice - code.amount_off;
    }
    console.log("Discounted Price is ", discountAmount);
    setActBtn(true);
    setAmount(discountAmount);
  };

  const createSubscription = async () => {
    // if (!actBtn) {
    //   console.log("Not act btn");
    //   return;
    // }

    if (loading) {
      toast.error("Please wait a moment...");
      return;
    }
    const user = JSON.parse(
      localStorage.getItem(process.env.REACT_APP_LocalSavedUser)
    );
    console.log("User is ", user);
    if (user.accountstatus == "Pending") {
      //call the update api
      const params = {
        userid: user.userid,
        subscription_plan: location.state.plan.id,
        apikey: "kinsal0349",
        promo_code: code,
      };
      try {
        const data = await axios.post(
          "https://braverhospitalityapp.com/braver/api/updateuser",
          params
        );
        setLoading(false);
        if (data.data.status === "1") {
          // navigate("/account", {
          //   subscription: data.data.data,
          //   replace: true,
          //   plan: location.state.plan,
          // });
          //take the user back to the app
          navigate("/review");
        } else {
          toast.error("Error: " + data.data.message);
        }
      } catch (error) {
        setLoading(false);
        toast.error("Error setting up payment");
      }
    } else {
      console.log("Promo code ", code);
      if ((code == null && code == "") || !codeValid) {
        //if(codeid === null && (code !== null && code !== "")){
        // if (!codeid && code !== "") {
        toast("Invalid Promo Code", {
          position: toast.POSITION.BOTTOM_CENTER,
          className: "toast-message",
        });
      } else {
        setLoading(true);
        const params = {
          userid: user.userid,
          plan: location.state.plan.id,
          apikey: "kinsal0349",
          payment_method: location.state.card
            ? location.state.card.stripecardid
            : null,
          promo_code: code,
        };
        try {
          const data = await axios.post(
            "https://braverhospitalityapp.com/braver/api/create_subscription",
            params
          );
          setLoading(false);
          if (data.data.status === "1") {
            navigate("/account", {
              subscription: data.data.data,
              replace: true,
              plan: location.state.plan,
            });
          } else {
            toast.error("Error: " + data.data.message);
          }
        } catch (error) {
          setLoading(false);
          toast.error("Error creating subscription");
        }
      }
    }
    // return
    // let codeid = null;
    // if (code !== "") {
    //   for (let i = 0; i < codes.length; i++) {
    //     if (codes[i].code === code && codes[i].type === location.state.plan.type) {
    //       codeid = codes[i].id;
    //     }
    //   }
    // }
  };

  return (
    <FormContainer>
      <div className="row headingrow p-2">
        <div className="col-2 btn" onClick={() => navigate(-1)}>
          <img className="backbtn" src="/backarrow.png" alt="Back" />
        </div>
        <div className="col centertitlediv">
          <p className="text-white text-center fs-6"> Have a Promo Code?</p>
        </div>
        <div className="col-2 btn">
          <button
            className="continuebtn"
            type="submit"
            onClick={createSubscription}
          >
            SKIP
          </button>
        </div>
      </div>
      <form>
        <input
          className="inputuser"
          type="text"
          placeholder="Promo Code"
          name="code"
          onChange={(e) => {
            setCode(e.target.value);
            setError("");
          }}
        />
        <div className="row">
          <div className="col-1"></div>
          <label className="disclaimer">
            {codeValid ? "Total amount: $" + amount : ""}
          </label>
          <label className="disclaimer">
            {validatingCode ? "Validating promo code... " : ""}
          </label>
          <label className="error">{error}</label>
          <div className="col-1"></div>
        </div>
      </form>
      {!loading ? (
        <button className="continuebtn" onClick={createSubscription}>
          Continue
        </button>
      ) : (
        <div
          style={{
            justifyContent: "center",
            alignItems: "center",
            width: "100vw",
            backgroundColor: "transparent",
            display: "flex",
          }}
        >
          <label style={{ color: "white" }}>Subscribing...</label>
        </div>
      )}
      <ToastContainer />
    </FormContainer>
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
  background-color: #06090f;

  .disclaimer {
    color: white;
    text-align: center;
  }
  .error {
    color: red;
    text-align: center;
  }
  .headingrow {
    padding-top: 1rem;
    justify-content: space-between;
    align-items: center;
    background-color: transparent;
    width: 100vw;
    .btn {
      display: flex;
      flex-direction: row;
      justify-content: center;
      align-items: center;
    }
    .backbtn {
      width: 15vw;
    }
    .centertitlediv {
      align-items: center;
      justify-content: center;
      background-color: transparent;
    }
  }
  form {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100vw;
    gap: 2rem;
    border-radius: 2rem;
    padding: 1rem 1rem;
    .inputuser {
      background-color: #06090f;
      padding: 0.6rem;
      border: none;
      border-bottom: 0.1rem solid white;
      color: white;
      font-size: 1rem;
      &:focus {
        border-bottom: 0.1rem solid white;
        outline: none;
      }
    }
  }
  .continuebtn {
    background-color: #ffffff15;
    color: white;
    padding: 1rem;
    border: none;
    justify-content: center;
    align-items: center;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.9rem;
    font-size: 1rem;
    &:hover {
      background-color: #ffffff45;
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

export default PromoCode;
