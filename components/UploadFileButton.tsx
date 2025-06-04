import { Button } from "@mui/material";
import { useRef } from "react";
import { untypedApiRequest } from "@/next_utils/apiClient";
import { convertBase64 } from "@/next_utils/helpers";

type UploadFileButtonProps = {
    title: string,
    url: string,
    onSuccess?: () => void;
    onError?: (error: string) => void;
}


export function UploadFileButton({ title, url, onSuccess, onError }: UploadFileButtonProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await convertBase64(file);
            const fileData = { uploaded_file: base64 };

            await untypedApiRequest(url, 'post', fileData);

            if (onSuccess) {
                onSuccess()
            }
        } catch (err) {
            if (onError) {
                onError('Error on image upload');
            }
        }
    };
    return (
        <>
            <input
                type="file"
                accept="image/*"
                style={{ display: 'none' }}
                ref={fileInputRef}
                onChange={handleFileUpload}
            />
            <Button
                variant="contained"
                onClick={() => fileInputRef.current?.click()}
            >
                { title }
            </Button>
        </>
    )


}