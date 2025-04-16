import { useEffect, useState } from 'react';

export default function Notification({
  message,
  type = 'success',
  duration = 3000,
}) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div className={`notification notification-${type}`}>
      <p>{message}</p>
    </div>
  );
}
