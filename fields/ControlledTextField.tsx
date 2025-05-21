import { Controller } from "react-hook-form";
import { TextField } from '@mui/material';

type ControlledTextFieldProps = {
    name: string,
    label: string,
    control: any,
    required?: boolean,
    rows?: number,
    width?: string
}

export default function ControlledTextField({ name, control, label, required=false, rows=1, width='100%' }: ControlledTextFieldProps) {
    const multiline = rows > 1;

    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            defaultValue={''}
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => (
                <TextField
                    value={ value } onChange={ onChange }
                    sx={{ width: width }}
                    label={ label } required={ required }  variant="outlined"
                    multiline={ multiline } rows={ rows }
                />
            )}
        />
    )
}