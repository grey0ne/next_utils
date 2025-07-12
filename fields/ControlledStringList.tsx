import { Control, useFieldArray } from "react-hook-form";
import { TextField, Button, Stack } from '@mui/material';

type ControlledStringListProps = {
    name: string,
    label: string,
    control: Control<any>,
}


export function ControlledStringList({ name, control, label }: ControlledStringListProps) {
    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: name, // unique name for your Field Array
    });
    const fieldElems = fields.map((item, index) => (
        <Stack direction="row" spacing={1} key={item.id}>
            <TextField
                {...control.register(`${name}.${index}`)}
            />
            <Button
                variant="outlined"
                onClick={() => remove(index)}
            >
                Remove
            </Button>
        </Stack>

    ))
    return (
        <>
            <Stack spacing={1}>
                {fieldElems}
            </Stack>
            <Button
                variant="outlined"
                onClick={() => append('')}
            >
                Add {label}
            </Button>
        </>
    );
}