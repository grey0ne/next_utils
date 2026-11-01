import { Controller, Control, FieldValues, Path } from "react-hook-form";
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';

type ControlledDateTimeProps<T extends FieldValues> = {
    name: Path<T>,
    label: string,
    control: Control<T>,
    required?: boolean,
    disableFuture?: boolean
}

export default function ControlledDateTime<T extends FieldValues>({ name, control, label, required=false, disableFuture=false }: ControlledDateTimeProps<T>) {
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