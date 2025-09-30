// Kết quả upload (Cloudinary trả khá nhiều field, đánh dấu optional cho an toàn)
export type CloudinaryUploadResult = {
    asset_id: string;
    public_id: string;
    version: number;
    version_id: string;
    signature?: string;                 // unsigned có thể không có
    width?: number;
    height?: number;
    format: string;
    resource_type: "image" | "video" | "raw";
    created_at: string;
    tags: string[];
    bytes: number;
    type: string;
    etag: string;
    placeholder?: boolean;
    url: string;
    secure_url: string;
    folder?: string;
    original_filename: string;
    original_extension?: string;
    access_mode?: "public" | "authenticated" | "private";
    pages?: number;                      // pdf/spritesheet
    duration?: number;                   // video/audio
    bit_rate?: number;
    frame_rate?: number;
    is_audio?: boolean;
    is_video?: boolean;
    delete_token?: string;               // khi bật return_delete_token
    // … Cloudinary còn nhiều field khác (colors, exif, moderation, …)
    [k: string]: any;
};

export type UploadOptions = {
    // Common
    folder?: string;                     // "study-party/avatars"
    tags?: string[];                     // ["avatar","user:42"]
    publicId?: string;                   // custom public_id
    overwrite?: boolean;                 // default Cloudinary=false
    resourceType?: "image" | "video" | "raw" | "auto";
    onProgress?: (pct: number) => void;

    // Extra metadata & transforms
    context?: Record<string, string>;    // { alt:"...", caption:"..." }
    eager?: string | string[];           // "w_300,h_300,c_fill|q_auto"
    returnDeleteToken?: boolean;         // để lấy delete_token

    // Unsigned (mặc định)
    unsigned?: boolean;                  // default true
    uploadPreset?: string;               // override preset

    // Signed flow (nếu unsigned=false)
    signatureData?: {
        timestamp: number;
        signature: string;                 // server tạo từ API Secret
        apiKey: string;
    };
};
