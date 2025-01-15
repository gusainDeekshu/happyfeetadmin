import Image from "next/image";
import Link from "next/link";
import thumb from "@/public/images/contact/thumb.png";
import mail from "@/public/images/contact/mail.png";
import phone from "@/public/images/contact/phone.png";
import location from "@/public/images/contact/location.png";

const ContactSection = () => {
  return (
    <section className="section m-contact fade-wrapper">
      <div className="container">
        <div className="row gaper section pt-0">
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={mail} alt="Image" priority />
              </div>
              <div className="content">
                <h3>Email</h3>
                <p>
                  <Link href="mailto:gusaindeekshant@gmail.com">
                    gusaindeekshant@gmail.com
                  </Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={phone} alt="Image" priority />
              </div>
              <div className="content">
                <h3>Phone</h3>
                <p>
                  <Link href="tel:8580486022">(+91) 8580486022</Link>
                </p>
              </div>
            </div>
          </div>
          <div className="col-12 col-sm-6 col-lg-4">
            <div className="m-contact__single fade-top">
              <div className="thumb">
                <Image src={location} alt="Image" priority />
              </div>
              <div className="content">
                <h3>Location</h3>
                <p>
                  <Link href="https://www.google.com/maps/@12.9311162,77.563905,16z?entry=ttu&g_ep=EgoyMDI0MTIxMS4wIKXMDSoASAFQAw%3D%3D" target="_blank">
                  Tyagrajnagar, Banglore 560070
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </section>
  );
};

export default ContactSection;
