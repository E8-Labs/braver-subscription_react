import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import styled from "styled-components";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Account = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUserDetails = async (user) => {
      const url = `https://braverhospitalityapp.com/braver/api/getuserbyid?userid=${user.userid}&apikey=${process.env.REACT_APP_API_KEY}`;
      const data = await axios.get(url);
      if (data.data.status === "1") {
        setUser(data.data.data);
      }
    };
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d);
    setUser(user);
    loadUserDetails(user);
  }, []);

  const logout = () => {
    localStorage.clear(process.env.REACT_APP_LocalSavedUser);
    navigate("/register");
  };

  const cancelSubscription = async () => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d);

    const params = { userid: user.userid, apikey: "kinsal0349" };
    try {
      const data = await axios.post(
        "https://braverhospitalityapp.com/braver/api/cancel_subscription",
        params
      );
      if (data.data.status === "1") {
        navigate("/prices", { replace: true });
      } else {
        toast.error(data.data.message);
      }
    } catch (error) {
      toast.error("Failed to cancel subscription");
    }
  };

  const upgradeSubscription = async () => {
    const d = localStorage.getItem(process.env.REACT_APP_LocalSavedUser);
    const user = JSON.parse(d);

    const params = {
      userid: user.userid,
      plan:
        process.env.REACT_APP_ENVIRONMENT === "Production"
          ? process.env.REACT_APP_YEARLY_PLAN_LIVE
          : process.env.REACT_APP_6MONTHLY_PLAN,
      apikey: "kinsal0349",
    };

    const data = await axios.post(
      "https://braverhospitalityapp.com/braver/api/upgrade_subscription",
      params
    );

    if (data.data.status === "1") {
      toast.success("Subscription upgraded successfully!", {
        position: "bottom-right",
        autoClose: 8000,
      });
    } else {
      toast.error(data.data.message);
    }
  };

  if (user === null) {
    return <div>Loading...</div>;
  }

  return (
    <StyledContainer>
      <div className="header">
        <h1>Welcome, {user.name}</h1>
        <button className="logout-btn" onClick={logout}>
          Logout
        </button>
      </div>

      <div className="content">
        <h2>Active Plan</h2>
        <div className="plan-details">
          <div className="plan-header">
            <h3>{user.plan.plan} Plan</h3>
            <p className={`status ${user.plan.status}`}>
              {user.plan.status === "active" ? "Active" : "Trial"}
            </p>
          </div>

          <div className="plan-info">
            <p>
              <strong>Price:</strong> ${user.plan.amount}
            </p>
            <p>
              <strong>Discount Code:</strong> {user.plan.coupon_name}
            </p>
            <p>
              <strong>Discounted Price:</strong> ${user.plan.net_amount}
            </p>
            <p>
              <strong>Billing Cycle:</strong> {user.plan.interval}
            </p>
          </div>

          <p>
            This plan gives you full access to all resources through a{" "}
            {user.plan.interval} subscription.
          </p>
          <div className="actions">
            <button className="cancel-btn" onClick={cancelSubscription}>
              Cancel Subscription
            </button>
            {user.plan.plan === "Monthly" && (
              <button className="upgrade-btn" onClick={upgradeSubscription}>
                Upgrade
              </button>
            )}
          </div>
        </div>
      </div>

      <ToastContainer />
    </StyledContainer>
  );
};

const StyledContainer = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #06090f; /* Updated background color */
  padding: 2rem;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem 2rem;
    background: #333;
    color: #fff;

    h1 {
      font-size: 1.4rem; /* Reduced size to keep on one line */
      font-weight: 600;
      margin: 0;
    }

    .logout-btn {
      background: #ff5c5c;
      color: #fff;
      padding: 0.5rem 1.2rem;
      border: none;
      cursor: pointer;
      border-radius: 5px;
      transition: background 0.3s ease;

      &:hover {
        background: #ff3333;
      }
    }
  }

  .content {
    max-width: 800px;
    margin: 2rem auto;
    background: #fff;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 1.6rem;
      font-weight: 500;
      margin-bottom: 1rem;
    }

    .plan-details {
      padding: 1.5rem;
      background: #f9f9f9;
      border-radius: 8px;

      .plan-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 1rem;

        h3 {
          font-size: 1.4rem;
        }

        .status {
          font-size: 1rem;
          font-weight: 600;
          padding: 0.3rem 0.6rem;
          border-radius: 4px;

          &.active {
            color: #28a745;
          }

          &.trial {
            color: #ffc107;
          }
        }
      }

      .plan-info {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;
        margin-bottom: 1.5rem;

        p {
          font-size: 1rem;
          margin: 0;
        }
      }

      p {
        font-size: 0.9rem;
        color: #555;
        margin-bottom: 1rem;
      }

      .actions {
        display: flex;
        justify-content: space-between;

        .cancel-btn,
        .upgrade-btn {
          background: #ff5c5c;
          color: #fff;
          padding: 0.6rem 1.2rem;
          border: none;
          cursor: pointer;
          border-radius: 5px;
          transition: background 0.3s ease;

          &:hover {
            background: #ff3333;
          }
        }

        .upgrade-btn {
          background: #28a745;

          &:hover {
            background: #218838;
          }
        }
      }
    }
  }
`;

export default Account;
