import { Box, Stack, FormHelperText } from '@mui/material';

import { ControlledTextField } from '@/next_utils/fields/ControlledTextField';
import { ControlledLocalizedTextField } from '@/next_utils/fields/ControlledLocalizedTextField';
import { ControlledDynamicSelectField } from '@/next_utils/fields/ControlledDynamicSelectField';
import { ControlledSelectField } from '@/next_utils/fields/ControlledSelectField';
import { ControlledStringList } from '../fields/ControlledStringList';
import { FormFieldSchema, FormFieldType } from './types';

type FieldsProps = {
    fields: FormFieldSchema[];
    control: any;
    errors: any;
}


export function FormFields(props: FieldsProps) {
    const { fields, control, errors } = props;
    const fieldElements = fields.map((field) => {
        let resultElem;
        const baseFields = {control, name: field.name, label: field.label, required: field.required};
        if (field.fieldType === FormFieldType.TEXT_FIELD) {
            resultElem = <ControlledTextField {...baseFields} rows={field.rows || 1} />
        }
        if (field.fieldType === FormFieldType.LOCALIZED_TEXT_FIELD){
            resultElem = <ControlledLocalizedTextField {...baseFields} rows={field.rows || 1}/>
        }
        if (field.fieldType === FormFieldType.DYNAMIC_SELECT_FIELD) {
            resultElem = (
                <ControlledDynamicSelectField
                    {...baseFields}
                    dataUrl={field.dataUrl}
                    dataUrlParams={field.dataUrlParams}
                    optionLabelField={ field.optionLabelField}
                />
            );
        }
        if (field.fieldType === FormFieldType.SELECT_FIELD) {
            resultElem = (
                <ControlledSelectField
                    {...baseFields}
                    options={field.options}
                />
            )
        }
        if (field.fieldType === FormFieldType.TEXT_LIST_FIELD) {
            resultElem = <ControlledStringList {...baseFields} />
        }
        return (
            <Box key={field.name}>
                {resultElem}
                {errors[field.name] && (
                    <FormHelperText error>{errors[field.name]?.message as string}</FormHelperText>
                )}
            </Box>
        )
    })
    return (
        <Stack spacing={2}>{ fieldElements }</Stack>
    )
}
