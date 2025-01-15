import Image from "next/image";
import Link from "next/link";
import CraftThumb from "@/public/images/craft-thumb.png";
import Shape from "@/public/images/footer/shape-one.png";

const Craft = () => {
  return (
    <section className="section craft" id="scrollPosition">
      <div className="container">
        <div className="row align-items-center gaper">
          <div className="col-12 col-lg-6 col-xxl-5">
            <div className="section__content">
              <span className="sub-title">About Me</span>
              <h2 className="title title-animation">Full Stack Developer</h2>
              <p>
                Proficient in developing web applications using <b>ReactJS</b>,
                <b>NextJS</b>, <b>NodeJS</b>, and <b>Laravel</b>, with expertise in integrating <b>APIs</b>,
                state management, and responsive design. Skilled in working with
                various databases like <b>MySQL</b>, <b>MongoDB</b>, and <b>PostgresSql</b>. <br></br><br></br>

                Experienced in front-end technologies including TailwindCSS,
                Bootstrap, and jQuery. Strong understanding of critical thinking
                and problem-solving, applying AJAX, GraphQL, and Docker for
                efficient development and deployment. <br></br><br></br>
                Adept at quickly
                mastering new programming languages and frameworks, with a
                strong ability to adapt to evolving technologies and tools.
              </p>
              <div className="section__content-cta">
                <Link
                  target="_blank"
                  href="/cv/Deekshant_Resume.pdf"
                  className="btn btn--primary"
                  download
                >
                  <i className="fas fa-download"></i> Download CV
                </Link>
              </div>
            </div>
          </div>
          <div className="col-12 col-lg-6 col-xxl-7">
            <div className="craft__thumb text-start text-lg-end">
              <div className="reveal-img parallax-img">
                <Image src={CraftThumb} alt="Image" priority />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="anime-one">
        <Image src={Shape} alt="Image" priority />
      </div>
    </section>
  );
};

export default Craft;
