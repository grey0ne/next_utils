import { Controller, useFormContext } from "react-hook-form";
import { FormControlLabel, Checkbox } from '@mui/material';

type ControlledCheckBoxProps = {
    name: string,
    label: string,
    required?: boolean,
}


export default function ControlledCheckBox({ name, label, required=false }: ControlledCheckBoxProps) {
    const { control } = useFormContext();

    const checkbox = (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            render={
                ({ field: { onChange, value } }) => (
                    <Checkbox checked={ value } onChange={ onChange } />
                )
            }
        />
    )
    return (
        <FormControlLabel control={ checkbox } label={ label } />
    )
}