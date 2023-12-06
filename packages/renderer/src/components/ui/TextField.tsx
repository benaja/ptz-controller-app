type Props = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'onChange' | 'className' | 'value'
> & {
  value: string;
  onChange: (value: string) => void;
  className?: string;
  label?: string;
};

export default function TextField({ value, onChange, className, label, ...props }: Props) {
  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
      <input
        className="w-full bg-white rounded px-1 py-0.5 focus-visible:outline-blue-600 text-base border border-gray-200 outline-1"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        {...props}
      />
    </div>
  );
}
