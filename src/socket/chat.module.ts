import { Module } from "@nestjs/common";
import { ChatGateway } from "./chat.gateway";

import { userProviders } from "src/auth/user.provider";
import { conversationProvider } from "src/common/providers/conversation.provider";
import { messageProvider } from "src/common/providers/message.provider";


@Module({
    providers: [ChatGateway, ...userProviders, ...conversationProvider, ...messageProvider]
})

export class ChatModule {}