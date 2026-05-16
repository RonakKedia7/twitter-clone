import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ChatHeader({ conversation, onBack }: any) {
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-gray-100 bg-white">
      <TouchableOpacity onPress={onBack} className="mr-4">
        <Feather name="arrow-left" size={24} color="#1DA1F2" />
      </TouchableOpacity>

      <Image
        source={{ uri: conversation.user.avatar }}
        className="size-10 rounded-full mr-3"
      />

      <View>
        <View className="flex-row items-center">
          <Text className="text-gray-900 font-bold text-[16px]">
            {conversation.user.name}
          </Text>

          {conversation.user.verified && (
            <Feather
              name="check-circle"
              size={15}
              color="#1DA1F2"
              style={{ marginLeft: 4 }}
            />
          )}
        </View>

        <Text className="text-gray-500 text-sm">
          @{conversation.user.username}
        </Text>
      </View>
    </View>
  );
}
