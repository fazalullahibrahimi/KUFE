import React from "react";
import ImageBackGround from "../../public/Hero_BackGroundImage.jpg";

const Hero = () => {
  return (
    <section
      className='relative w-full h-[500px] bg-cover bg-center flex items-center justify-center'
      style={{
        backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url(${ImageBackGround})`,
        backgroundRepeat: "no-repeat",
      }}
    >
      <div className='text-center text-white relative'>
        <h1 className='text-4xl font-bold'>Faculty of Economics</h1>
      </div>
    </section>
  );
};

export default Hero;
