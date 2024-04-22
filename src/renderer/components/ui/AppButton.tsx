import { cn } from '@renderer/lib/utils';
import { NavLink } from 'react-router-dom';

export default function AppButton({
  children,
  className,
  to,
  type = 'button',
  ...props
}: {
  children: React.ReactNode;
  className?: string;
  to?: string;
  type?: 'button' | 'submit' | 'reset';
} & React.HTMLAttributes<HTMLButtonElement>) {
  const Component = to ? NavLink : 'button';

  return (
    // @ts-ignore
    <Component
      className={cn(
        'bg-white border border-gray-200 text-black px-2 py-0.5 rounded hover:bg-gray-100',
        className,
      )}
      to={to as string}
      type={type}
      {...(to ? {} : props)}
    >
      {children}
    </Component>
  );
}
