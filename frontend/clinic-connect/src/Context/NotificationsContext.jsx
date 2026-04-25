import { useState, useEffect, createContext } from "react";
import axios from "axios";

export const NotificationsContext = createContext();
export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/v1/notifications/");
      console.log(response.data, "notifications data ya annie");
      setNotifications(response.data.notifications);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        setNotifications,
        loading,
        setLoading,
        error,
        setError,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}
