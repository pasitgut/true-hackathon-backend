const chat = [
  { chatId: 1, message: "Hi", senderId: 1 },
  { chatId: 1, message: "Hello", senderId: 2 },
];

exports.getChatById = async (id) => {
  return chat.find((chat) => chat.id === id);
};
