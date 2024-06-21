import { isEmpty } from "lodash";
import Image from "next/image";
import { useState } from "react";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type MediaItem = {
  type: "image" | "video";
  url: string;
};

const CustomCarousel = ({ media }: { media: MediaItem[] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const prevSlide = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + media.length) % media.length
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % media.length);
  };

  return (
    <div className="relative w-full mx-auto h-full bg-black">
      <div className="overflow-hidden relative rounded-lg shadow-lg w-full h-full">
        {media.map((item, index) => (
          <div
            key={index}
            className={`flex items-center justify-center w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out transform ${
              index === currentIndex
                ? "translate-x-0"
                : index < currentIndex
                ? "translate-x-[-100%]"
                : "translate-x-full"
            }`}
            style={{ zIndex: index === currentIndex ? 1 : 0 }}
          >
            {item.type === "image" ? (
              <Image
                src={item.url}
                alt={`Slide-${index}`}
                width="0"
                height="0"
                sizes="100vw"
                className="w-full h-auto max-h-[70vh]"
                style={{ objectFit: "cover" }}
              />
            ) : (
              <iframe
                key={index}
                className="w-full h-[70vh]"
                src={item.url}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            )}
          </div>
        ))}
      </div>
      {media && !isEmpty(media) && currentIndex > 0 && (
        <button
          onClick={prevSlide}
          className="z-50 absolute top-1/2 left-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-rose-500 hover:text-white"
        >
          <FaArrowLeft />
        </button>
      )}
      {media && !isEmpty(media) && currentIndex < media.length - 1 && (
        <button
          onClick={nextSlide}
          className="z-50 absolute top-1/2 right-4 transform -translate-y-1/2 bg-white p-2 rounded-full shadow-lg hover:bg-rose-500 hover:text-white"
        >
          <FaArrowRight />
        </button>
      )}
    </div>
  );
};

export default CustomCarousel;
