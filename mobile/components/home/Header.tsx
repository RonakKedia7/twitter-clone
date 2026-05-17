import { Ionicons } from "@expo/vector-icons";
import { View, Text } from "react-native";
import SignOutButton from "../SignOutButton";

const Header = () => {
  return (
    <View className="flex-row justify-between items-center px-4 py-3 border-b border-gray-100">
      <Ionicons name="logo-twitter" size={24} color={"#1DA1F2"} />
      <Text className="text-xl font-bold text-gray-900">Home</Text>
      <SignOutButton />
    </View>
  );
};

export default Header;
