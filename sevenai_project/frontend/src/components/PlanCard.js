import React from 'react';

/**
 * Reusable component for displaying subscription plans. Shows the
 * plan name, price and message limit if provided. A button allows the
 * user to select the plan; the click handler should be passed via
 * props.
 *
 * Colors are derived from Tailwind theme (primary for buttons and
 * accent for badges).
 */
function PlanCard({ plan, onSelect }) {
  return (
    <div className="border rounded p-4 shadow-sm flex flex-col justify-between">
      <div>
        <h3 className="text-xl font-bold mb-2 text-primary">{plan.name}</h3>
        <p className="text-3xl font-semibold mb-2">
          ${plan.price}
          <span className="text-sm">{plan.durationMonths ? ' / شهر' : ''}</span>
        </p>
        {plan.messageLimit ? (
          <span className="inline-block bg-accent text-white px-2 py-1 rounded text-xs mb-2">
            حد الرسائل: {plan.messageLimit}
          </span>
        ) : (
          <span className="inline-block bg-accent text-white px-2 py-1 rounded text-xs mb-2">
            رسائل غير محدودة
          </span>
        )}
      </div>
      <button
        onClick={() => onSelect(plan.code)}
        className="mt-4 bg-primary text-white py-2 rounded hover:bg-green-800"
      >
        اختر هذه الخطة
      </button>
    </div>
  );
}

export default PlanCard;