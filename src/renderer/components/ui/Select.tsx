import React from 'react';
import { cn } from '@renderer/lib/utils';

interface SelectProps {
  items: Array<{ label: string; value: string | number }>;
  value: string | number | null;
  onChange: (value: string | number | null) => void;
  className?: string;
  label?: string;
  required?: boolean;
}

export default function Select({
  items,
  value,
  onChange,
  className,
  label,
  required,
}: SelectProps) {
  function onChangeHandler(value: string) {
    const itemValue = items.find((item) => `${item.value}` == value)?.value;
    console.log('onChangeHandler', value, itemValue);

    onChange(itemValue === undefined ? null : itemValue);
  }

  return (
    <div className={cn('max-w-full w-full', className)}>
      {label && (
        <label
          htmlFor={label}
          className="block"
        >
          {label}
        </label>
      )}
      <select
        value={value === null ? '' : value}
        name={label}
        onChange={(e) => onChangeHandler(e.target.value)}
        required={required}
        className="max-w-full w-full"
      >
        <option
          className="text-gray-600"
          value={''}
        >
          Select an option
        </option>
        {items.map((item, index) => (
          <option
            key={index}
            value={item.value}
            className="max-w-[400px] overflow-hidden"
          >
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
}
