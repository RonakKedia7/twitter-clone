import { useSSO } from "@clerk/expo";
import { useState } from "react";
import { Alert } from "react-native";

type OAuthStrategy = "oauth_google" | "oauth_apple";

export const useSocialAuth = () => {
  const [loadingProvider, setLoadingProvider] = useState<OAuthStrategy | null>(
    null,
  );

  const { startSSOFlow } = useSSO();

  const handleSocialAuth = async (strategy: OAuthStrategy) => {
    if (loadingProvider) return;

    setLoadingProvider(strategy);

    try {
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch (error) {
      console.log("Error in social auth", error);

      const provider = strategy === "oauth_google" ? "Google" : "Apple";

      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setLoadingProvider(null);
    }
  };

  return {
    handleSocialAuth,
    loadingProvider,
  };
};
