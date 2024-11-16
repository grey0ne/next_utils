import { useFormStatus } from "react-dom";
import { Button } from '@mui/material';

type SubmitButtonProps = {
    disabled?: boolean
}

export default function SubmitButton({ disabled } : SubmitButtonProps) {
    const { pending } = useFormStatus();
    const disabledState = pending || disabled
    return (
        <Button variant="contained" type="submit" disabled={disabledState}>
            {pending ? "Submitting..." : "Submit"}
        </Button>
    );
}