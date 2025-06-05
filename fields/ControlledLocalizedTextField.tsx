import { Controller } from "react-hook-form";
import { TextField } from '@mui/material';
import { LocalizedString } from "@/next_utils/types";
import { Locale } from "next-intl";
import { LocaleTabs } from "@/next_utils/components/LocaleTabs";
import { useState } from "react";
import { AVAILABLE_LOCALES } from "@/next_utils/constants";

type ControlledLocalizedTextFieldProps = {
    name: string,
    control: any,
    label: string,
    required?: boolean
    width?: string
}

export function ControlledLocalizedTextField({ name, control, label, required, width='100%' }: ControlledLocalizedTextFieldProps) {
    const [selectedLocale, setLocale] = useState<Locale>('en');
    const renderFields = ({ field: { onChange, value }}: {field: {onChange: any, value: LocalizedString}}) => {
        const localeLabel = AVAILABLE_LOCALES.find(locale => locale.code === selectedLocale)?.shortLabel || selectedLocale;
        const fieldLabel = `${label} (${localeLabel})`;
        const onChangeLocale = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValues = { ...value };
            newValues[selectedLocale] = event.target.value;
            onChange(newValues);
        }
        return (
            <>
                <TextField
                    key={ selectedLocale }
                    sx={{ width: width }}
                    value={ value[selectedLocale] || '' } onChange={ onChangeLocale }
                    label={ fieldLabel } required={ required }  variant="outlined"
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