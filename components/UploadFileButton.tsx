import { Button } from "@mui/material";
import { useRef } from "react";
import { apiRequest } from "@/next_utils/apiClient";
import { convertBase64 } from "@/next_utils/helpers";
import { PostPath, RequestParams } from '../apiHelpers';

type UploadFileButtonProps<P extends PostPath> = {
    title: string,
    url: P;
    urlParams: RequestParams<P, 'post'>
    acceptedFileTypes: string;
    onSuccess?: () => void;
    onError?: (error: string) => void;
}


export function UploadFileButton<P extends PostPath>({
    title, url, urlParams, onSuccess, onError, acceptedFileTypes
}: UploadFileButtonProps<P>) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            const base64 = await convertBase64(file);
            const fileData = { uploaded_file: base64, file_name: file.name };

            await apiRequest(url, 'post', fileData, urlParams);

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
                accept={ acceptedFileTypes }
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