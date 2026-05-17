import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSync } from "@/hooks/useUserSync";
import Header from "@/components/home/Header";
import PostComposer from "@/components/home/PostComposer";

const HomeScreen = () => {
  useUserSync();
  return (
    <SafeAreaView className="flex-1">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <PostComposer />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
