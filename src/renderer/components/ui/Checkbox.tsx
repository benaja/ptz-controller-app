export function Checkbox({
  value,
  onChange,
  name,
  label,
}: {
  value: boolean;
  name: string;
  onChange: (value: boolean) => void;
  label?: string;
}) {
  return (
    <div>
      <input
        name={name}
        id={name}
        type="checkbox"
        checked={value}
        onChange={(e) => onChange(e.target.checked)}
      />
      {label && (
        <label
          className="ml-2"
          htmlFor={name}
        >
          {label}
        </label>
      )}
    </div>
  );
}
