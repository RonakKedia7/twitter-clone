import { View, Text, ActivityIndicator } from "react-native";

const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={"large"} color={"#1DA1F2"} />
      <Text className="text-gray-500 mt-4">Loading notifications...</Text>
    </View>
  );
};

export default Loading;
