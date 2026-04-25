export const validateMessageInput = ({ sender_id, receiver_id, content }) => {
  if (!sender_id) return 'Sender is required';
  if (!receiver_id) return 'Receiver is required';
  if (!content || String(content).trim().length === 0)
    return 'Content is required';
  if (String(sender_id) === String(receiver_id))
    return 'Cannot send message to yourself';
  return null;
};
