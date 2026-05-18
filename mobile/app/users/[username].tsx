import { useLocalSearchParams, router } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import PostList from "@/components/home/PostList";
import { usePosts } from "@/hooks/usePost";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Feather } from "@expo/vector-icons";
import Loading from "@/components/profile/Loading";

export default function UserProfileScreen() {
  const { username } = useLocalSearchParams<{ username: string }>();

  const { currentUser } = useCurrentUser();

  const {
    user,
    isLoading,
    refetch: refetchProfile,
    isRefetching: isProfileRefetching,
    followUser,
    isFollowLoading,
  } = useUserProfile(username);

  const { refetch: refetchPosts, isRefetching: isPostsRefetching } =
    usePosts(username);

  const isFollowing = currentUser?.following?.includes(user?._id);
  const isOwnProfile = currentUser?._id === user?._id;
  const isRefreshing = isProfileRefetching || isPostsRefetching;
  const insets = useSafeAreaInsets();

  if (isLoading) {
    return <Loading />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white" edges={["top"]}>
      <View className="h-14 px-4 flex-row items-center border-b border-gray-100">
        <TouchableOpacity
          onPress={() => router.back()}
          className="size-10 items-center justify-center rounded-full"
        >
          <Feather name="arrow-left" size={24} color="#111827" />
        </TouchableOpacity>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 100 + insets.bottom }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              refetchProfile();
              refetchPosts();
            }}
            tintColor="#1DA1F2"
          />
        }
      >
        <Image
          source={{
            uri:
              user.bannerImage ||
              "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop",
          }}
          className="w-full h-48"
          resizeMode="cover"
        />

        <View className="px-4 pb-4 border-b border-gray-100">
          <View className="flex-row justify-between items-end -mt-16 mb-4">
            <Image
              source={{ uri: user.profilePicture }}
              className="w-32 h-32 rounded-full border-4 border-white"
            />

            {!isOwnProfile && (
              <TouchableOpacity
                className={`px-6 py-2 rounded-full ${
                  isFollowing ? "bg-white border border-gray-300" : "bg-black"
                }`}
                onPress={() => followUser(user._id)}
                disabled={isFollowLoading}
              >
                {isFollowLoading ? (
                  <ActivityIndicator
                    size="small"
                    color={isFollowing ? "#111827" : "#ffffff"}
                  />
                ) : (
                  <Text
                    className={`font-semibold ${
                      isFollowing ? "text-gray-900" : "text-white"
                    }`}
                  >
                    {isFollowing ? "Following" : "Follow"}
                  </Text>
                )}
              </TouchableOpacity>
            )}
          </View>

          <Text className="text-xl font-bold text-gray-900">
            {user.firstName} {user.lastName}
          </Text>

          <Text className="text-gray-500">@{user.username}</Text>

          {!!user.bio && <Text className="mt-3 text-gray-900">{user.bio}</Text>}

          <View className="flex-row mt-4">
            <Text className="mr-6">
              <Text className="font-bold">{user.following?.length || 0}</Text>{" "}
              Following
            </Text>
            <Text>
              <Text className="font-bold">{user.followers?.length || 0}</Text>{" "}
              Followers
            </Text>
          </View>
        </View>

        <PostList username={username} />
      </ScrollView>
    </SafeAreaView>
  );
}
