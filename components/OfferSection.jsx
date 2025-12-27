import Image from "next/image";
import React from "react";

const OfferSection = () => {
  return (
    <>
      <section className="hidden sm:flex justify-between bg-gradient-to-r from-[#932512] via-[#E3BE8D] to-[#F68100] py-2 px-3 rounded-xl mb-3">
        <Image src={`/offer1.png`} alt="offer" width={400} height={100} />
        <Image src={`/offer3.png`} alt="offer" width={400} height={100} />
        <Image src={`/offer2.png`} alt="offer" width={400} height={100} />
      </section>
    </>
  );
};

export default OfferSection;
