import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection } from "firebase/firestore";
import {
  ErrorMessage,
  Field,
  Form,
  Formik
} from "formik";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import Spinner from "../../components/Spinner/Spinner";
import { auth, db } from "../../firebase";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useAppSelector } from "../../hooks/useAppSelector";
import { setLoadingState } from "../../slice/userSlice";
import "./signup.scss";

// const MyTextInput = ({ label, ...props }:{label:string,props:s}) => {
//   // useField() returns [formik.getFieldProps(), formik.getFieldMeta()]
//   // which we can spread on <input>. We can use field meta to show an error
//   // message if the field is invalid and it has been touched (i.e. visited)
//   const [field, meta] = useField(props);
//   return (
//     <>
//       <label htmlFor={props.id || props.name}>{label}</label>
//       <input className="text-input" {...field} {...props} />
//       {meta.touched && meta.error ? (
//         <div className="error">{meta.error}</div>
//       ) : null}
//     </>
//   );
// };

const SignUp = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [signupMessage,setSignupMessage] = useState<string>("") 
  const isLoading = useAppSelector((state) => state.user.isLoading) === "loading" ? true : false;
  return (
    <div className="signup">
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
        <div className="signup__content">
          <div className="title">Create your account</div>
          <div className="description">
            Complete your sign up to receive 10% off your first order.*
          </div>
          <Formik
            initialValues={{ email: "", password: "", confirmPassword: "" }}
            validationSchema={Yup.object({
              email: Yup.string()
                .trim()
                .email("Invalid Email Address")
                .required("Required"),
              password: Yup.string()
                .min(8, "Must be more than 8 characters")
                .required("Required"),
              confirmPassword: Yup.string().oneOf(
                [Yup.ref("password")],
                "Passwords must match"
              ),
            })}
            onSubmit={async (values) =>{
              dispatch(setLoadingState('loading'))
               await createUserWithEmailAndPassword(auth,values.email,values.password).then((user)=>{
                addDoc(collection(db,"users"),{
                  userEmail:user.user.email
                })
                 navigate("/")
                 dispatch(setLoadingState('pending'))
               }).catch((error) => {
                dispatch(setLoadingState('pending'))
                 switch (error.code){
                   case "auth/email-already-in-use":
                     setSignupMessage("Email already in use")
                     break;
                  case "auth/network-request-failed":
                    setSignupMessage("Request failed")
                 }
               })
            }}
          >
                <Form> 
                  <Field name="email" placeholder="Email Address" />
                  <ErrorMessage name="email" render={msg => <div className="message">{msg}</div>}  />
                  <Field
                    name="password"
                    type="password"
                    placeholder="Password"
                  />
                  <ErrorMessage name="password" render={msg => <div className="message">{msg}</div>}  />
                  <Field
                    name="confirmPassword"
                    type="password"
                    placeholder="Confirm Password"
                  />
                  <ErrorMessage name="confirmPassword" render={msg => <div className="message">{msg}</div>}/>
                  {signupMessage&&<div className="message">{signupMessage}</div>}
                  <button type="submit" className="signup__btn" disabled={isLoading}>
                    Sign up
                  </button>
                </Form>
          </Formik>
          <div style={{ fontSize: "14px", padding: "20px 0 " }}>
            Already have an account?{" "}
            <Link to="/login" className="span">
              Log in
            </Link>
          </div>
        </div>
        <img
          className="signup__img"
          src="https://media.everlane.com/image/upload/c_fill,w_384,ar_380:655,q_auto,dpr_1.0,g_face:center,f_auto,fl_progressive:steep/i/DesktopSignupModalImage"
          alt="/b"
        ></img>
      </div>
    </div>
  );
};

export default SignUp;
