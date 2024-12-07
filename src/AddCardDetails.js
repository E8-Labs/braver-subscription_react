import React, { useEffect, useRef, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
  CardCvcElement,
  CardExpiryElement,
  CardNumberElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
// import { CardPostalCodeElement } from '@stripe/react-stripe-js';
import {
  Alert,
  Button,
  CircularProgress,
  Fade,
  Slide,
  Snackbar,
} from "@mui/material";
import { toast } from "react-toastify";
import axios from "axios";
// import Apis from '@/components/apis/Apis';
// import Apis from '../Apis/Apis';

const AddCardDetails = ({
  subscribePlan,
  fromBuildAiScreen = false,
  closeForm,
  selectedPlan,
  subscribeLoader,
  fromMYPlansScreen,
  closeAddCardPopup,
  onTokenCreated,
}) => {
  const [addCardLoader, setAddCardLoader] = useState(false);
  const [addNumberErr, setAddNumberErr] = useState(false);
  const [addDateErr, setAddDateErr] = useState(false);
  const [cvcErr, setCvcErr] = useState(false);
  const [credentialsErr, setCredentialsErr] = useState(false);
  const [addCardSuccess, setAddCardSuccess] = useState(false);
  const [addCardFailure, setAddCardFailure] = useState(false);
  const [addCardDetails, setAddCardDetails] = useState(null);
  const [addCardErrtxt, setAddCardErrtxt] = useState(null);
  const [isWideScreen, setIsWideScreen] = useState(false);
  const cardNumberRef = useRef(null);
  const cardExpiryRef = useRef(null);
  const cardCvcRef = useRef(null);

  const stripeReact = useStripe();
  const elements = useElements();
  //console.log("From Build AI Screen ", fromBuildAiScreen)
  //console.log("From Build AI Screen Selected Plan", selectedPlan)

  const handleBackClick = (e) => {
    e.preventDefault();
    // handleBack();
  };

  // const [hell,ejej] =useState()

  // Autofocus the first field when the component mounts
  useEffect(() => {
    console.log("Trying to focus check 2");
    if (cardNumberRef.current) {
      console.log("Trying to focus check 1");
      cardNumberRef.current.focus();
    }
  }, []);

  // Handle field change to focus on the next input
  const handleFieldChange = (event, ref) => {
    if (event.complete && ref.current) {
      ref.current.focus();
    }
  };
  // const [selectedUserPlan, setSelectedUserPlan] = useState(null);

  //code for wide screen
  useEffect(() => {
    const handleResize = () => {
      // Check if width is greater than or equal to 1024px
      setIsWideScreen(window.innerWidth >= 500);

      // setIsWideScreen2(window.innerWidth >= 500);
      // Check if height is greater than or equal to 1024px
      // setIsHighScreen(window.innerHeight >= 640);

      // Log the updated state values for debugging (Optional)
      console.log("isWideScreen: ", window.innerWidth >= 500);
    };

    handleResize(); // Set initial state
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const elementOptions = {
    style: {
      base: {
        backgroundColor: "transparent",
        color: "#000000",
        fontSize: "18px",
        lineHeight: "40px",
        borderRadius: 10,
        padding: 10,
        "::placeholder": {
          color: "#00000050",
        },
      },
      invalid: {
        color: "red",
      },
    },
  };

  //code for adding card api

  // useEffect(()=>{
  // console.log("Selected Plan changed", selectedPlan)
  // }, [selectedPlan])

  useEffect(() => {
    // const localData = localStorage.getItem('fromBuildScreen');
    // const Data = JSON.parse(localData);
    // //console.log("Data recieved from build screen", Data);
    // setfromBuildAiScreen(Data);

    const handleCustomEvent = (event) => {
      console.log("Received event:", event.detail.message);
      handleAddCard();
      // subscribePlan();
    };

    window.addEventListener("subscribePlan", handleCustomEvent);

    // Cleanup listener on component unmount
    return () => {
      window.removeEventListener("subscribePlan", handleCustomEvent);
    };
  }, []);

  if (!stripeReact || !elements) {
    //console.log("Stripe error here");
    //console.log("Stripe error ", stripeReact)
    //console.log("Stripe error 2 ", elements)
    return <div>Loading stripe</div>;
  } else {
    //console.log("No stripe err");
  }

  // useEffect(() => {})
  //console.log("Sending back plan ", selectedPlan)
  // let selPlan = null;

  const handleAddCard = async (e) => {
    if (!fromBuildAiScreen) {
      setAddCardLoader(true);
    }

    // if (stop) {
    //     stop(false);
    // }

    // return
    if (e && e.preventDefault) {
      e.preventDefault();
    }

    // Close the modal
    // handleClose4(e);
    // return
    if (!stripeReact || !elements) {
      console.error("Stripe or elements not initialized");
      return;
    } else {
      //console.log("No stripe err");
    }

    const cardNumberElement = elements.getElement(CardNumberElement);

    stripeReact.createToken(cardNumberElement).then(async function (tok) {
      if (tok.error) {
        setCredentialsErr(true);
        if (fromBuildAiScreen) {
          console.log("reached end");
          subscribeLoader(false);
        }
        toast.error(tok.error.code, {
          position: "bottom-right",
          pauseOnHover: true,
          autoClose: 8000,
          theme: "dark",
        });
      } else if (tok.token.id) {
        // if (handleSubLoader) {
        // handleSubLoader(true);
        // }
        // return
        console.log("Token generating for card number :", tok.token.id);
        const tokenId = tok.token.id;
        console.log("card number :");
        const localAssistanData = localStorage.getItem("assistantData");
        let modelId = null;
        if (localAssistanData) {
          const asistantLocalData = JSON.parse(localAssistanData);
          console.log("Assistant data retrived", asistantLocalData);
          if (fromMYPlansScreen) {
            console.log("Adding new card");
            modelId = null;
          } else {
            modelId = asistantLocalData.id;
          }

          if (onTokenCreated) {
            onTokenCreated(tok.token);
          }
        } else {
          modelId = null;
        }

        const ApiPath = "Apis.addCard";
        const AddCardData = {
          source: tokenId,
          modelId: modelId,
        };
        console.log("Data for card number :", AddCardData);
        try {
          const LocalData = localStorage.getItem("User");
          const D = JSON.parse(LocalData);
          console.log("Local data is", D);
          const AuthToken = D.data.token;
          // const AuthToken = "bgabgakjhaslidfhgkerhiuhkmxvnidfuhgiehlmklhn";
          console.log("Token for add card ", D.data.token);

          console.log("Data sending in api is :", AddCardData);
          // return
          const fromBuyStatus = localStorage.getItem("fromBuyScreen");
          console.log("Data of fromBuyscreen", JSON.parse(fromBuyStatus));
          let newTab = null;
          if (fromBuyStatus) {
            newTab = window.open("about:blank"); // Open a new blank tab
          }
          const response = await axios.post(ApiPath, AddCardData, {
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + AuthToken,
            },
          });
          if (response) {
            console.log("Response of add card api is", response.data);
          }
          if (response.status === 200) {
            // setAddCardDetails(response.data.message);
            if (response.data.status === false) {
              setAddCardFailure(true);
              setAddCardErrtxt(response.data.message);
              return;
            } else if (response.data.status === true) {
              //console.log("Here in subscribe plan else", fromBuildAiScreen)
              setAddCardSuccess(true);
              const callStatus = {
                callStatus: true,
              };
              //console.log("Testing build screen data",);

              if (fromBuildAiScreen) {
                //console.log("plan sending in api ", selectedUserPlan)
                subscribePlan();
              } else {
                //console.log("No build screen data", fromBuildAiScreen)
              }
              if (closeForm) {
                //
                console.log(
                  "Response of add card api is ::::",
                  response.data.data
                );
                //data for buy status
                if (fromBuyStatus) {
                  const Data = JSON.parse(fromBuyStatus);
                  window.open(`/buyproduct/${Data.id}`, "_blank");
                  newTab.location.href = `/buyproduct/${Data.id}`;
                  closeForm();
                  window.location.reload();
                } else {
                  localStorage.setItem(
                    "callStatus",
                    JSON.stringify(callStatus)
                  );
                  closeForm();
                  window.location.reload();
                }
                // D.data.user.payment_added = true;
                // localStorage.setItem('User', JSON.stringify(D));
                // return
              } else if (closeAddCardPopup) {
                closeAddCardPopup(false);
              }
            }
          } else {
            setAddCardFailure(true);
            setAddCardErrtxt("Some error occured !!!");
          }
        } catch (error) {
          console.error("Error occured in adding user card api is :", error);
        } finally {
          setAddCardLoader(false);
          if (fromBuildAiScreen) {
            console.log("reached end");
            subscribeLoader(false);
          }
        }
      }
    });
  };

  //code to add card from subscription screen
  // //console.log("status on subscribe", handleSubscribePlan);
  // if (handleSubscribePlan === true) {
  // handleAddCard();
  // }

  // const subscribePlan = async () => {
  // console.log("Subscribing user plan ", selectedPlan)
  // try {
  // const localData = localStorage.getItem('User');
  // const data = JSON.parse(localData);
  // //console.log("Local data for subscibe plan", data.data.token);

  // const AuthToken = data.data.token;
  // //console.log("Auth token is", AuthToken);
  // const ApiPath = Apis.CreateSubscription;
  // //console.log("Api path for subscribe pla :", ApiPath);
  // // //console.log("Subscribing plan", )
  // // let plan = null;
  // // if (selectedPlan) {
  // // plan = selectedPlan
  // // }
  // const dataToSend = {
  // sub_type: selectedPlan
  // }
  // console.log("Data sending in api", dataToSend);
  // return
  // const response = await axios.post(ApiPath, dataToSend, {
  // headers: {
  // "Authorization": "Bearer " + AuthToken,
  // "Content-Type": "application/json"
  // }
  // });
  // // return
  // if (response) {
  // //console.log("Response of subscribe plan api is", response.data);
  // if (response.data.status === true) {
  // localStorage.removeItem("fromBuildScreen");
  // // handleSubLoader(false);
  // handleContinue();
  // }
  // } else {
  // //console.log("api not responded");
  // }
  // } catch (error) {
  // console.error("ERROR occured in subscribePlan Api", error);

  // }
  // finally {
  // // handleSubLoader(false);
  // }
  // }

  return (
    <div style={{ width: "100%", height: "100svh" }}>
      <div
        style={{
          fontSize: isWideScreen ? 18 : 24,
          fontWeight: "600",
          color: "white",
        }}
      >
        Add Payment Method
      </div>

      <div style={{ marginTop: "2rem" }}>
        <div
          style={{
            fontWeight: "400",
            fontSize: 13,
            color: "#fff",
            marginTop: "2rem",
          }}
        >
          Card Number
        </div>
        <div
          className="mt-2 px-3 py-1"
          style={{ backgroundColor: "#EDEDEDC7", borderRadius: "8px" }}
        >
          <CardNumberElement
            options={elementOptions}
            autoFocus={true}
            onChange={(event) => handleFieldChange(event, cardExpiryRef)}
            ref={cardNumberRef}
            onReady={(element) => {
              cardNumberRef.current = element;
              cardNumberRef.current.focus();
            }}
          />
        </div>
      </div>
      <div className="flex flex-row gap-2 w-full mt-8">
        <div className="w-6/12">
          <div
            style={{
              fontWeight: "400",
              fontSize: 13,
              color: "#fff",
              marginTop: "2rem",
            }}
          >
            Exp
          </div>
          <div
            className="mt-2 px-3 py-1"
            style={{ backgroundColor: "#EDEDEDC7", borderRadius: "8px" }}
          >
            <CardExpiryElement
              options={elementOptions}
              style={{
                width: "100%",
                padding: "8px",
                color: "white",
                fontSize: "22px",
                border: "1px solid blue",
                borderRadius: "4px",
              }}
              onChange={(event) => handleFieldChange(event, cardCvcRef)}
              ref={cardExpiryRef}
              onReady={(element) => {
                cardExpiryRef.current = element;
              }}
            />
          </div>
        </div>
        <div className="w-6/12">
          <div
            style={{
              fontWeight: "400",
              fontSize: 13,
              color: "#fff",
              marginTop: "2rem",
            }}
          >
            CVC
          </div>
          <div
            className="mt-2 px-3 py-1"
            style={{ backgroundColor: "#EDEDEDC7", borderRadius: "8px" }}
          >
            <CardCvcElement
              options={elementOptions}
              style={{
                width: "100%",
                padding: "8px",
                color: "white",
                fontSize: "22px",
                border: "1px solid blue",
                borderRadius: "4px",
              }}
              ref={cardCvcRef}
              onReady={(element) => {
                cardCvcRef.current = element;
              }}
            />
          </div>
        </div>
      </div>
      {/* <CardPostalCodeElement id="postal-code" options={elementOptions} /> */}

      <div>
        <Snackbar
          open={credentialsErr}
          autoHideDuration={3000}
          onClose={() => {
            setCredentialsErr(false);
            setAddCardLoader(false);
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={Fade}
          TransitionProps={{
            direction: "center",
          }}
        >
          <Alert
            onClose={() => {
              setCredentialsErr(false);
              setAddCardLoader(false);
            }}
            severity="error"
            sx={{
              width: "auto",
              fontWeight: "700",
              fontFamily: "inter",
              fontSize: "22",
            }}
          >
            Add a payment source to continue
          </Alert>
        </Snackbar>
      </div>
      <div>
        <Snackbar
          open={addCardFailure}
          // autoHideDuration={3000}
          onClose={() => {
            setAddCardFailure(false);
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={Fade}
          TransitionProps={{
            direction: "center",
          }}
        >
          <Alert
            onClose={() => {
              setAddCardFailure(false);
            }}
            severity="error"
            sx={{
              width: "auto",
              fontWeight: "700",
              fontFamily: "inter",
              fontSize: "22",
            }}
          >
            {/* {addCardDetails} */}
            {/* Card not added */}
            {addCardErrtxt}
          </Alert>
        </Snackbar>
      </div>
      <div>
        <Snackbar
          open={addCardSuccess}
          // autoHideDuration={3000}
          onClose={() => {
            setAddCardSuccess(false);
          }}
          anchorOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
          TransitionComponent={Fade}
          TransitionProps={{
            direction: "center",
          }}
        >
          <Alert
            onClose={() => {
              setAddCardSuccess(false);
            }}
            severity="success"
            sx={{
              width: "auto",
              fontWeight: "700",
              fontFamily: "inter",
              fontSize: "22",
            }}
          >
            {/* {addCardDetails} */}
            Card added successfully
          </Alert>
        </Snackbar>
      </div>
    </div>
  );
};

export default AddCardDetails;
