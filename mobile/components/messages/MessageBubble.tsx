import { Image, Text, View } from "react-native";

export default function MessageBubble({ message, avatar }: any) {
  return (
    <View className={`flex-row mb-4 ${message.fromUser ? "justify-end" : ""}`}>
      {!message.fromUser && (
        <Image
          source={{ uri: avatar }}
          className="size-8 rounded-full mr-2 self-end"
        />
      )}

      <View className={`max-w-[80%] ${message.fromUser ? "items-end" : ""}`}>
        <View
          className={`rounded-3xl px-4 py-3 ${
            message.fromUser ? "bg-[#1DA1F2]" : "bg-gray-100"
          }`}
        >
          <Text
            className={`text-[15px] leading-5 ${
              message.fromUser ? "text-white" : "text-gray-900"
            }`}
          >
            {message.text}
          </Text>
        </View>

        <Text className="text-gray-400 text-xs mt-1">{message.time}</Text>
      </View>
    </View>
  );
}
