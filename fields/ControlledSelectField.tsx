import { Controller, Control } from "react-hook-form";
import { SxProps, Stack } from '@mui/material';
import { Option } from './SelectFieldHelpers';
import { GenericModalFormButtonProps } from "../forms/GenericModalFormButton";
import { AutocompleteElem } from './AutocompleteElem';
import { SelectExtraButtons } from "./SelectExtraButtons";

type ControlledSelectFieldProps = {
    control: Control<any>,
    name: string,
    label: string,
    options: Option[]
    required?: boolean
    sx?: SxProps
    extraButtonProps?: GenericModalFormButtonProps<any>[]
}

export function ControlledSelectField({
    control, name, label, options, required=false, sx, extraButtonProps
}: ControlledSelectFieldProps) {
    return (
        <Stack spacing={2} direction="row">
            <Controller
                name={ name }
                control={ control }
                rules={{ required: required }}
                shouldUnregister={ true }
                render={({ field: { onChange, value } }) => {
                    return (
                        <AutocompleteElem
                            onChange={onChange}
                            value={value}
                            options={options}
                            label={label}
                            sx={ { width: '400px', ...sx } }
                        />
                    )
                }}
            />
            <SelectExtraButtons extraButtonProps={extraButtonProps} />
        </Stack>
    )
}