const dbModels = {
    User: "USER_MODEL",
    Blog: "BLOG_MODEL",
    Conversation: "CONVERSATION_MODEL",
    Message: "MESSAGE_MODEL",
    Marketplace: "MARKETPLACE_MODEL"
}

const dbProvider = {
    database: 'DATABASE_CONNECTION'
}


const socketEvents = {
    listenEvents: {
        onMessageSent: "sendMessage",
        onMessageSeen: 'seen',
        onGetConversationMessages: "getConversationMessages"
    },
    emitEvents: {
        ejectOnlineUser: 'onlineUser',
        ejectReceivedMessage: 'receiveMessage',
        ejectNewConversation: 'newConversationStart',
        ejectReceiveConversation: 'receiveConversation',
        ejectMessageSeen: 'messageSeen'
    }
}

export {
    dbModels, dbProvider, socketEvents
}