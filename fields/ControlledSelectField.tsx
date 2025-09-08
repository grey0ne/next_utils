import { Controller, Control } from "react-hook-form";
import { SxProps, Stack } from '@mui/material';
import { Option } from './SelectFieldHelpers';
import { GenericModalFormButtonProps, GenericModalFormButton } from "../forms/GenericModalFormButton";
import { PostPath } from "../apiHelpers";
import { AutocompleteElem } from './AutocompleteElem';

type ControlledSelectFieldProps <Q extends PostPath> = {
    control: Control<any>,
    name: string,
    label: string,
    options: Option[]
    required?: boolean
    sx?: SxProps
    createButtonProps?: GenericModalFormButtonProps<Q>
}

export function ControlledSelectField<Q extends PostPath>({
    control, name, label, options, required=false, sx, createButtonProps
}: ControlledSelectFieldProps<Q>) {
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
            { createButtonProps && <GenericModalFormButton {...createButtonProps} /> }
        </Stack>
    )
}