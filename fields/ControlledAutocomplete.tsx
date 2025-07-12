import { Controller, useFormContext } from "react-hook-form";

import { Autocomplete, TextField } from '@mui/material';

interface Option {
    id: number
    title: string
}

type ControlledAutocompleteProps = {
    name: string
    label: string
    options: Option[]
    required?: boolean
    setInputValue?: (value: string) => void
}

function OptionElem (props: any, option: Option) {
    return (
        <li {...props} key={option.id}>
            {option.title}
        </li>
    )
}

export default function ControlledAutocomplete({ name, label, options, required, setInputValue }: ControlledAutocompleteProps) {
    const { control } = useFormContext();
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            defaultValue={ null }
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => (
                <Autocomplete
                    options={options}
                    autoHighlight
                    getOptionLabel={(option: Option) => option.title}
                    renderOption={ OptionElem }
                    isOptionEqualToValue={(option: Option, value: Option) => { return option.id === value.id }}
                    value={value}
                    onChange={(event: any, newValue: Option | null) => {
                        onChange(newValue);
                    }}
                    onInputChange={(event, newInputValue) => {
                        if (setInputValue) {
                            setInputValue(newInputValue);
                        }
                    }}
                    renderInput={(params) => (
                        <TextField
                            {...params}
                            label={ label }
                            required={required}
                            inputProps={{
                                ...params.inputProps,
                                autoComplete: 'new-password', // disable autocomplete and autofill
                            }}
                        />
                    )}
                />
            )}
        />
    );
}