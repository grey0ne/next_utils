import { Controller, Control } from "react-hook-form";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

type ControlledDateTimeProps = {
    name: string,
    label: string,
    control: Control<any>,
    required?: boolean,
    disableFuture?: boolean
}

export default function ControlledDateTime({ name, control, label, required=false, disableFuture=false }: ControlledDateTimeProps) {
    return (
        <Controller
            name={ name }
            control={ control }
            rules={{ required: required }}
            render={({ field: { onChange, value } }) => (
                <DateTimePicker
                    value={ value } onChange={ onChange }
                    label={ label } disableFuture={ disableFuture }
                    slotProps={{ textField: { required: required, }, }}
                />
            )}
        />
    )
}