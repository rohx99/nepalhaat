import React from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const OfferSwiper = () => {
  const offers = ["/offer1.png", "/offer3.png", "offer2.png"];
  return (
    <section className="sm:hidden mb-3">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={8}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="w-full h-[250px] sm:h-[350px] md:h-[450px] lg:h-[550px] rounded-xl overflow-hidden"
      >
        {offers?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={item}
                alt={`offers`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};

export default OfferSwiper;
