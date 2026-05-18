import { View, ActivityIndicator } from "react-native";

const Loading = () => {
  return (
    <View className="flex-1 items-center justify-center p-8">
      <ActivityIndicator size={"large"} color={"#1DA1F2"} />
    </View>
  );
};

export default Loading;
