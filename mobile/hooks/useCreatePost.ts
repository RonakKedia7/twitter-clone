import { useApiClient } from "@/utils/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import { Alert } from "react-native";

type CreatePostPayload = {
  content: string;
  imageUri?: string;
};

const getImageInfo = (uri: string) => {
  const extension = uri.split(".").pop()?.toLowerCase() || "jpg";

  const mimeTypeMap: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
  };

  return {
    name: `post-image.${extension}`,
    type: mimeTypeMap[extension] || "image/jpeg",
  };
};

export const useCreatePost = () => {
  const api = useApiClient();
  const queryClient = useQueryClient();

  const [content, setContent] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const createPostMutation = useMutation({
    mutationFn: async ({ content, imageUri }: CreatePostPayload) => {
      const formData = new FormData();

      if (content.trim()) {
        formData.append("content", content.trim());
      }

      if (imageUri) {
        const imageInfo = getImageInfo(imageUri);

        formData.append("image", {
          uri: imageUri,
          name: imageInfo.name,
          type: imageInfo.type,
        } as any);
      }

      const response = await api.post("/posts", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      return response.data;
    },

    onSuccess: (data) => {
      setContent("");
      setSelectedImage(null);

      const createdPost = data.post || data;

      queryClient.setQueryData(["posts"], (oldData: any) => {
        if (!oldData) return oldData;

        if (Array.isArray(oldData)) {
          return [createdPost, ...oldData];
        }

        return {
          ...oldData,
          posts: [createdPost, ...(oldData.posts || [])],
        };
      });

      queryClient.invalidateQueries({ queryKey: ["posts"] });

      Alert.alert("Success", "Post created successfully!");
    },

    onError: (error) => {
      console.log("Create post error:", error);
      Alert.alert("Error", "Failed to create post. Please try again.");
    },
  });

  const handleImagePicker = async (source: "camera" | "gallery") => {
    try {
      const permission =
        source === "camera"
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Permission needed",
          `Please allow access to your ${
            source === "camera" ? "camera" : "photo library"
          }.`,
        );
        return;
      }

      const options: ImagePicker.ImagePickerOptions = {
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [16, 9],
        quality: 0.8,
      };

      const result =
        source === "camera"
          ? await ImagePicker.launchCameraAsync(options)
          : await ImagePicker.launchImageLibraryAsync(options);

      if (result.canceled) return;

      const imageUri = result.assets?.[0]?.uri;

      if (!imageUri) {
        Alert.alert("Error", "Could not select image.");
        return;
      }

      setSelectedImage(imageUri);
    } catch (error) {
      console.log("Image picker error:", error);
      Alert.alert("Error", "Something went wrong while selecting image.");
    }
  };

  const createPost = () => {
    const trimmedContent = content.trim();

    if (!trimmedContent && !selectedImage) {
      Alert.alert(
        "Empty Post",
        "Please write something or add an image before posting!",
      );
      return;
    }

    if (createPostMutation.isPending) return;

    createPostMutation.mutate({
      content: trimmedContent,
      imageUri: selectedImage || undefined,
    });
  };

  return {
    content,
    setContent,
    selectedImage,
    removeImage: () => setSelectedImage(null),
    isCreating: createPostMutation.isPending,
    createPost,
    pickImageFromGallery: () => handleImagePicker("gallery"),
    takePhoto: () => handleImagePicker("camera"),
  };
};
