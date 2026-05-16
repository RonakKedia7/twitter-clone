import { useApiClient, userApi } from "@/utils/api";
import { useAuth } from "@clerk/expo";
import { useMutation } from "@tanstack/react-query";
import { useEffect } from "react";

export const useUserSync = () => {
  const { isSignedIn } = useAuth();
  const api = useApiClient();

  const syncUserMutation = useMutation({
    mutationFn: () => userApi.syncUser(api),
    onSuccess: (response: any) =>
      console.log("User synced successfully:", response.data.user),
    onError: (error: any) => {
      console.log("User sync failed:", error.response?.data || error.message);
    },
  });

  //   auto-sync user when signed in
  useEffect(() => {
    if (isSignedIn && !syncUserMutation.data) {
      syncUserMutation.mutate();
    }
  }, [isSignedIn]);

  return null;
};
