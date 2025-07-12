import { Controller, useFormContext } from "react-hook-form";
import { TextField } from '@mui/material';
import { BackendLocalizedString, BackendLocale } from "@/next_utils/types";
import { Locale, useLocale } from "next-intl";
import { LocaleTabs } from "@/next_utils/components/LocaleTabs";
import { useState } from "react";
import { AVAILABLE_LOCALES } from "@/next_utils/constants";

type ControlledLocalizedTextFieldProps = {
    name: string,
    label: string,
    required?: boolean
    width?: string
    rows?: number
}

export function ControlledLocalizedTextField({ name, label, required, width='100%', rows=1 }: ControlledLocalizedTextFieldProps) {
    const locale = useLocale();
    const { control } = useFormContext();
    const [selectedLocale, setLocale] = useState<Locale>(locale);
    const renderFields = ({ field: { onChange, value }}: {field: {onChange: any, value: BackendLocalizedString}}) => {
        const localeLabel = AVAILABLE_LOCALES.find(locale => locale.code === selectedLocale)?.shortLabel || selectedLocale;
        const fieldLabel = `${label} (${localeLabel})`;
        const onChangeLocale = (event: React.ChangeEvent<HTMLInputElement>) => {
            const newValues = { ...value };
            newValues[selectedLocale as BackendLocale] = event.target.value;
            onChange(newValues);
        }
        return (
            <>
                <TextField
                    key={ selectedLocale }
                    sx={{ width: width }}
                    rows={ rows }
                    multiline={ rows > 1 }
                    value={ value[selectedLocale as BackendLocale] || '' } onChange={ onChangeLocale }
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