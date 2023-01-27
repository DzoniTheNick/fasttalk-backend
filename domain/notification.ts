import MessageTypes from "./messageTypes";

interface Notification {
    messageType: MessageTypes,
    text: string
};

export default Notification;