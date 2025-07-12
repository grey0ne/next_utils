import { useFormContext } from "react-hook-form";
import { useRef } from "react";
import { Button } from "@mui/material";
import { convertBase64 } from "@/next_utils/helpers";

type ControlledBase64FileFieldProps = {
    name: string,
    label: string,
    acceptedFileTypes: string;
    buttonTitle?: string;
}

export function ControlledBase64FileField({ name, label, acceptedFileTypes, buttonTitle }: ControlledBase64FileFieldProps) {
    const { setValue } = useFormContext();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const base64 = await convertBase64(file);
        setValue(name, base64);
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
                { buttonTitle || 'Upload' }
            </Button>
        </>
    )
}