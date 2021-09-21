import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";
import axios from "axios";

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No order items");
    return;
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    res.status(201).json(createdOrder);
  }
});

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    "user",
    "name email"
  );

  if (order) {
    res.json(order);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to paid
// @route   GET /api/orders/:id/pay
// @access  Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  let prime;

  let paymentUrl;
  if (process.env.NODE_ENV === "development") {
    paymentUrl = "https://sandbox.tappaysdk.com/tpc/payment/pay-by-prime";
    prime = "test_3a2fb2b7e892b914a03c95dd4dd5dc7970c908df67a49527c0a648b2bc9";
  } else {
    paymentUrl = "https://prod.tappaysdk.com/tpc/payment/pay-by-prime";
    primr = req.body.prime;
  }

  let payData = {
    prime: prime,
    partner_key: process.env.TAPPAY_PARTNER_KEY,
    merchant_id: process.env.TAPPAY_MERCHANT_ID,
    details: "TapPay Test",
    amount: order.totalPrice,
    cardholder: {
      phone_number: order.shippingAddress.mobilePhone,
      name: req.user.name,
      email: req.user.email,
      zip_code: "",
      address: "",
      national_id: "",
    },
    remember: true,
  };

  let result = await axios.post(paymentUrl, payData, {
    headers: {
      "x-api-key": process.env.TAPPAY_PARTNER_KEY,
    },
  });

  let paymentResult = result.data;

  // 更新訂單狀態
  if (order) {
    let update_time = 0;
    if (paymentResult.transaction_time_millis != null) {
      update_time = paymentResult.transaction_time_millis;
    }

    order.paymentResult = {
      id: req.body.id,
      status: paymentResult.status,
      returnMsg: paymentResult.msg,
      update_time,
    };

    if (paymentResult.status === 0) {
      order.isPaid = true;
      order.paidAt = Date.now();
    }

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Update order to delivered
// @route   GET /api/orders/:id/deliver
// @access  Private/Admin
const updateOrderToDelivered = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } else {
    res.status(404);
    throw new Error("Order not found");
  }
});

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({}).populate("user", "id name");
  res.json(orders);
});

export {
  addOrderItems,
  getOrderById,
  updateOrderToPaid,
  updateOrderToDelivered,
  getMyOrders,
  getOrders,
};
