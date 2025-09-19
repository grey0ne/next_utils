import { Controller, Control } from "react-hook-form";
import { SxProps } from '@mui/material';
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
    extraButtonProps?: GenericModalFormButtonProps<never>[]
}



export function ControlledMultipleSelectField({
    control, name, label, options, required=false, sx, extraButtonProps
}: ControlledSelectFieldProps) {
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => {
                value = value || []
                return (
                    <>
                        <AutocompleteElem
                            onChange={onChange}
                            value={value}
                            options={options}
                            label={label}
                            sx={sx}
                            multiple={true}
                        />
                        <SelectExtraButtons extraButtonProps={extraButtonProps} />
                    </>
                )
            }}
        />
    )
}