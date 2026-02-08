"use client";
import { useState } from "react";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import { FreeMode, Thumbs } from "swiper/modules";
import "swiper/swiper-bundle.css";


const ProductDetailsSlider = ({ displayImages }: any) => {
  const imageArray = displayImages;
  const [thumbsSwiper, setThumbsSwiper] = useState<any>(null);

  return (
    <div className="product__thumb">
      <Swiper
        slidesPerView={1}
        spaceBetween={0}
        modules={[FreeMode, Thumbs]}
        thumbs={{
          swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
        }}
        className="large-product-img"
      >
        {imageArray.map((imagePath: any, index: any) => (
          <SwiperSlide key={index}>
            <div className="single-lg-img">
              <Image
                src={imagePath}
                alt={`Slide ${index + 1}`}
                width={500}
                height={300}
                style={{ objectFit: "contain" ,maxHeight:"180px"}}
                priority
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <Swiper
        slidesPerView={2}
        spaceBetween={24}
        slidesPerGroup={1}
        modules={[FreeMode, Thumbs]}
        breakpoints={{
          576: {
            slidesPerView: 3,
          },
        }}
        className="small-product-img"
        onSwiper={setThumbsSwiper}
        observer={true}
        observeParents={true}
        watchSlidesProgress={true}
        freeMode={true}
      >
        {imageArray.map((imagePath: any, index: any) => (
         
            <SwiperSlide key={index}>
              <div className="single-sm-img">
                <Image src={imagePath} alt={`Slide ${index + 1}`} 
                width={500}
                height={300} 
                style={{ objectFit: "contain" ,maxHeight:"100px"}}
                priority />
              </div>
            </SwiperSlide>
          
        ))}
        
        
       
      </Swiper>
    </div>
  );
};

export default ProductDetailsSlider;
