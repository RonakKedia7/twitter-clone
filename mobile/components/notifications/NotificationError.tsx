import { View, Text, TouchableOpacity } from "react-native";
import React from "react";

const NotificationError = ({ refetch }: { refetch: () => void }) => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <Text className="text-gray-500 mb-4">Failed to load notifications</Text>
      <TouchableOpacity
        className="bg-blue-500 px-4 py-2 rounded-lg"
        onPress={() => refetch()}
      >
        <Text className="text-white font-semibold">Retry</Text>
      </TouchableOpacity>
    </View>
  );
};

export default NotificationError;
