import { cn } from '@renderer/lib/utils';

export default function Container({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn('px-2 bg-gray-100 border border-gray-200 rounded-lg', className)}>
      {children}
    </div>
  );
}
