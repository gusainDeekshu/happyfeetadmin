"use client";
import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import google from "@/public/images/google.png";
import apple from "@/public/images/apple.png";
import meta from "@/public/images/meta.png";
import { StoreContext } from "@/components/context/StoreContext";
import axios from "axios";

const SignInSection = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const context = useContext(StoreContext);

  if (!context) {
    throw new Error("Component must be wrapped with StoreContextProvider");
  }

  const { setToken, setshowLogin } = context;
  const [data, setdata] = useState({ name: "Admin", email: "", password: "" });

  const onchangehandller = (event: { target: { name: any; value: any } }) => {
    const name = event.target.name;
    const value = event.target.value;
    setdata((data) => ({ ...data, [name]: value }));
    
  };

  const onlogin = async (event: { preventDefault: () => void }) => {
    event.preventDefault();
    const response = await axios.post(
      `/api/user/login`,
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
    <section className="authentication">
      <div className="authentication-wrapper">
        <div className="container">
          <div className="row">
            <div className="col-12 col-md-8 col-lg-6 col-xl-4">
              <div className="authentication__content section">
                <div className="intro">
                  <h2 className="light-title-sm title-animation fw-7 text-white mt-12">
                    Login
                  </h2>
                  <p>welcome back, we missed you.</p>
                </div>
                <div className="authentication__inner">
                  <form onSubmit={onlogin} action="#" method="post">
                    <div className="input-single">
                      <label htmlFor="Email">Email</label>
                      <div className="ic-group">
                        <input
                          type="text"
                          name="email"
                          id="Email"
                          placeholder="Email"
                          onChange={onchangehandller}
                          value={data.email}
                          required
                        />
                        <span className="material-symbols-outlined">
                          person
                        </span>
                      </div>
                    </div>
                    <div className="input-single">
                      <label htmlFor="userPassword">Password</label>
                      <div className="ic-group pass">
                        <span
                          className="material-symbols-outlined show-pass"
                          onClick={togglePasswordVisibility}
                        >
                          {passwordVisible ? "visibility" : "visibility_off"}
                        </span>
                        <input
                          type={passwordVisible ? "text" : "password"}
                          name="password"
                          id="userPassword"
                          onChange={onchangehandller}
                          value={data.password}
                          placeholder="Enter Password"
                          required
                        />
                        <span className="material-symbols-outlined">key</span>
                      </div>
                      <Link href="contact-us">Forget Password?</Link>
                    </div>
                    <div className="section__content-cta">
                      <button type="submit" className="btn btn--primary">
                        Sign In
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
                    Don&apos;t have an account?{" "}
                    <Link href="sign-up">Sign Up!</Link>
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

export default SignInSection;
