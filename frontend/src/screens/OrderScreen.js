import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  deliverOrder,
  getOrderDetails,
  payOrder,
} from "../actions/orderActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import {
  ORDER_DELIVER_RESET,
  ORDER_PAY_RESET,
} from "../constants/orderConstants";

const OrderScreen = ({ match, history }) => {
  const orderId = match.params.id;

  const payCardNumber = useRef(null);
  const payCardExpirationDate = useRef(null);
  const payCardCcv = useRef(null);

  const [sdkReady, setSdkReady] = useState(false);

  const dispatch = useDispatch();

  const orderDetails = useSelector((state) => state.orderDetails);
  const { order, loading, error } = orderDetails;

  const orderPay = useSelector((state) => state.orderPay);
  const { loading: loadingPay, success: successPay } = orderPay;

  const orderDeliver = useSelector((state) => state.orderDeliver);
  const { loading: loadingDeliver, success: successDeliver } = orderDeliver;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  if (!loading) {
    //   Calculate prices
    const addDecimals = (num) => {
      return (Math.round(num * 100) / 100).toFixed(2);
    };

    order.itemsPrice = addDecimals(
      order.orderItems.reduce((acc, item) => acc + item.price * item.qty, 0)
    );
  }

  useEffect(() => {
    if (!userInfo) {
      history.push("/login");
    }

    const addTapPayDirectPayScript = () => {
      //const { data: clientId } = await axios.get("/api/config/paypal");
      const script = document.createElement("script");
      script.type = "text/javascript";
      script.src = `https://js.tappaysdk.com/tpdirect/v5.7.0`;
      //script.async = true;
      script.onload = () => {
        window.TPDirect.setupSDK(
          121836,
          "app_gaoaU8KVUxH765chtMjik3SK1ypt9FyOe85D93nIl4w1eTCqPpFAoQctd8bV",
          "sandbox"
        );

        var fields = {
          number: {
            // css selector
            element: payCardNumber.current,
            placeholder: "**** **** **** ****",
          },
          expirationDate: {
            // DOM object
            element: payCardExpirationDate.current,
            placeholder: "MM / YY",
          },
          ccv: {
            element: payCardCcv.current,
            placeholder: "後三碼",
          },
        };

        window.TPDirect.card.setup({
          fields: fields,
          styles: {
            // Style all elements
            input: {
              color: "gray",
            },
            // Styling ccv field
            "input.ccv": {
              // 'font-size': '16px'
            },
            // Styling expiration-date field
            "input.expiration-date": {
              // 'font-size': '16px'
            },
            // Styling card-number field
            "input.card-number": {
              // 'font-size': '16px'
            },
            // style focus state
            ":focus": {
              // 'color': 'black'
            },
            // style valid state
            ".valid": {
              color: "green",
            },
            // style invalid state
            ".invalid": {
              color: "red",
            },
            // Media queries
            // Note that these apply to the iframe, not the root window.
            "@media screen and (max-width: 400px)": {
              input: {
                color: "orange",
              },
            },
          },
        });

        window.TPDirect.card.onUpdate(function (update) {
          // update.canGetPrime === true
          // --> you can call TPDirect.card.getPrime()
          console.log("canGetPrime", update.canGetPrime);
          if (update.canGetPrime) {
            // Enable submit Button to get prime.
            // submitButton.removeAttribute('disabled')
          } else {
            // Disable submit Button to get prime.
            // submitButton.setAttribute('disabled', true)
          }

          // cardTypes = ['mastercard', 'visa', 'jcb', 'amex', 'unknown']
          if (update.cardType === "visa") {
            // Handle card type visa.
          }

          // number 欄位是錯誤的
          if (update.status.number === 2) {
            // setNumberFormGroupToError()
          } else if (update.status.number === 0) {
            // setNumberFormGroupToSuccess()
          } else {
            // setNumberFormGroupToNormal()
          }

          if (update.status.expiry === 2) {
            // setNumberFormGroupToError()
          } else if (update.status.expiry === 0) {
            // setNumberFormGroupToSuccess()
          } else {
            // setNumberFormGroupToNormal()
          }

          if (update.status.ccv === 2) {
            // setNumberFormGroupToError()
          } else if (update.status.ccv === 0) {
            // setNumberFormGroupToSuccess()
          } else {
            // setNumberFormGroupToNormal()
          }
        });

        setSdkReady(true);
      };
      document.body.appendChild(script);
    };

    if (!order || successPay || successDeliver || order._id !== orderId) {
      dispatch({ type: ORDER_PAY_RESET });
      dispatch({ type: ORDER_DELIVER_RESET });
      dispatch(getOrderDetails(orderId));
    } else if (!order.isPaid) {
      if (!sdkReady) {
        addTapPayDirectPayScript();
      }
    }
  }, [dispatch, orderId, successPay, successDeliver, order, history, userInfo]);

  const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult);
    dispatch(payOrder(orderId, paymentResult));
  };

  const deliverHandler = () => {
    dispatch(deliverOrder(order));
  };

  return loading ? (
    <Loader />
  ) : error ? (
    <Message variant="danger">{error}</Message>
  ) : (
    <>
      <h1>Order {order._id}</h1>
      <div className="row">
        <div className="col-8">
          <ul className="list-group list-group-flush">
            <li className="list-group-item">
              <h2>Shipping</h2>
              <p>
                <strong>Name: </strong> {order.user.name}
              </p>
              <p>
                <strong>Email: </strong>{" "}
                <a href={`mailto:${order.user.email}`}>{order.user.email}</a>
              </p>
              <p>
                <strong>Address:</strong>
                {order.shippingAddress.address}, {order.shippingAddress.city}{" "}
                {order.shippingAddress.postalCode},{" "}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <Message variant="success">
                  Delivered on {order.deliveredAt}
                </Message>
              ) : (
                <Message variant="danger">Not Delivered</Message>
              )}
            </li>

            <li className="list-group-item">
              <h2>Payment Method</h2>
              <p>
                <strong>Method: </strong>
                {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <Message variant="success">Paid on {order.paidAt}</Message>
              ) : (
                <Message variant="danger">Not Paid</Message>
              )}
            </li>

            <li className="list-group-item">
              <h2>Order Items</h2>
              {order.orderItems.length === 0 ? (
                <Message>Order is empty</Message>
              ) : (
                <ul className="list-group list-group-flush">
                  {order.orderItems.map((item, index) => (
                    <li className="list-group-item" key={index}>
                      <div className="row">
                        <div className="col-1">
                          <img
                            src={item.images[0].url}
                            alt={item.name}
                            className="img-fluid rounded"
                          />
                        </div>
                        <div className="col">
                          <Link to={`/product/${item.product}`}>
                            {item.name}
                          </Link>
                        </div>
                        <div className="col-4">
                          {item.qty} x ${item.price} = ${item.qty * item.price}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </li>
          </ul>
        </div>
        <div className="col-4">
          <div className="card" style={{ width: "18rem" }}>
            <ul className="list-group list-group-flush">
              <li className="list-group-item">
                <h2>Order Summary</h2>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Items</div>
                  <div className="col">${order.itemsPrice}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Shipping</div>
                  <div className="col">${order.shippingPrice}</div>
                </div>
              </li>
              <li className="list-group-item">
                <div className="row">
                  <div className="col">Total</div>
                  <div className="col">${order.totalPrice}</div>
                </div>
              </li>
              {!order.isPaid && (
                <li className="list-group-item">
                  <div>
                    <div
                      className="tpfield"
                      id="card-number"
                      ref={payCardNumber}
                    ></div>
                    <div
                      className="tpfield"
                      id="card-expiration-date"
                      ref={payCardExpirationDate}
                    ></div>
                    <div
                      className="tpfield"
                      id="card-ccv"
                      ref={payCardCcv}
                    ></div>
                    <button type="button" className="btn btn-primary">
                      結帳
                    </button>
                  </div>
                </li>
              )}
              {loadingDeliver && <Loader />}
              {userInfo &&
                userInfo.isAdmin &&
                order.isPaid &&
                !order.isDelivered && (
                  <li className="list-group-item">
                    <button
                      type="button"
                      className="btn btn-block"
                      onClick={deliverHandler}
                    >
                      Mark As Delivered
                    </button>
                  </li>
                )}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderScreen;
