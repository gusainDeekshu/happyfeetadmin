"use client";
import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/public/images/google.png";
import apple from "@/public/images/apple.png";
import meta from "@/public/images/meta.png";
import axios from "axios";
import { StoreContext } from "@/components/context/StoreContext";

const SignUpSection = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [passwordVisibleTwo, setPasswordVisibleTwo] = useState(false);

  
  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("Component must be wrapped with StoreContextProvider");
  }

  const { setToken, setshowLogin } = context;
  const [data, setdata] = useState({ name: "", email: "", password: "",confirmPassword:"" });

  const onchangehandller = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata((data) => ({ ...data, [name]: value }));
    
    
  };

  const onregister = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    if(data.confirmPassword !== data.password){
      alert("check password");
      return;
    }
    const response = await axios.post(
      `/api/user/register`,
      data
    );
    if (response.data.success) {
      setToken(response.data.token);
      localStorage.setItem("token", response.data.token);
      setshowLogin(false);
      window.location.href = "/";
    } else {
      alert(response.data.message);
    }
  };

  return (
    <section className="authentication auth-create">
      <div className="authentication-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 col-xl-4">
              <div className="authentication__content section">
                <div className="intro">
                  <h2 className="light-title-sm title-animation fw-7 text-white mt-12">
                    Sign Up
                  </h2>
                  <p>Getting started is easy</p>
                </div>
                <div className="authentication__inner">
                  <form onSubmit={onregister} action="#" method="post">
                    <div className="input-single">
                      <label htmlFor="createuserName">Your Name</label>
                      <div className="ic-group">
                        <input
                          type="text"
                          name="name"
                          value={data.name}
                          id="createuserName"
                          onChange={onchangehandller}
                          placeholder="Full Name"
                          required
                        />
                        <span className="material-symbols-outlined">
                          person
                        </span>
                      </div>
                    </div>
                    <div className="input-single">
                      <label htmlFor="create-useremail">Your Email</label>
                      <div className="ic-group">
                        <input
                          type="text"
                          name="email"
                          id="create-useremail"
                          onChange={onchangehandller}
                          value={data.email}
                          placeholder="Enter Mail"
                          required
                        />
                        <span className="material-symbols-outlined">mail</span>
                      </div>
                    </div>
                    <div className="input-single">
                      <label htmlFor="createPassword">Password</label>
                      <div className="ic-group pass">
                        <span
                          className="material-symbols-outlined show-pass"
                          onClick={() => setPasswordVisible(!passwordVisible)}
                        >
                          {passwordVisible ? "visibility" : "visibility_off"}
                        </span>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          value={data.password}
                          onChange={onchangehandller}
                          id="createPassword"
                          placeholder="Enter Password"
                          required
                        />
                        <span className="material-symbols-outlined">key</span>
                      </div>
                    </div>
                    <div className="input-single">
                      <label htmlFor="createconfirmPassword">
                        Confirm Password
                      </label>
                      <div className="ic-group pass">
                        <span
                          className="material-symbols-outlined show-pass"
                          onClick={() =>
                            setPasswordVisibleTwo(!passwordVisibleTwo)
                          }
                        >
                          {passwordVisibleTwo ? "visibility" : "visibility_off"}
                        </span>
                        <input
                          type={passwordVisibleTwo ? "text" : "password"}
                          name="confirmPassword"
                          value={data.confirmPassword}
                          onChange={onchangehandller}
                          id="createconfirmPassword"
                          placeholder="Confirm Password"
                          required
                        />
                        <span className="material-symbols-outlined">key</span>
                      </div>
                    </div>
                    <div className="section__content-cta">
                      <button type="submit" className="btn btn--primary">
                        Create Account
                      </button>
                    </div>
                    <div className="divider">
                      <span></span>
                      <p>Or continue with</p>
                      <span></span>
                    </div>
                  </form>
                  <div className="auth-cta">
                    <button>
                      <Image src={google} alt="Image" priority />
                    </button>
                    <button>
                      <Image src={apple} alt="Image" priority />
                    </button>
                    <button>
                      <Image src={meta} alt="Image" priority />
                    </button>
                  </div>
                </div>
                <div className="auth-footer">
                  <p>
                    Have an account? <Link href="sign-in">Sign In!</Link>
                  </p>
                  <div className="section__content-cta">
                    <Link href="/" className="btn btn--primary">
                      Back To Home
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SignUpSection;
