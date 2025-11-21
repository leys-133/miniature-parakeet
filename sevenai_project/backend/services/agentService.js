/**
 * Agent service responsible for constructing prompts and interfacing
 * with the underlying AI model. This layer encapsulates the logic
 * required to include the system prompt, chat history and latest
 * user message. It can also detect and handle tool invocations.
 */

const { SEVENAI_SYSTEM_PROMPT } = require('../agent/sevenaiPersonality');
const tools = require('../agent/tools');
// If you integrate with an AI provider (e.g. OpenAI), import the SDK here.

/**
 * Builds an array of messages for the AI model. The array includes the
 * system prompt, previous chat history and the new user message. The
 * format matches the structure expected by most chat completion APIs.
 *
 * @param {Array<{ role: string, content: string }>} history Existing chat messages
 * @param {string} userMessage The latest message from the user
 * @returns {Array<{ role: string, content: string }>}
 */
function buildMessages(history, userMessage) {
  const messages = [];

  // Include the system prompt as the first message
  messages.push({ role: 'system', content: SEVENAI_SYSTEM_PROMPT });

  // Append previous history if provided
  if (Array.isArray(history)) {
    history.forEach((msg) => {
      // Ensure each historical message has the required shape
      if (msg.role && msg.content) {
        messages.push({ role: msg.role, content: msg.content });
      }
    });
  }

  // Append the new user message
  messages.push({ role: 'user', content: userMessage });
  return messages;
}

/**
 * Sends a chat request to the AI model. This version contains a
 * placeholder implementation that returns a canned response. When
 * integrating with a real model, replace the body of this function
 * accordingly and handle tool invocations detected in the AI's
 * response.
 *
 * @param {Array<{ role: string, content: string }>} messages The message array including system and user content
 * @returns {Promise<string>} The assistant's reply
 */
async function sendChatRequest(messages) {
  // TODO: integrate with AI provider such as OpenAI's ChatCompletion API.
  // Here we simply echo the last user message prefixed with a friendly greeting.
  const latestUserMessage = messages[messages.length - 1];
  return `لقد قلت: "${latestUserMessage.content}". هذه استجابة تجريبية من SevenAI.`;
}

/**
 * Public method used by the chat service. It assembles the messages
 * array and processes any tool calls requested by the AI. For now
 * tool handling is not implemented, but this function is ready to be
 * extended. It returns the final reply to the user.
 *
 * @param {Array<{ role: string, content: string }>} history Previous conversation context
 * @param {string} userMessage The latest message from the user
 * @returns {Promise<string>} The AI's reply
 */
async function getAgentReply(history, userMessage) {
  const messages = buildMessages(history, userMessage);

  // Send the messages to the AI model and get a response
  let reply = await sendChatRequest(messages);

  // Placeholder: Detect and handle tool calls inside the reply
  // For a real implementation, you would parse the model's response
  // to see if it wants to invoke any of the tools defined in
  // ../agent/tools.js and call those functions accordingly.

  return reply;
}

module.exports = {
  buildMessages,
  getAgentReply,
};