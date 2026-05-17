import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSync } from "@/hooks/useUserSync";
import Header from "@/components/home/Header";
import PostComposer from "@/components/home/PostComposer";
import PostList from "@/components/home/PostList";

const HomeScreen = () => {
  useUserSync();
  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
        <PostList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
