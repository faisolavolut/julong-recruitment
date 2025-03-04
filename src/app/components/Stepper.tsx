import { Progress } from "@/lib/components/ui/Progress";
import { FC, useEffect, useRef, useState } from "react";
import { FaCheck } from "react-icons/fa6";
import { IoClose } from "react-icons/io5";

const steps = [
  { id: 1, label: "Administrative" },
  { id: 2, label: "Test" },
  { id: 3, label: "Interview", result: "failed" },
  { id: 4, label: "Offering Letter" },
  { id: 5, label: "Contract" },
  { id: 6, label: "Final Result" },
];

const Stepper: FC<{ steps: any[]; step: number }> = ({ steps, step = 0 }) => {
  const [currentStep, setCurrentStep] = useState(step); // Contoh step aktif di "Test"
  const [progress, setProgress] = useState(0);
  const startRef = useRef<HTMLDivElement | null>(null);
  const endRef = useRef<HTMLDivElement | null>(null);
  const [distance, setDistance] = useState(0);
  useEffect(() => {
    setProgress(
      currentStep > 1 ? ((currentStep - 1) / (steps.length - 1)) * 100 : 0
    );
  }, [currentStep, distance]);
  useEffect(() => {
    if (startRef.current && endRef.current) {
      const startX = startRef.current.getBoundingClientRect().left;
      const endX = endRef.current.getBoundingClientRect().left + 10;
      setDistance(endX - startX);
    }
  }, [startRef, endRef]);
  return (
    <div className="flex relative items-center w-full  mx-auto">
      <div
        className={cx(
          `grid w-full`,
          css`
            grid-template-columns: repeat(${steps?.length}, minmax(0, 1fr));
          `
        )}
      >
        {steps.map((step, index) => (
          <div
            key={step.id}
            ref={
              index === 0
                ? startRef
                : index === steps.length - 1
                ? endRef
                : null
            }
            className="flex-1 flex flex-col items-center relative"
          >
            {/* Garis */}
            {/* Step Number */}

            <div
              className={cx(
                `relative w-10 h-10 flex items-center justify-center rounded-full text-white font-bold z-10`,
                css`
                  z-index: 1;
                `
              )}
            >
              <div
                className={cx(
                  `relative w-10 h-10 flex items-center justify-center rounded-full text-white font-bold z-10 ${
                    currentStep - 1 > index
                      ? "bg-primary"
                      : currentStep - 1 === index
                      ? currentStep - 1 === index && step?.result === "failed"
                        ? "border-4 border-red-500 text-red-500 bg-white"
                        : "border-4 border-primary text-primary bg-white"
                      : "bg-gray-300"
                  }`,
                  css`
                    z-index: 1;
                  `
                )}
              >
                {currentStep - 1 === index && step?.result === "failed" ? (
                  <>
                    <IoClose className="text-red-500" />
                  </>
                ) : (
                  <>{currentStep - 1 > index ? <FaCheck /> : index + 1}</>
                )}
              </div>
              {index === 0 && (
                <Progress
                  value={progress}
                  className={cx(
                    `absolute top-5 left-0 w-full h-1 bg-gray-300`,
                    css`
                      z-index: -1;
                    `
                  )}
                  style={{ width: `${distance}px` }}
                />
              )}
            </div>
            <div
              className={cx(
                `mt-2 text-sm px-3 py-1 rounded-lg text-center ${
                  currentStep >= step.id
                    ? "bg-primary text-white"
                    : "bg-gray-300 text-gray-500"
                }`,

                currentStep - 1 === index && step?.result === "failed"
                  ? "bg-red-500 text-white "
                  : ""
              )}
            >
              {step.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Stepper;
