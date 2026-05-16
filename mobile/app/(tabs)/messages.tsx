import ChatHeader from "@/components/messages/ChatHeader";
import ConversationItem from "@/components/messages/ConversationItem";
import MessageBubble from "@/components/messages/MessageBubble";
import MessageInput from "@/components/messages/MessageInput";
import { CONVERSATIONS, ConversationType } from "@/data/coversations";
import { filterConversations } from "@/utils/filterConversations";
import { Feather } from "@expo/vector-icons";
import { useEffect, useMemo, useState } from "react";
import {
  Alert,
  BackHandler,
  FlatList,
  Modal,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function MessagesScreen() {
  const insets = useSafeAreaInsets();

  const [searchText, setSearchText] = useState("");
  const [conversationsList, setConversationsList] = useState(CONVERSATIONS);
  const [selectedConversation, setSelectedConversation] =
    useState<ConversationType | null>(null);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const filteredConversations = useMemo(() => {
    return filterConversations(conversationsList, searchText);
  }, [conversationsList, searchText]);

  const closeChatModal = () => {
    setSelectedConversation(null);
    setIsChatOpen(false);
    setNewMessage("");
  };

  useEffect(() => {
    const backAction = () => {
      if (isChatOpen) {
        closeChatModal();
        return true;
      }

      return false;
    };

    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction,
    );

    return () => subscription.remove();
  }, [isChatOpen]);

  const deleteConversation = (conversationId: number) => {
    Alert.alert(
      "Delete Conversation",
      "Are you sure you want to delete this conversation?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setConversationsList((prev) =>
              prev.filter((conv) => conv.id !== conversationId),
            );
          },
        },
      ],
    );
  };

  const openConversation = (conversation: ConversationType) => {
    setSelectedConversation(conversation);
    setIsChatOpen(true);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    setConversationsList((prev) =>
      prev.map((conv) =>
        conv.id === selectedConversation.id
          ? { ...conv, lastMessage: newMessage, time: "now" }
          : conv,
      ),
    );

    setNewMessage("");
  };

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-100">
        <Text className="text-2xl font-extrabold text-gray-900">Messages</Text>

        <TouchableOpacity className="size-10 rounded-full items-center justify-center">
          <Feather name="edit-2" size={22} color="#1DA1F2" />
        </TouchableOpacity>
      </View>

      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 h-11">
          <Feather name="search" size={18} color="#657786" />

          <TextInput
            placeholder="Search Direct Messages"
            placeholderTextColor="#657786"
            className="flex-1 ml-3 text-gray-900 text-[15px]"
            value={searchText}
            onChangeText={setSearchText}
          />

          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText("")}>
              <Feather name="x-circle" size={18} color="#657786" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <FlatList
        data={filteredConversations}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        renderItem={({ item }) => (
          <ConversationItem
            conversation={item}
            onPress={() => openConversation(item)}
            onLongPress={() => deleteConversation(item.id)}
          />
        )}
        ListEmptyComponent={
          <View className="items-center justify-center px-8 py-24">
            <Feather name="mail" size={42} color="#9CA3AF" />
            <Text className="text-xl font-bold text-gray-900 mt-4">
              No messages found
            </Text>
            <Text className="text-gray-500 text-center mt-2">
              Try searching for another user or conversation.
            </Text>
          </View>
        }
      />

      <Modal
        visible={isChatOpen}
        animationType="slide"
        onRequestClose={closeChatModal}
      >
        {selectedConversation && (
          <SafeAreaView className="flex-1 bg-white">
            <ChatHeader
              conversation={selectedConversation}
              onBack={closeChatModal}
            />

            <FlatList
              data={selectedConversation.messages}
              keyExtractor={(item) => item.id.toString()}
              contentContainerStyle={{ padding: 16 }}
              renderItem={({ item }) => (
                <MessageBubble
                  message={item}
                  avatar={selectedConversation.user.avatar}
                />
              )}
            />

            <MessageInput
              value={newMessage}
              onChangeText={setNewMessage}
              onSend={sendMessage}
            />
          </SafeAreaView>
        )}
      </Modal>
    </SafeAreaView>
  );
}
