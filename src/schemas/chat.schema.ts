import {Schema, Types} from "mongoose";

export const MessageSchema = new Schema(
	{
		text: {
			type: String,
			default: "",
		},
		seen: {
			type: Boolean,
			default: false,
		},
		senderId: {
			type: Types.ObjectId,
			required: true,
			ref: "User",
		},
	},
	{timestamps: true}
);

export const ConversationSchema = new Schema(
	{
		senderId: {
			type: Types.ObjectId,
			required: true,
			ref: "User",
		},
		receiverId: {
			type: Types.ObjectId,
			required: true,
			ref: "User",
		},
		messages: [
			{
				type: Types.ObjectId,
				ref: "Message",
			},
		],
	},
	{timestamps: true}
);

ConversationSchema.index({ sender: 1, receiver: 1 }); // indexing uses b-tree and search operation is O(logn)