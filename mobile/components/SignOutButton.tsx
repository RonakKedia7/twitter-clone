import { TouchableOpacity, View } from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useSignOut } from "@/hooks/useSignOut";

const SignOutButton = () => {
  const { handleSignOut } = useSignOut();

  return (
    <TouchableOpacity
      onPress={handleSignOut}
      activeOpacity={0.7}
      className="rounded-full"
    >
      <View className="bg-red-50 p-2 rounded-full border border-red-100">
        <MaterialCommunityIcons name="logout" size={22} color="#E0245E" />
      </View>
    </TouchableOpacity>
  );
};

export default SignOutButton;
