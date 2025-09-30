import { useState, useCallback } from "react";
import { uploadToCloudinary } from "@/lib/cloudinary";
import type {UploadOptions} from "@/types/cloudinary.type.tsx";


export function useCloudinaryUpload(initialOpts?: UploadOptions) {
    const [progress, setProgress] = useState(0);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);


    const upload = useCallback(async (file: File, opts?: UploadOptions) => {
        setError(null);
        setIsUploading(true);
        setProgress(0);
        try {
            const data = await uploadToCloudinary(file, {
                ...initialOpts,
                ...opts,
                onProgress: (pct) => {
                    setProgress(pct);
                    opts?.onProgress?.(pct);
                    initialOpts?.onProgress?.(pct);
                },
            });
            return data;
        } catch (e: any) {
            setError(e?.message || "Upload failed");
            throw e;
        } finally {
            setIsUploading(false);
        }
    }, [initialOpts]);


    return { upload, progress, isUploading, error };
}