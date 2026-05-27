import React from 'react';
import { Link } from 'react-router-dom';
import mainPicture from '../../assets/Madeira.jpg';

const Featured = () => {
  return (
    <div className="bg-neutral-50 dark:bg-neutral-950">
      <div className="max-w-[1550px] mx-auto flex flex-col lg:flex-row lg:justify-between lg:items-center min-h-screen px-6 py-12 lg:py-0">
        <div className="flex-1 h-[400px] lg:h-[800px] mb-8 lg:mb-0 lg:order-2">
          <img
            src={mainPicture}
            alt="Main feature image"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="flex-1 text-left lg:h-[800px] flex flex-col justify-center lg:mr-12 lg:order-1 select-none">
          <h3 className="uppercase mb-4 dark:text-white">Features That Refuse to Sit Still</h3>
          <p className="text-2xl lg:text-4xl mb-8 select-none text-neutral-600 dark:text-neutral-300">
            Not just bullet points—living, breathing highlights. Each feature adapts to movement, context, and mood,
            making your product feel alive from the very first glance.
          </p>
          <Link
            to="/blog/features-that-refuse-to-sit-still"
            className="bg-white text-black dark:bg-black dark:text-white border-2 dark:border-white border-black px-4 py-2 text-sm transition-all duration-300 hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black cursor-pointer w-fit"
          >
            LEARN MORE
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Featured;
