import { Feather } from "@expo/vector-icons";
import { Image, Text, TouchableOpacity, View } from "react-native";

export default function ConversationItem({
  conversation,
  onPress,
  onLongPress,
}: any) {
  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      onLongPress={onLongPress}
      className="flex-row px-4 py-4 border-b border-gray-100"
    >
      <Image
        source={{ uri: conversation.user.avatar }}
        className="size-14 rounded-full"
      />

      <View className="flex-1 ml-3">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Text
              className="text-gray-900 font-bold text-[15px]"
              numberOfLines={1}
            >
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

            <Text className="text-gray-500 text-[14px] ml-1" numberOfLines={1}>
              @{conversation.user.username}
            </Text>
          </View>

          <Text className="text-gray-500 text-[13px]">{conversation.time}</Text>
        </View>

        <Text numberOfLines={1} className="text-gray-500 text-[15px] mt-1">
          {conversation.lastMessage}
        </Text>
      </View>
    </TouchableOpacity>
  );
}
