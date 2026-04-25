// Socket.io event utilities for real-time messaging
export const emitMessageEvent = (message, senderId, receiverId, events) => {
  if (!global.io) return;

  try {
    global.io.to(String(receiverId)).emit(events.NEW_MESSAGE, message);
    global.io.to(String(senderId)).emit(events.SENT_MESSAGE, message);
    console.log('DONE');
  } catch (error) {
    console.error('Failed to emit message events:', error);
    throw error;
  }
};

export const emitConversationRead = (receiverId, senderId, events) => {
  if (!global.io) return;

  try {
    global.io.to(String(receiverId)).emit(events.CONVERSATION_READ, {
      by: senderId,
    });
  } catch (error) {
    console.error('Failed to emit conversation read event:', error);
    throw error;
  }
};
