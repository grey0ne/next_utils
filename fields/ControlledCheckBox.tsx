import { Control, Controller } from "react-hook-form";
import { FormControlLabel, Checkbox } from '@mui/material';

type ControlledCheckBoxProps = {
    name: string,
    label: string,
    required?: boolean,
    control: Control<any>,
}


export default function ControlledCheckBox({ name, control, label, required=false }: ControlledCheckBoxProps) {
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