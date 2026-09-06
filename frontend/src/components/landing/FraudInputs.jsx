import React from "react";

export default function FraudInputs({ inputs, setInputs }) {
  return (
    <>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Transaction Amount ($)</label>
        <input
          type="number"
          placeholder="e.g. 1250"
          value={inputs.amount}
          onChange={(e) => setInputs({ ...inputs, amount: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Distance from Home (Miles)</label>
        <input
          type="number"
          placeholder="e.g. 450"
          value={inputs.distance_from_home}
          onChange={(e) => setInputs({ ...inputs, distance_from_home: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
      <div>
        <label className="block text-xs font-medium text-[#8A93A6] mb-1">Velocity (1-Hour Transactions)</label>
        <input
          type="number"
          placeholder="e.g. 4"
          value={inputs.velocity_1h}
          onChange={(e) => setInputs({ ...inputs, velocity_1h: e.target.value })}
          className="w-full input-dark px-3.5 py-2.5"
        />
      </div>
    </>
  );
}
