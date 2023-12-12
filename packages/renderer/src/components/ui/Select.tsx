import React from 'react';

interface SelectProps {
  items: Array<{ label: string; value: string }>;
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
}

export default function Select({ items, value, onChange, className, label }: SelectProps) {
  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={label}
          className="block"
        >
          {label}
        </label>
      )}
      <select
        value={value}
        name={label}
        onChange={(e) => onChange(e.target.value)}
      >
        {items.map((item, index) => (
          <option
            key={index}
            value={item.value}
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
