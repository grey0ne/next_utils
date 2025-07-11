import { Controller, Control } from "react-hook-form";
import { TextField } from '@mui/material';

type ControlledTextFieldProps = {
    name: string,
    label: string,
    control: Control<any>,
    required?: boolean,
    rows?: number,
    width?: string
}

export function ControlledTextField({ name, control, label, required=false, rows=1, width='100%' }: ControlledTextFieldProps) {
    const multiline = rows > 1;

    return (
        <TextField
            sx={{ width: width }}
            label={ label } required={ required }  variant="outlined"
            multiline={ multiline } rows={ rows }
            {...control.register(name, { required: required })}
        />
    )
}