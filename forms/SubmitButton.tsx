'use client'
import { useFormStatus } from "react-dom";
import { Button } from '@mui/material';
import { useTranslations } from "next-intl";

type SubmitButtonProps = {
    disabled?: boolean
}

export default function SubmitButton({ disabled } : SubmitButtonProps) {
    const { pending } = useFormStatus();
    const t = useTranslations("generic_modal_form");
    const disabledState = pending || disabled
    return (
        <Button variant="contained" type="submit" disabled={disabledState}>
            {pending ? t('submitting') : t('submit')}
        </Button>
    );
}