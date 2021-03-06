export class chatMessageRequestModel {
    constructor(message, request) {
        this.message = message;
        this.request = request;
    }

    message: chatMessageModel;
    request: chatRequestModel;
}

export class chatMessageModel {
    id: string;
    message: string;
    date: Date;
    senderUserName: string;
    senderUserId: number;
    senderUserImage: string;
    isMedia: boolean;
    mediaURL: any[];
    channel: string;
    messageType: number;
    messageDeliveryStatus: number;
    messageStatusType: number;
}

export class chatRequestModel {
    reciever_username: string;
    receiver_id: number;
    sender_username: string;
    sender_id: number;
}