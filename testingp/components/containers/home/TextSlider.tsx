"use client";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import "swiper/swiper-bundle.css";
import Star from "@/public/images/star-two.png";

const TextSlider = () => {
  return (
    <section className="text-slider-wrapper">
      <Swiper
        slidesPerView="auto"
        spaceBetween={24}
        speed={10000}
        loop={true}
        centeredSlides={false}
        modules={[Autoplay]}
        autoplay={{
          delay: 1,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }} 
        className="text-slider"
      >
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="text-slider__single">
            <h2 className="light-title">
              <Link href="services">Projects</Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
            <h2 className="light-title">
              <Link href="services" className="text-stroke" data-text="Image">
                Image
              </Link>
            </h2>
            <i className="fas fa-star-of-life "></i>
          </div>
        </SwiperSlide>
      </Swiper>
    </section>
  );
};

export default TextSlider;
