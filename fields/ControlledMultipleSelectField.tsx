import { Controller, Control } from "react-hook-form";
import { TextField, Autocomplete } from '@mui/material';
import { Option, SelectFieldOption } from './SelectFieldHelpers';

type ControlledSelectFieldProps = {
    control: Control<any>,
    name: string,
    label: string,
    options: Option[]
    required?: boolean
}



function getOptions(value: any[], options: Option[]): Option[] {
    const result: Option[] = []
    value.map((value) => {
        for (const option of options) {
            if (option.value === value) {
                result.push(option)
            }
        }
    })
    return result
}

export function ControlledMultipleSelectField({ control, name, label, options, required=false }: ControlledSelectFieldProps) {
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            shouldUnregister={ true }
            render={({ field: { onChange, value } }) => {
                value = value || []
                return (
                    <Autocomplete
                        getOptionLabel={(option) => {
                            // This helps mitigate issue with the default value not being found in the options
                            if (option.hasOwnProperty('title')) {
                                return option.title;
                            }
                            return 'No option title';
                        }}
                        options={options}
                        autoHighlight
                        renderOption={SelectFieldOption}
                        value={ getOptions(value, options) }
                        onChange={(event: any, newValue: Option[] | null) => {
                            if (newValue) {
                                onChange(newValue.map((option: Option) => option.value));
                            } else {
                                onChange([]);
                            }
                        }}
                        multiple={true}
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