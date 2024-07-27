export type MessageObjType = {
    senderId: string,
    receiverId: string,
    message: string,
}

export type RoomUsersIdType = {
    viewer: string,
    roomer: string
}

export type SeenObjType = {
    newMessageId: string
    senderId: string
}