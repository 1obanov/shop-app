import React from "react";
import { useContext } from "react";
import { ShopContext } from "../../context/context";
import { Check } from 'lucide-react';

function CheckoutStepper() {
  const { state } = useContext(ShopContext);
  const { currentStep } = state;
  const steps = ["Shipping", "Payment", "Review"];

  return (
    <div className="checkout-stepper">
      {steps.map((step, index) => (
        <div
          key={index}
          className={`checkout-stepper__step ${
            index < currentStep
              ? "completed"
              : index === currentStep
              ? "active"
              : ""
          }`}
        >
          <span className="checkout-stepper__indicator">
            {index < currentStep ? (
              <Check strokeWidth="1.2" size="18" />
            ) : (
              `${index + 1}.`
            )}
          </span>
          <span className="checkout-stepper__title">
          {step}</span>
        </div>
      ))}
    </div>
  );
}

export { CheckoutStepper };
