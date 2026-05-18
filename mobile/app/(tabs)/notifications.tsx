import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { useNotifications } from "@/hooks/useNotifications";
import NotificationError from "@/components/notifications/NotificationError";
import Header from "@/components/notifications/Header";
import { ActivityIndicator, ScrollView, Text, View } from "react-native";
import NoNotificationsFound from "@/components/notifications/NoNotificationsFound";
import { Notification } from "@/types";
import Loading from "@/components/notifications/Loading";
import NotificationCard from "@/components/notifications/NotificationCard";

const NotificationScreen = () => {
  const {
    notifications,
    isLoading,
    error,
    refetch,
    isRefetching,
    deleteNotification,
    isDeletingNotification,
  } = useNotifications();
  const insets = useSafeAreaInsets();

  if (error) {
    console.log(error);
    return <NotificationError refetch={refetch} />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <Header />

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
      >
        {isLoading ? (
          <Loading />
        ) : notifications.length === 0 ? (
          <NoNotificationsFound />
        ) : (
          notifications.map((notification: Notification) => {
            return (
              <NotificationCard
                key={notification._id}
                notification={notification}
                onDelete={deleteNotification}
              />
            );
          })
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationScreen;
