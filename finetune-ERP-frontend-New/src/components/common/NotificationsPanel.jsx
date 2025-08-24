import { useAppSelector } from '../../redux/hook';

function NotificationsPanel() {
  const items = useAppSelector((state) => state.notifications.items);
  return (
    <div className="absolute right-0 mt-2 w-64 bg-white border border-keyline rounded shadow-md max-h-64 overflow-y-auto">
      {items.length === 0 && (
        <div className="p-4 text-sm text-gray-500">No notifications</div>
      )}
      {items.map((n) => (
        <div
          key={n.id}
          className="p-2 text-sm border-b border-keyline last:border-none"
        >
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default NotificationsPanel;
