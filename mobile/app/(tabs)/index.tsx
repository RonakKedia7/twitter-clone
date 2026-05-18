import { RefreshControl, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUserSync } from "@/hooks/useUserSync";
import Header from "@/components/home/Header";
import PostComposer from "@/components/home/PostComposer";
import PostList from "@/components/home/PostList";
import { useState } from "react";
import { usePosts } from "@/hooks/usePost";

const HomeScreen = () => {
  const [isRefetching, setIsRefetching] = useState(false);
  const { refetch: refetchPosts } = usePosts();

  const handlePullToRefresh = async () => {
    setIsRefetching(true);

    await refetchPosts();
    setIsRefetching(false);
  };

  useUserSync();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header />

      <ScrollView
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 80 }}
        refreshControl={
          <RefreshControl
            refreshing={isRefetching}
            onRefresh={handlePullToRefresh}
            tintColor={"#1DA1F2"}
          />
        }
      >
        <PostComposer />
        <PostList />
      </ScrollView>
    </SafeAreaView>
  );
};

export default HomeScreen;
