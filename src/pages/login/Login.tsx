import "./log-in.scss";

import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { auth, provider } from "../../firebase";
import { setActiveUser, setLoadingState } from "../../slice/userSlice";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Field, Form, Formik, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useAppSelector } from "../../hooks/useAppSelector";
import Spinner from "../../components/Spinner/Spinner";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const isLoading =
    useAppSelector((state) => state.user.isLoading) === "loading" ? true : false;
  const [loginMessage, setLoginMessage] = useState<string>("");

  const handleGoogleLogin = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const userEmail = result.user?.email;
        const userName = result.user?.displayName;
        dispatch(
          setActiveUser({
            userEmail,
            userName,
            isLoading: "pending",
          })
        );
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="login">
      {isLoading && (
        <div className="loading">
          <div className="spinner">
            <Spinner />
          </div>
        </div>
      )}
      <div className="container">
        <button
          className="close__btn"
          onClick={() => {
            navigate("/");
          }}
        >
          <span aria-hidden="true">&times;</span>
        </button>
        <div className="login__content">
          <div className="title">Good to see you again.</div>
          <div className="description">Please log in to your account.</div>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .trim("Invalid")
                .email("Invalid Email Address")
                .required("Required"),
              password: Yup.string()
                .min(8, "Must be more than 8 characters")
                .required("Required"),
            })}
            onSubmit={async (values) => {
              dispatch(setLoadingState("loading"));
              await signInWithEmailAndPassword(
                auth,
                values.email,
                values.password
              )
                .then((result) => {
                  const userEmail = result.user?.email;
                  const userName = result.user?.displayName;
                  dispatch(
                    setActiveUser({
                      userEmail,
                      userName,
                      isLoading: "pending",
                    })
                  );
                  navigate("/");
                })
                .catch((error) => {
                  dispatch(setLoadingState("pending"));
                  switch (error.code) {
                    case "auth/invalid-email":
                      setLoginMessage("Invalid Email");
                      break;
                    case "auth/email-already-in-use":
                      setLoginMessage("Email already in use !");
                      break;
                    case "auth/user-not-found":
                      setLoginMessage("User not found");
                      break;
                    case "auth/wrong-password":
                      setLoginMessage("Incorrect Password");
                  }
                });
            }}
          >
            <Form style={{ width: "100%" }}>
              <Field name="email" placeholder="Email Address" />
              <ErrorMessage
                render={(msg) => <div className="message">{msg}</div>}
                name="email"
              />
              <Field name="password" type="password" placeholder="Password" />
              <ErrorMessage
                render={(msg) => <div className="message">{msg}</div>}
                name="password"
              />
              {/* <ErrorMessage name="password" /> */}
              <div className="message">{loginMessage}</div>
              <button type="submit" className="login__btn" disabled={isLoading}>
                Sign up
              </button>
            </Form>
          </Formik>
          <div className="description">Or continue with</div>
          <div
            className="group__button"
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
            }}
          >
            <button
              className="login__btn other"
              style={{ marginRight: "10px" }}
              onClick={handleGoogleLogin}
            >
              <img
                style={{ width: "18px" }}
                src="https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/v1/i/5c439b13_4155.png"
                alt=""
              />
              <span style={{ marginLeft: "8px" }}>Google</span>
            </button>
            <button className="login__btn other">
              <img
                style={{ width: "18px" }}
                src="https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/v1/i/072c2eb3_33d0.png"
                alt=""
              />
              <span style={{ marginLeft: "8px" }}>Facebook</span>
            </button>
          </div>
          <div style={{ fontSize: "14px", padding: "40px 0" }}>
            Don't have an account?{" "}
            <Link to="/signup" className="span">
              Sign up
            </Link>{" "}
            | <span className="span">Reset password</span>
          </div>
        </div>
        <img
          className="login__img"
          src="https://media.everlane.com/image/upload/c_scale,dpr_1.0,f_auto,q_auto,w_auto/c_limit,w_1500/v1/i/87c6a9b5_d15c.jpg"
          alt="/b"
        ></img>
      </div>
    </div>
  );
};

export default Login;
