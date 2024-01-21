"use client";

import { useState, useEffect, useRef } from "react";

const RangeSlider = ({
  initialMin,
  initialMax,
  min,
  max,
  step,
  priceCap,
  onSubmitCallback,
}) => {
  const progressRef = useRef(null);

  const [minValue, setMinValue] = useState(initialMin);
  const [maxValue, setMaxValue] = useState(initialMax);

  const handleMin = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value) > parseInt(maxValue)) {
      } else {
        setMinValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) < minValue) {
        setMinValue(parseInt(e.target.value));
      }
    }
  };

  const handleMax = (e) => {
    if (maxValue - minValue >= priceCap && maxValue <= max) {
      if (parseInt(e.target.value) < parseInt(minValue)) {
      } else {
        setMaxValue(parseInt(e.target.value));
      }
    } else {
      if (parseInt(e.target.value) > maxValue) {
        setMaxValue(parseInt(e.target.value));
      }
    }
  };

  useEffect(() => {
    progressRef.current.style.left = (minValue / max) * step + "%";
    progressRef.current.style.right = step - (maxValue / max) * step + "%";
  }, [minValue, maxValue, max, step]);

  useEffect(() => {
    onSubmitCallback(minValue, maxValue);
  }, [onSubmitCallback, minValue, maxValue]);

  return (
    <div className="flex flex-col w-full bg-white shadow-xl rounded-lg px-6 py-4">
      <div className="flex justify-evenly items-center my-6 ">
        <div className="w-full relative">
          <input
            onChange={(e) => setMinValue(e.target.value)}
            type="number"
            value={minValue}
            className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
          />
          <label
            className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
          >
            Min
          </label>
        </div>
        <div className="mx-6 font-semibold text-lg"> - </div>
        <div className="w-full relative">
          <input
            onChange={(e) => setMaxValue(e.target.value)}
            type="number"
            value={maxValue}
            className={`peer w-full p-4 pt-6 font-light bg-white border-2 rounded-md outline-none transition opacity-70 border-neutral-300 focus:outline-none`}
          />
          <label
            className={`absolute text-md duration-150 transform -translate-y-3 top-5 left-4 text-zinc-400`}
          >
            Max
          </label>
        </div>
      </div>

      <div className="mb-4">
        <div className="slider relative h-1 rounded-md bg-gray-300">
          <div
            className="progress absolute h-1 bg-[#82cdff] rounded "
            ref={progressRef}
          ></div>
        </div>

        <div className="range-input relative w-full">
          <input
            onChange={handleMin}
            type="range"
            min={min}
            step={step}
            max={max}
            value={minValue}
            className="range-min absolute w-full  -top-1  h-1   bg-transparent  appearance-none pointer-events-none"
          />

          <input
            onChange={handleMax}
            type="range"
            min={min}
            step={step}
            max={max}
            value={maxValue}
            className="range-max absolute w-full  -top-1 h-1  bg-transparent appearance-none  pointer-events-none"
          />
        </div>
      </div>
    </div>
  );
};

export default RangeSlider;
