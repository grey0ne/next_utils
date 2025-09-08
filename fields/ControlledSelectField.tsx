import { Controller, Control } from "react-hook-form";
import { TextField, Autocomplete, SxProps } from '@mui/material';
import { Option, SelectFieldOption } from './SelectFieldHelpers';
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
        <>
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
                            sx={sx}
                        />
                    )
                }}
            />
            { createButtonProps && <GenericModalFormButton {...createButtonProps} /> }
        </>
    )
}