import React, {
  ReactNode,
  createContext,
  useCallback,
  useContext,
  useState,
} from 'react';
import Notification from '@/components/layout/Notification';

export type NotificationType = {
  message: string;
  status: 'info' | 'error' | 'success';
};

type NotificationItem = NotificationType & { id: string };

const NotificationContext = createContext<
  ((notification: NotificationType) => void) | undefined
>(undefined);

export function useNotification() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      'useNotification must be used within a NotificationProvider',
    );
  }
  return context;
}

export default function NotificationsProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const addNotification = useCallback((notification: NotificationType) => {
    const id =
      typeof crypto !== 'undefined' && 'randomUUID' in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    setNotifications((prev) => [...prev, { ...notification, id }]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return (
    <NotificationContext.Provider value={addNotification}>
      {children}
      <div className="fixed top-24 right-4 z-50 flex max-w-sm flex-col gap-2">
        {notifications.map((n) => (
          <Notification
            key={n.id}
            notification={n}
            onDismiss={removeNotification}
          />
        ))}
      </div>
    </NotificationContext.Provider>
  );
}
