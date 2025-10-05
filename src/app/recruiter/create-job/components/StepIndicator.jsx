"use client";

import React from "react";

const StepIndicator = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={`flex items-center space-x-3 ${
                currentStep === step.number
                  ? "text-blue-600"
                  : currentStep > step.number
                  ? "text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${
                  currentStep === step.number
                    ? "bg-blue-600 text-white"
                    : currentStep > step.number
                    ? "bg-blue-600 text-white"
                    : "bg-gray-200"
                }`}
              >
                <step.icon className="w-6 h-6" />
              </div>
              <div>
                <div className="text-sm font-medium">
                  Step {step.number}/{steps.length}
                </div>
                <div className="text-sm">{step.title}</div>
              </div>
            </div>
            {index < steps.length - 1 && (
              <div className="w-16 h-px bg-gray-300 mx-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default StepIndicator; 