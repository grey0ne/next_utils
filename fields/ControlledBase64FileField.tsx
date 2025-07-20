import { useFormContext } from "react-hook-form";
import { useRef, useState } from "react";
import { Button, Typography } from "@mui/material";
import { convertBase64 } from "@/next_utils/helpers";

type ControlledBase64FileFieldProps = {
    name: string,
    label: string,
    acceptedFileTypes: string;
    buttonTitle?: string;
}

export function ControlledBase64FileField({ name, label, acceptedFileTypes, buttonTitle }: ControlledBase64FileFieldProps) {
    const { setValue } = useFormContext();
    const [ fileName, setFileName ] = useState<string>('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const base64 = await convertBase64(file);
        setFileName(file.name);
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
            <Typography variant="h6">{ label }</Typography>
            { fileName && <Typography>{ fileName }</Typography> }
            { !fileName && (
                <Button
                    variant="contained"
                    onClick={() => fileInputRef.current?.click()}
                >
                    { buttonTitle || 'Upload' }
                </Button>
            )}
        </>
    )
}