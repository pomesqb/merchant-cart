import React from "react";
import { LinkContainer } from "react-router-bootstrap";

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <nav className="nav justify-content-center mb-4">
      {step1 ? (
        <LinkContainer to="/login">
          <a className="nav-link" href="/#">
            Sign In
          </a>
        </LinkContainer>
      ) : (
        <a className="nav-link disabled" href="/#">
          Sign In
        </a>
      )}
      {step2 ? (
        <LinkContainer to="/shipping">
          <a className="nav-link" href="/#">
            Shipping
          </a>
        </LinkContainer>
      ) : (
        <a className="nav-link disabled" href="/#">
          Shipping
        </a>
      )}
      {step3 ? (
        <LinkContainer to="/payment">
          <a className="nav-link" href="/#">
            Payment
          </a>
        </LinkContainer>
      ) : (
        <a className="nav-link disabled" href="/#">
          Payment
        </a>
      )}
      {step4 ? (
        <LinkContainer to="/placeorder">
          <a className="nav-link" href="/#">
            Place Order
          </a>
        </LinkContainer>
      ) : (
        <a className="nav-link disabled" href="/#">
          Place Order
        </a>
      )}
    </nav>
  );
};

export default CheckoutSteps;
