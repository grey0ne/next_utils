import { Box, Stack, FormHelperText } from '@mui/material';

import { ControlledTextField } from '@/next_utils/fields/ControlledTextField';
import { ControlledLocalizedTextField } from '@/next_utils/fields/ControlledLocalizedTextField';
import { ControlledDynamicSelectField } from '@/next_utils/fields/ControlledDynamicSelectField';
import { ControlledSelectField } from '@/next_utils/fields/ControlledSelectField';
import { ControlledStringList } from '../fields/ControlledStringList';
import { ControlledBase64FileField } from '../fields/ControlledBase64FileField';
import { ControlledCheckBox } from '@/next_utils/fields/ControlledCheckBox';
import { FormFieldSchema, FormFieldType } from './types';
import { useFormContext } from 'react-hook-form';

type FieldsProps = {
    fields: FormFieldSchema[];
}


export function FormFields(props: FieldsProps) {
    const { control, formState } = useFormContext();
    const { fields } = props;
    const fieldElements = fields.map((field) => {
        let resultElem;
        const baseFields = {control, name: field.name, label: field.label, required: field.required};
        if (field.fieldType === FormFieldType.TEXT_FIELD) {
            resultElem = <ControlledTextField {...baseFields} rows={field.rows || 1} />
        }
        if (field.fieldType === FormFieldType.LOCALIZED_TEXT_FIELD){
            resultElem = <ControlledLocalizedTextField {...baseFields} rows={field.rows || 1} translate={field.enableTranslate}/>
        }
        if (field.fieldType === FormFieldType.DYNAMIC_SELECT_FIELD) {
            resultElem = (
                <ControlledDynamicSelectField
                    {...baseFields}
                    dataUrl={field.dataUrl}
                    dataUrlParams={field.dataUrlParams}
                    optionLabelField={ field.optionLabelField}
                    multiple={field.multiple}
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
        if (field.fieldType === FormFieldType.BASE64_FILE_FIELD) {
            resultElem = <ControlledBase64FileField {...baseFields} acceptedFileTypes={field.acceptedFileTypes} />
        }
        if (field.fieldType === FormFieldType.INTEGER_FIELD) {
            resultElem = <ControlledTextField {...baseFields} type='number' />
        }
        if (field.fieldType === FormFieldType.CHECKBOX_FIELD) {
            resultElem = <ControlledCheckBox {...baseFields} />
        }
        return (
            <Box key={field.name}>
                {resultElem}
                {formState.errors[field.name] && (
                    <FormHelperText error>{formState.errors[field.name]?.message as string}</FormHelperText>
                )}
            </Box>
        )
    })
    return (
        <Stack spacing={2}>{ fieldElements }</Stack>
    )
}
