import { Controller, Control } from "react-hook-form";
import { TextField, Autocomplete } from '@mui/material';

type Option = {
    value: string | number,
    title: string
}

type ControlledSelectFieldProps = {
    control: Control<any>,
    name: string,
    label: string,
    options: Option[]
    required?: boolean
}

function SelectFieldOption (props: any, option: Option) {
    return (
        <li {...props} key={option.value}>
            {option.title}
        </li>
    )
}

function getOption(value: any, options: Option[]) {
    for (const option of options) {
        if (option.value === value) {
            return option
        }
    }
    return null
}

export function ControlledSelectField({ control, name, label, options, required=false }: ControlledSelectFieldProps) {
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => {
                return (
                    <Autocomplete
                        getOptionLabel={(option) => {
                            // This helps mitigate issue with the default value not being found in the options
                            if (option.hasOwnProperty('title')) {
                                return option.title;
                            }
                            return '';
                        }}
                        options={options}
                        autoHighlight
                        renderOption={SelectFieldOption}
                        value={ getOption(value, options) }
                        onChange={(event: any, newValue: Option | null) => {
                            onChange(newValue?.value);
                        }}
                        isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value }
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label={ label }
                                slotProps={{
                                    htmlInput: {
                                        ...params.inputProps,
                                        autoComplete: 'new-password', // disable autocomplete and autofill
                                    }
                                }}
                            />
                        )}
                    />
                )
            }}
        />
    )
}