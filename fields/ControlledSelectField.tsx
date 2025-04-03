import { Controller, Control } from "react-hook-form";
import { TextField, Autocomplete } from '@mui/material';

type Option = {
    value: string,
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

export default function ControlledSelectField({ control, name, label, options, required=false }: ControlledSelectFieldProps) {
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            defaultValue={ null }
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => {
                return (
                    <Autocomplete
                        getOptionLabel={(option) => {
                            // This helps mitigate issue with the default value not being found in the options
                            if (option.hasOwnProperty('title')) {
                                return option.title;
                            }
                            return String(option);
                        }}
                        options={options}
                        autoHighlight
                        renderOption={SelectFieldOption}
                        value={ value }
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