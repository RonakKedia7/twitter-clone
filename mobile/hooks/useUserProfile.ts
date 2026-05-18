import { useApiClient, userApi } from "@/utils/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useUserProfile = (username?: string) => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const {
    data: user,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ["userProfile", username],
    queryFn: () => userApi.getUserProfile(api, username!),
    enabled: !!username,
    select: (response) => response.data.user,
  });

  const followUserMutation = useMutation({
    mutationFn: (targetUserId: string) => userApi.followUser(api, targetUserId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      queryClient.invalidateQueries({ queryKey: ["userProfile", username] });
    },
  });

  const followUser = (targetUserId: string) => {
    followUserMutation.mutate(targetUserId);
  };

  return {
    user,
    isLoading,
    error,
    refetch,
    isRefetching,
    followUser,
    isFollowLoading: followUserMutation.isPending,
  };
};
