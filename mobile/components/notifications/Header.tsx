import { View, Text, TouchableOpacity } from "react-native";
import { Feather } from "@expo/vector-icons";

const Header = () => {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
      <Text className="text-xl font-bold text-gray-900">Notifications</Text>
      <TouchableOpacity>
        <Feather name="settings" size={24} color={"#657786"} />
      </TouchableOpacity>
    </View>
  );
};

export default Header;
