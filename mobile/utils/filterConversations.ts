export const filterConversations = (
  conversations: any[],
  searchText: string,
) => {
  const query = searchText.trim().toLowerCase();

  if (!query) return conversations;

  return conversations.filter((conversation) => {
    return (
      conversation.user.name.toLowerCase().includes(query) ||
      conversation.user.username.toLowerCase().includes(query) ||
      conversation.lastMessage.toLowerCase().includes(query)
    );
  });
};
