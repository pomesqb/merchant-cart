import React from "react";
// import { Route } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LinkContainer } from "react-router-bootstrap";
// import SearchBox from "./SearchBox";
import { logout } from "../actions/userActions";

const Header = () => {
  const dispatch = useDispatch();

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const cart = useSelector((state) => state.cart);
  const { cartItems } = cart;

  const logoutHandler = () => {
    dispatch(logout());
  };

  return (
    <nav className="navbar navbar-expand navbar-light bg-light">
      <div className="container-fluid">
        <LinkContainer to="/">
          <a className="navbar-brand" href="/#">
            merchant-cart
          </a>
        </LinkContainer>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarSupportedContent"
          aria-controls="navbarSupportedContent"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
            <li className="nav-item">
              <LinkContainer to="/cart">
                <a className="nav-link" href="/#">
                  <i className="fas fa-shopping-cart"></i> Cart(
                  {cartItems.reduce((acc, item) => acc + item.qty, 0)})
                </a>
              </LinkContainer>
            </li>
            {userInfo ? (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {userInfo.name}
                </a>
                <ul className="dropdown-menu" aria-labelledby="navbarDropdown">
                  <li>
                    <LinkContainer to="/profile">
                      <a className="dropdown-item" href="/#">
                        Profile
                      </a>
                    </LinkContainer>
                  </li>
                  <li>
                    <hr className="dropdown-divider" />
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      onClick={logoutHandler}
                      href="/#"
                    >
                      Logout
                    </a>
                  </li>
                </ul>
              </li>
            ) : (
              <LinkContainer to="/login">
                <a className="nav-link" href="/#">
                  <i className="fas fa-user"></i> Sign In
                </a>
              </LinkContainer>
            )}
            {userInfo && userInfo.isAdmin && (
              <li className="nav-item dropdown">
                <a
                  className="nav-link dropdown-toggle"
                  href="/#"
                  id="navbarDropdownAdmin"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Admin
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <LinkContainer to="/admin/userlist">
                      <a className="dropdown-item" href="/#">
                        Users
                      </a>
                    </LinkContainer>
                  </li>
                  <li>
                    <LinkContainer to="/admin/productlist">
                      <a className="dropdown-item" href="/#">
                        Products
                      </a>
                    </LinkContainer>
                  </li>
                  <li>
                    <LinkContainer to="/admin/orderlist">
                      <a className="dropdown-item" href="/#">
                        Orders
                      </a>
                    </LinkContainer>
                  </li>
                </ul>
              </li>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;
