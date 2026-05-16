import { CATEGORIES, TRENDING_TOPICS } from "@/data/trendingTopics";
import { Feather } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const SearchScreen = () => {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  const filteredTopics = useMemo(() => {
    return TRENDING_TOPICS.filter((item) => {
      const matchesSearch =
        item.topic.toLowerCase().includes(search.toLowerCase()) ||
        item.category.toLowerCase().includes(search.toLowerCase());

      const matchesCategory =
        activeCategory === "All" || item.category === activeCategory;

      return matchesSearch && matchesCategory;
    });
  }, [search, activeCategory]);

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="px-4 py-3 border-b border-gray-100">
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 h-12">
          <Feather name="search" size={20} color="#657786" />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search topics, cricket, politics..."
            className="flex-1 ml-3 text-base text-gray-900"
            placeholderTextColor="#657786"
          />

          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Feather name="x-circle" size={20} color="#657786" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="py-3 border-b border-gray-100">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
          >
            {CATEGORIES.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setActiveCategory(category)}
                className={`px-5 py-2 rounded-full ${
                  activeCategory === category ? "bg-black" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`font-semibold ${
                    activeCategory === category ? "text-white" : "text-gray-700"
                  }`}
                >
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View className="px-4 pt-4">
          <Text className="text-2xl font-extrabold text-gray-900">
            {search ? "Search results" : "Trending for you"}
          </Text>

          <Text className="text-gray-500 mt-1 mb-3">
            {filteredTopics.length} topics found
          </Text>

          {filteredTopics.length === 0 ? (
            <View className="items-center justify-center py-20">
              <Feather name="search" size={42} color="#9CA3AF" />
              <Text className="text-lg font-bold text-gray-900 mt-4">
                No results found
              </Text>
              <Text className="text-gray-500 mt-1">
                Try searching something else
              </Text>
            </View>
          ) : (
            filteredTopics.map(({ topic, tweets, category }, index) => (
              <TouchableOpacity
                key={index}
                activeOpacity={0.7}
                className="py-4 border-b border-gray-100"
              >
                <View className="flex-row justify-between">
                  <Text className="text-gray-500 text-sm">
                    Trending in {category}
                  </Text>
                  <Feather name="more-horizontal" size={20} color="#657786" />
                </View>

                <Text className="font-extrabold text-gray-900 text-lg mt-1">
                  {topic}
                </Text>

                <Text className="text-gray-500 text-sm mt-1">
                  {tweets} posts
                </Text>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SearchScreen;
