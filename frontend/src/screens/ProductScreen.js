import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import Meta from "../components/Meta";
import { getProductDetails } from "../actions/productActions";
import { addToCart } from "../actions/cartActions";

const ProductScreen = ({ history, match }) => {
  const productId = match.params.id;
  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const dispatch = useDispatch();

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  // const userLogin = useSelector((state) => state.userLogin);
  // const { userInfo } = userLogin;

  useEffect(() => {
    dispatch(getProductDetails(productId));
  }, [dispatch, productId]);

  useEffect(() => {
    if (product && product.productItems) {
      setSize(product.productItems[0].size);
      setColor(product.productItems[0].color);
    }
  }, [product]);

  const addToCartHandler = () => {
    const findItem = product.productItems.find(
      (x) => x.color === color && x.size === size
    );

    dispatch(addToCart(productId, 1, color, size, findItem.countInStock));
    //history.push(`/cart/${match.params.id}?qty=${qty}`);
  };

  const colorSelectBox = () => {
    let result = "";
    let hasColorOption = false;
    if (product.productItems) {
      let options = product.productItems.map((item) => {
        if (item.color !== "") {
          hasColorOption = true;
          return <option key={item._id}>{item.color}</option>;
        }

        return "";
      });

      if (hasColorOption) {
        result = (
          <select
            className="form-select"
            onChange={(e) => setColor(e.target.value)}
          >
            {options}
          </select>
        );
      }

      return result;
    }
  };

  const sizeSelectBox = () => {
    let result = "";
    let hasSizeOption = false;
    if (product.productItems) {
      let options = product.productItems.map((item) => {
        if (item.size !== "") {
          hasSizeOption = true;
          return <option key={item._id}>{item.size}</option>;
        }

        return "";
      });

      if (hasSizeOption) {
        result = (
          <select
            className="form-select"
            onChange={(e) => setSize(e.target.value)}
          >
            {options}
          </select>
        );
      }

      return result;
    }
  };

  return (
    <>
      <Link className="btn btn-light my-3" to="/">
        Go Back
      </Link>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <>
          <Meta title={product.name} />
          <div className="row">
            <div className="col-6">
              {product.images ? (
                <img src={product.images[0].url} alt={product.name}></img>
              ) : (
                "no product images"
              )}
            </div>
            <div className="col-3">
              <ul className="list-group list-group-flush">
                <li className="list-group-item">
                  <h3>{product.name}</h3>
                </li>
                <li className="list-group-item">Price: ${product.price}</li>
                <li className="list-group-item">
                  Description: {product.description}
                </li>
              </ul>
            </div>
            <div className="col-3">
              <div className="card">
                <ul className="list-group list-group-flush">
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">Price:</div>
                      <div className="col">${product.price}</div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">Status:</div>
                      <div className="col">Todo:有沒有庫存判斷</div>
                    </div>
                  </li>

                  <li className="list-group-item">
                    <div className="row">
                      <div className="col">規格:</div>
                      <div className="col">
                        {colorSelectBox()}
                        {sizeSelectBox()}
                      </div>
                    </div>
                  </li>
                  <li className="list-group-item">
                    <button
                      type="button"
                      className="btn btn-outline-primary"
                      onClick={addToCartHandler}
                    >
                      加入購物車
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-6">
              <h2>DetailQ</h2>
            </div>
          </div>
          {product.images &&
            product.images.slice(1).map((img) => (
              <div key={img._id} className="row mb-2">
                <div className="col-12">
                  <img src={img.url} alt={product.name} />
                </div>
              </div>
            ))}
        </>
      )}
    </>
  );
};

export default ProductScreen;
