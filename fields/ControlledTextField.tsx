import { Controller } from "react-hook-form";
import { TextField } from '@mui/material';

type ControlledTextFieldProps = {
    name: string,
    label: string,
    control: any,
    required?: boolean,
}

export default function ControlledTextField({ name, control, label, required=false }: ControlledTextFieldProps) {
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
                    label={ label } required={ required }  variant="outlined"
                />
            )}
        />
    )
}