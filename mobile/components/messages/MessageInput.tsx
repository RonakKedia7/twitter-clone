import { Feather } from "@expo/vector-icons";
import { TextInput, TouchableOpacity, View } from "react-native";

export default function MessageInput({ value, onChangeText, onSend }: any) {
  return (
    <View className="flex-row items-center px-4 py-3 border-t border-gray-100 bg-white">
      <View className="flex-1 flex-row items-center bg-gray-100 rounded-full px-4 min-h-11 mr-3">
        <TextInput
          value={value}
          onChangeText={onChangeText}
          placeholder="Start a message"
          placeholderTextColor="#657786"
          className="flex-1 text-gray-900 text-[15px]"
          multiline
        />
      </View>

      <TouchableOpacity
        onPress={onSend}
        disabled={!value.trim()}
        className={`size-10 rounded-full items-center justify-center ${
          value.trim() ? "bg-[#1DA1F2]" : "bg-gray-300"
        }`}
      >
        <Feather name="send" size={18} color="white" />
      </TouchableOpacity>
    </View>
  );
}
