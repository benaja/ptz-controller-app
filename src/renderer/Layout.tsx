import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { cn } from './lib/utils';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { HistoryProvider, useHistoryContext } from './providers/HistoryProvider';

type Tab = {
  id: string;
  label: string;
};

export default function Layout({
  children,
  title,
  actions,
}: {
  children: React.ReactNode;
  title: string;
  actions?: React.ReactNode;
}) {
  const navigate = useNavigate();
  const { canGoBack, canGoForward, goBack, goForward } = useHistoryContext();

  const tabs: Tab[] = [
    {
      id: 'gamepads',
      label: 'Gamepads',
    },
    {
      id: 'cameras',
      label: 'Cameras',
    },
    {
      id: 'video-mixers',
      label: 'Video Mixers',
    },
  ];

  return (
    <div className="min-h-screen flex">
      <div className="w-[200px] bg-transparent p-4 space-y-1">
        {tabs.map((tab) => (
          <NavLink
            to={`/${tab.id}`}
            className={({ isActive }) =>
              cn(
                {
                  'bg-blue-600 text-white': isActive,
                  'hover:bg-gray-200 text-gray-500': !isActive,
                },
                'block w-full text-left rounded px-2 py-1  text-sm',
              )
            }
            key={tab.id}
          >
            {tab.label}
          </NavLink>
        ))}
      </div>
      <div className="p-4 bg-gray-50 grow">
        <div className="flex items-center gap-2 mb-4">
          <button
            className={cn(
              {
                'opacity-40 cursor-not-allowed': !canGoBack,
              },
              'py-0.5 px-1 rounded hover:bg-gray-100',
            )}
            onClick={() => goBack()}
          >
            <ChevronLeftIcon className="h-6 w-6 text-gray-600" />
          </button>
          <button
            className={cn(
              {
                'opacity-40 cursor-not-allowed': !canGoForward,
              },
              'py-0.5 px-1 rounded hover:bg-gray-100',
            )}
            onClick={() => goForward()}
          >
            <ChevronRightIcon className="h-6 w-6 text-gray-600" />
          </button>
          <h1 className="font-bold text-lg  text-gray-800">{title}</h1>

          {actions && <div className="ml-auto">{actions}</div>}
        </div>
        {children}
        {/* <ManageGamepads /> */}
      </div>
    </div>
  );
}
