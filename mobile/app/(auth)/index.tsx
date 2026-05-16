import { useSocialAuth } from "@/hooks/useSocialAuth";
import {
  ActivityIndicator,
  Image,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function AuthScreen() {
  const { handleSocialAuth, loadingProvider } = useSocialAuth();

  const isGoogleLoading = loadingProvider === "oauth_google";
  const isAppleLoading = loadingProvider === "oauth_apple";
  return (
    <View className="flex-1 bg-white">
      <View className="flex-1 px-8 justify-between">
        <View className="flex-1 justify-center">
          {/* DEMO IMAGE */}
          <View className="items-center">
            <Image
              source={require("@/assets/images/auth2.png")}
              className="size-80"
              resizeMode="contain"
            />
          </View>

          <View className="flex-col gap-2 mt-4">
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-200 rounded-full h-16 py-3 px-6"
              onPress={() => handleSocialAuth("oauth_google")}
              disabled={!!loadingProvider}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isGoogleLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("@/assets/images/google.png")}
                    className="mr-3 size-10"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Google
                  </Text>
                </View>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              className="flex-row items-center justify-center bg-white border border-gray-200 rounded-full h-16 py-3 px-6"
              onPress={() => handleSocialAuth("oauth_apple")}
              disabled={!!loadingProvider}
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.1,
                shadowRadius: 2,
                elevation: 2,
              }}
            >
              {isAppleLoading ? (
                <ActivityIndicator size="small" color="#000" />
              ) : (
                <View className="flex-row items-center justify-center">
                  <Image
                    source={require("@/assets/images/apple.png")}
                    className="mr-3 size-8"
                    resizeMode="contain"
                  />
                  <Text className="text-black font-medium text-base">
                    Continue with Apple
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>

          <Text className="text-center text-gray-500 text-xs leading-4 mt-6 px-2">
            By signing up, you agree to our{" "}
            <Text className="text-blue-500">Terms</Text>
            {","}
            <Text className="text-blue-500">Privacy Policy</Text>
            {", and "}
            <Text className="text-blue-500">Cookie Use</Text>
          </Text>
        </View>
      </View>
    </View>
  );
}
