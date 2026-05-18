import { View, Text } from "react-native";
import SignOutButton from "../SignOutButton";

interface HeaderProps {
  firstName: string;
  lastName: string;
  numberOfPosts: number;
}

export default function Header({
  firstName,
  lastName,
  numberOfPosts,
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
      <View>
        <Text className="text-xl font-bold text-gray-900">
          {firstName} {lastName}
        </Text>
        <Text className="text-gray-500 text-sm">{numberOfPosts} Posts</Text>
      </View>
      <SignOutButton />
    </View>
  );
}
