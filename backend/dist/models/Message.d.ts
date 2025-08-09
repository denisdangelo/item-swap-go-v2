export interface Message {
    id: string;
    sender_id: string;
    recipient_id: string;
    item_id?: string;
    loan_id?: string;
    content: string;
    is_read: boolean;
    created_at: Date;
    updated_at: Date;
}
export interface CreateMessageData {
    recipient_id: string;
    content: string;
    item_id?: string;
    loan_id?: string;
}
export interface MessageWithDetails extends Message {
    sender: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
    recipient: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
    item?: {
        id: string;
        title: string;
    };
    loan?: {
        id: string;
        status: string;
    };
}
export interface Conversation {
    participant: {
        id: string;
        first_name: string;
        last_name: string;
        avatar_url?: string;
    };
    last_message: {
        content: string;
        created_at: Date;
        is_read: boolean;
        sender_id: string;
    };
    unread_count: number;
}
