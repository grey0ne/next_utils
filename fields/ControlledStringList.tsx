import { Control, useFieldArray } from "react-hook-form";
import { TextField, Button, Stack } from '@mui/material';

type ControlledStringListProps = {
    name: string,
    label: string,
    control: Control<any>,
    width?: string
}


export function ControlledStringList({ name, control, label, width = '100%' }: ControlledStringListProps) {
    const { fields, append } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: name, // unique name for your Field Array
    });
    const fieldElems = fields.map((item, index) => (
        <TextField
            key={item.id}
            {...control.register(`${name}.${index}.value`)}
        />

    ))
    return (
        <>
            <Stack spacing={1}>
                {fieldElems}
            </Stack>
            <Button
                variant="outlined"
                onClick={() => append({ value: '' })}
                sx={{ width: width, marginTop: 1 }}
            >
                Add {label}
            </Button>
        </>
    );
}