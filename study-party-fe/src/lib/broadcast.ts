const CHANNEL_NAME = 'study_party_auth';
let channel: BroadcastChannel | null = null;

// Chỉ khởi tạo channel nếu chạy trên trình duyệt
if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
    channel = new BroadcastChannel(CHANNEL_NAME);
}

interface BroadcastMessage {
    type: 'TOKEN_UPDATED' | 'LOGOUT';
    payload?: any;
}

export function sendMessage(message: BroadcastMessage) {
    channel?.postMessage(message);
}

export function listenMessage(callback: (message: BroadcastMessage) => void) {
    if (channel) {
        channel.onmessage = (event) => {
            callback(event.data);
        };
    }
}