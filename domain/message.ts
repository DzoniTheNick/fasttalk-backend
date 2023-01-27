import MessageTypes from './messageTypes';

interface Message {
    messageType: MessageTypes,
    sender: string,
    time: Date,
    text: string
};

export default Message;