import { FC, useEffect } from 'react';
import { NotificationType } from './NotificationsProvider';
import Iconify from '@/components/shared/Iconify';

interface NotificationProps {
  notification: NotificationType & { id: string };
  /** Stable remover — pass notification id when calling */
  onDismiss: (id: string) => void;
}

const AUTO_DISMISS_MS = 10_000;

const Notification: FC<NotificationProps> = ({ notification, onDismiss }) => {
  const { id } = notification;

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      onDismiss(id);
    }, AUTO_DISMISS_MS);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [id, onDismiss]);

  let bgColor: string;
  let textColor: string;
  let borderColor: string;
  let icon: string | undefined;

  switch (notification.status) {
    case 'info':
      bgColor = 'bg-blue-500/90';
      textColor = 'text-blue-50';
      borderColor = 'border-blue-400';
      icon = 'fa6-solid:circle-info';
      break;
    case 'error':
      bgColor = 'bg-red-500/90';
      textColor = 'text-red-50';
      borderColor = 'border-red-400';
      icon = 'fa6-solid:triangle-exclamation';
      break;
    case 'success':
      bgColor = 'bg-green-500/90';
      textColor = 'text-green-50';
      borderColor = 'border-green-400';
      icon = 'fa6-solid:circle-check';
      break;
    default:
      bgColor = 'bg-slate-500/90';
      textColor = 'text-on-accent';
      borderColor = 'border-slate-400';
  }

  return (
    <div
      className={`${bgColor} ${textColor} ${borderColor} flex w-full max-w-sm items-center gap-4 rounded-lg border-2 p-4 text-sm font-medium shadow-lg backdrop-blur-sm transition-all duration-500`}
    >
      <button
        type="button"
        aria-label="close"
        onClick={() => onDismiss(id)}
        className="shrink-0 rounded p-1 transition-colors hover:bg-white/20"
      >
        <Iconify icon="fa6-solid:xmark" className="h-4 w-4" />
      </button>
      <p className="flex-1">{notification.message}</p>
      {icon ? (
        <span className="ms-auto shrink-0">
          <Iconify icon={icon} width={24} height={24} />
        </span>
      ) : null}
    </div>
  );
};
export default Notification;
