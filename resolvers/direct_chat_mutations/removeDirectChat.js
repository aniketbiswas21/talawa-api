const DirectChat = require('../../models/DirectChat');
const DirectChatMessage = require('../../models/DirectChatMessage');
const { NotFoundError } = require('errors');
const requestContext = require('talawa-request-context');

// admins of the organization can remove chats -- may change in the future

module.exports = async (parent, args) => {
  const chat = await DirectChat.findById(args.chatId);
  if (!chat) {
    throw new NotFoundError(
      requestContext.translate('chat.notFound'),
      'chat.notFound',
      'chat'
    );
  }

  // delete all messages in the chat
  await DirectChatMessage.deleteMany({
    _id: {
      $in: [...chat.messages],
    },
  });

  await DirectChat.deleteOne({ _id: args.chatId });

  return chat;
};
