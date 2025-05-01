import { Controller } from "react-hook-form";
import { TextField } from '@mui/material';
import { LocalizedString, Locale } from "@/next_utils/types";
import { LocaleTabs } from "@/next_utils/components/LocaleTabs";
import { useState } from "react";

type ControlledLocalizedTextFieldProps = {
    name: string,
    control: any,
    label: string,
    required: boolean
}

export function ControlledLocalizedTextField({ name, control, label, required }: ControlledLocalizedTextFieldProps) {
    const [selectedLocale, setLocale] = useState(Locale.EN);    
    const renderFields = ({ field: { onChange, value }}: {field: {onChange: any, value: LocalizedString}}) => {
        const onChangeLocale = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValues = { ...value };
            newValues[selectedLocale] = event.target.value;
            onChange(newValues);
        }
        return (
            <>
                <TextField
                    key={ selectedLocale }
                    value={ value[selectedLocale] } onChange={ onChangeLocale }
                    label={ selectedLocale } required={ required }  variant="outlined"
                />
            </>
        )
    }

    return (
        <>
            <LocaleTabs title={ label } selectedLocale={ selectedLocale } setLocale={ setLocale } />
            <Controller
                name={ name }
                control={ control }
                rules={{ required: required }}
                defaultValue={''}
                shouldUnregister={ true }
                render={ renderFields }
            />
        </>
    )
}