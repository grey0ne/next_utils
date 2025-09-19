import { Control, useFieldArray } from "react-hook-form";
import { Button, Stack } from '@mui/material';
import { ControlledDynamicSelectField } from "@/next_utils/fields/ControlledDynamicSelectField";
import { ItemsPath, PostPath, RequestParams } from "@/next_utils/apiHelpers";
import { GenericModalFormButtonProps, GenericModalFormButton } from "../forms/GenericModalFormButton";
import { SelectExtraButtons } from "./SelectExtraButtons";

type ControlledSelectListFieldProps<P extends ItemsPath> = {
    name: string,
    label: string,
    control: Control<any>,
    dataUrl: P,
    dataUrlParams: RequestParams<P, 'get'>
    optionLabelField: string,
    extraButtonProps?: GenericModalFormButtonProps<never>[]
}


export function ControlledSelectListField<P extends ItemsPath>({
    name, control, label, dataUrl, dataUrlParams, optionLabelField, extraButtonProps
}: ControlledSelectListFieldProps<P>) {
    const { fields, append, remove } = useFieldArray({
        control, // control props comes from useForm (optional: if you are using FormProvider)
        name: name, // unique name for your Field Array
    });
    const fieldElems = fields.map((item, index) => (
        <Stack direction="row" spacing={1} key={item.id}>
            <ControlledDynamicSelectField
                control={control}
                name={`${name}.${index}`}
                label={label}
                dataUrl={dataUrl}
                dataUrlParams={dataUrlParams}
                optionLabelField={optionLabelField}
                sx={{ minWidth: '300px' }}
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
                <Stack direction="row" spacing={1}>
                    <Button
                        variant="outlined"
                        onClick={() => append('')}
                        sx={{ maxWidth: '400px' }}
                    >
                        Add {label}
                    </Button>
                    <SelectExtraButtons extraButtonProps={extraButtonProps} />
                </Stack>
            </Stack>
        </>
    );
}