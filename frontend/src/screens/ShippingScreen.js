import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { saveShippingAddress } from "../actions/cartActions";
import CheckoutSteps from "../components/CheckoutSteps";

const ShippingScreen = ({ history }) => {
  const cart = useSelector((state) => state.cart);
  const { shippingAddress } = cart;

  const [address, setAddress] = useState(shippingAddress.address || "");
  const [mobilePhone, setMobilePhone] = useState(
    shippingAddress.mobilePhone || ""
  );

  const dispatch = useDispatch();

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(saveShippingAddress({ address, mobilePhone }));
    history.push("/payment");
  };

  return (
    <>
      <CheckoutSteps step1 step2 />
      <h1>Shipping</h1>
      <form onSubmit={submitHandler}>
        <div className="mb-3">
          <label htmlFor="address" className="form-label">
            地址
          </label>
          <input
            type="text"
            className="form-control"
            id="address"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="mobilePhone" className="form-label">
            手機
          </label>
          <input
            type="text"
            className="form-control"
            id="mobilePhone"
            placeholder="手機號碼"
            value={mobilePhone}
            onChange={(e) => setMobilePhone(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Continue
        </button>
      </form>
    </>
  );
};

export default ShippingScreen;
