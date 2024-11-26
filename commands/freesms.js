const axios = require('axios');

module.exports = {
  name: "freesms",
  credits: "Deku", // converted to NashBot by Joshua Apostol
  description: "Send free SMS using the Kenlie Jugarap API.",
  aliases: ["sms"],
  cooldown: 5,
  nashPrefix: false,
  execute: async (api, event, args) => {
    const { threadID, messageID } = event;
    const reply = (msg) => api.sendMessage(msg, threadID, messageID);

    // Extract phone number and message from arguments
    const [phoneNumber, ...messageParts] = args;
    const message = messageParts.join(' ');

    // Validation: Ensure both phone number and message are provided
    if (!phoneNumber || !message) {
      return reply("Invalid usage. Use the command as follows:\n\nfreesms <phone_number> <message>");
    }

    try {
      // Make the API call
      const response = await axios.get(
        `https://api.kenliejugarap.com/freesmslbc/?number=${encodeURIComponent(
          phoneNumber
        )}&message=${encodeURIComponent(message)}`
      );

      // Check API response status
      if (response.data.status === "success") {
        reply(`📤 | SMS sent successfully to ${phoneNumber}!\n\nMessage:\n${message}`);
      } else {
        reply(`❌ | Failed to send SMS. Reason: ${response.data.message}`);
      }
    } catch (error) {
      console.error(error); // Log the error for debugging purposes
      reply("❌ | An error occurred while sending the SMS. Please try again later.");
    }
  },
};
