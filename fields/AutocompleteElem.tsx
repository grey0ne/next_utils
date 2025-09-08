import { Option, SelectFieldOption } from './SelectFieldHelpers';
import { SxProps } from '@mui/material';
import { TextField, Autocomplete } from '@mui/material';

function getOption(value: any, options: Option[]) {
    for (const option of options) {
        if (option.value === value) {
            return option;
        }
    }
    return null
}

function getMultipleOptions(value: any[], options: Option[]): Option[] {
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
type AutocompleteElemProps = {
    onChange: (value: any) => void,
    value: any,
    options: Option[],
    label: string,
    sx?: SxProps
    multiple?: boolean
}


export function AutocompleteElem({ onChange, value, options, label, sx, multiple }: AutocompleteElemProps) {
    function onChangeHandler(event: any, newValue: Option | Option[] | null) {
        if (newValue === null) {
            if (multiple) {
                onChange([]);
            } else {
                onChange(null);
            }
            return;
        }
        if (typeof newValue === 'object' && 'value' in newValue) {
            onChange(newValue?.value || null);
        } else {
            onChange(newValue.map((option: Option) => option.value));
        }
    }
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
            value={ multiple ? getMultipleOptions(value, options) : getOption(value, options) }
            onChange={ onChangeHandler }
            multiple={multiple}
            isOptionEqualToValue={(option: Option, value: Option) => option.value === value.value }
            renderInput={(params) => (
                <TextField
                    {...params}
                    label={ label }
                    sx={sx}
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
}

