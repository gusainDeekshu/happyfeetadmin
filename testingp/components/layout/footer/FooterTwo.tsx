"use client";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import Logo from "public/images/logo.png";

const FooterTwo = () => {
  const pathname = usePathname();
  const isAboutUsOrServicesRoute =
    pathname === "/about-us" || pathname === "/services";

  const currentYear = new Date().getFullYear();

  return (
    <footer
      className={`footer-cmn ${isAboutUsOrServicesRoute ? " lilu-foot" : ""}`}
    >
      <div className="container">
       
        <div className="row">
          <div className="col-12">
            <div className="footer-cmn__inner section ">
              <div className="row  gaper">
                <div className="col-12 col-lg-7 col-xl-8">
                  <div className="footer-cmn__left text-center text-lg-start">
                    <Link href="/" className="logo">
                      <Image src={Logo} alt="Image" priority />
                    </Link>
                    <div className="footer__nav-list">
                      <ul className="justify-content-center justify-content-lg-start">
                        <li>
                          <Link href="/">Home</Link>
                        </li>
                       
                        <li>
                          <Link href="applications">Applications</Link>
                        </li>
                        
                        <li>
                          <Link href="contact-us">Contact Me</Link>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-12 col-lg-5 col-xl-4">
                  
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="footer__copyright">
        <div className="container">
          <div className="row gaper">
            <div className="col-12 col-lg-6">
              <div className="footer__copyright-content text-center text-lg-start">
                <p>
                  Copyright &copy; <span id="copyrightYear">{currentYear}</span>{" "}
                  <Link href="/">Deekshu</Link>. All Rights Reserved
                </p>
              </div>
            </div>
            <div className="col-12 col-lg-6">
              <div className="footer__copyright-social justify-content-center justify-content-lg-end">
                <p className="tertiary-text d-none d-lg-block">Social Links :</p>
                <div className="social">
                <Link
                href="https://www.facebook.com/deekshant.gusain/"
                target="_blank"
                aria-label="share us on facebook"
                title="facebook"
              >
                <i className="bi bi-facebook"></i>
              </Link>
             
              <Link
                href="https://www.linkedin.com/in/deekshant-full-stack-developer/"
                target="_blank"
                aria-label="share us on pinterest"
                title="linkedin"
              >
                <i className="bi bi-linkedin"></i>
              </Link>
              <Link
                href="https://www.instagram.com/deekshantb0b0/"
                target="_blank"
                aria-label="share us on instagram"
                title="instagram"
              >
                <i className="bi bi-instagram"></i>
              </Link>
              <Link
                href="https://github.com/gusainDeekshu"
                target="_blank"
                aria-label="share us on instagram"
                title="instagram"
              >
                <i className="fa-brands fa-github"></i>
              </Link>
            
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default FooterTwo;
