import React, { useId } from 'react';
import { bdDistricts } from '../data/bdDistricts';

/**
 * DistrictAutocomplete
 * Props:
 *  - value: current selected district (string)
 *  - onChange: (newValue:string) => void
 *  - required?: boolean
 */
export default function DistrictAutocomplete({ value, onChange, required=false }) {
  const listId = useId();
  return (
    <div>
      <label className="block text-sm text-gray-700 mb-1">District* (type to search)</label>
      <input
        list={listId}
        name="city"
        value={value}
        required={required}
        onChange={(e)=>onChange(e.target.value)}
        placeholder="Start typing e.g. Dha..."
        className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <datalist id={listId}>
        {bdDistricts.map(d => <option key={d} value={d} />)}
      </datalist>
      <div className="mt-1 text-[10px] text-gray-500 flex gap-2">
        <span>Can't find? See full list.</span>
      </div>
    </div>
  );
}
