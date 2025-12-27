"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination"; 

export default function ProductSwiper({ media, productName }) {
  return (
    <div className="relative group">
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
        {media?.map((item, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              {item.endsWith(".mp4") ? (
                <video
                  src={item}
                  className="w-full h-full object-contain bg-black"
                  controls
                  muted
                  autoPlay
                  loop
                />
              ) : (
                <Image
                  src={item}
                  alt={`${productName} - ${index + 1}`}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                  priority={index === 0}
                />
              )}
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
}