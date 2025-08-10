const messageService = require("../services/messageService");

exports.getAllMesssage = async (req, res) => {
  try {
    const message = await messageService.getMessage();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
