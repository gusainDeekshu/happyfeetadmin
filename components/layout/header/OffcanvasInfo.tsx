import Image from "next/image";
import Link from "next/link";
import logo from "@/public/images/logo.png";

const OffcanvasInfo = ({ isOpen, setIsOpen }: any) => {
  return (
    <>
      <div
        className={"offcanvas-info" + (isOpen ? " offcanvas-info-active" : " ")}
      >
        <div className="offcanvas-info__inner">
          <div className="offcanvas-info__intro">
            <div className="offcanvas-info__logo">
              <Link href="/">
                <Image src={logo} width={200} alt="Image" priority />
              </Link>
            </div>
            <h4>Make Conversations Simple</h4>
          </div>
          <div className="offcanvas-info__content">
            <h5>Contact Me</h5>
            <ul>
              <li>
                <Link href="mailto:gusaindeekshant@gmail.com">gusaindeekshant@gmail.com</Link>
              </li>
              <li>
                <Link href="tel:8580486022">+91-8580486022</Link>
              </li>
              <li>
                <Link
                  href="https://www.google.com/maps/@12.9311162,77.563905,16z?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D"
                  target="_blank"
                >
                  Tyagrajnagar, Banglore 560070
                </Link>
              </li>
            </ul>
          </div>
          
          <div className="offcanvas-info__footer pt-4 mt-4">
            <p className="tertiary-text">Social Media :</p>
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
        <button
          className="close-offcanvas-info"
          aria-label="close offcanvas info"
          onClick={() => setIsOpen(false)}
        >
          <i className="bi bi-x-lg"></i>
        </button>
      </div>
      <div
        className={
          "offcanvas-info-backdrop " +
          (isOpen ? " offcanvas-info-backdrop-active" : " ")
        }
        onClick={() => setIsOpen(false)}
      ></div>
    </>
  );
};

export default OffcanvasInfo;
