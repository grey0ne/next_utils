'use client'
import { useFormStatus } from "react-dom";
import { Button } from '@mui/material';
import { useTranslations } from "next-intl";

type SubmitButtonProps = {
    disabled?: boolean
    style?: React.CSSProperties
}

export default function SubmitButton({ disabled, style } : SubmitButtonProps) {
    const { pending } = useFormStatus();
    const t = useTranslations("generic_modal_form");
    const disabledState = pending || disabled
    return (
        <Button variant="contained" type="submit" disabled={disabledState} sx={style}>
            {pending ? t('submitting') : t('submit')}
        </Button>
    );
}