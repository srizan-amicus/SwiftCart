type CheckoutStepsProps = {
  activeStep: 1 | 2 | 3;
};

const STEPS = [
  { number: 1, label: "Shipping" },
  { number: 2, label: "Payment" },
  { number: 3, label: "Review" },
] as const;

export default function CheckoutSteps({ activeStep }: CheckoutStepsProps) {
  return (
    <nav aria-label="Checkout progress" className="w-full">
      <ol className="flex items-center">
        {STEPS.map((step, index) => {
          const isCompleted = step.number < activeStep;
          const isActive = step.number === activeStep;

          return (
            <li
              key={step.number}
              className="flex flex-1 items-center last:flex-none"
            >
              <div className="flex flex-col items-center gap-2">
                <span
                  className={`flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold ${
                    isCompleted
                      ? "bg-orange-100 text-orange-700"
                      : isActive
                        ? "bg-orange-500 text-white"
                        : "bg-gray-100 text-gray-500"
                  }`}
                  aria-current={isActive ? "step" : undefined}
                >
                  {step.number}
                </span>

                <span
                  className={`whitespace-nowrap text-xs font-medium sm:text-sm ${
                    isActive || isCompleted
                      ? "text-orange-600"
                      : "text-gray-500"
                  }`}
                >
                  {step.label}
                </span>
              </div>

              {index < STEPS.length - 1 && (
                <div
                  className={`mx-3 mb-6 h-0.5 flex-1 sm:mx-5 ${
                    isCompleted ? "bg-orange-400" : "bg-gray-200"
                  }`}
                  aria-hidden="true"
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
