const chatService = require("../services/chatService");

exports.getChatById = async (req, res) => {
  const { chatId } = req.body;
  try {
    const chat = await chatService.getChatById(chatId);
    if (!chat) return res.status(404).json({ message: "Not found chat" });

    return res
      .status(200)
      .json({ message: "Query chat successfully", data: chat });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
