'use client';
import { 
    Box, 
    Typography, 
    FormHelperText, 
    Button,
    Stack
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/next_utils/apiClient';
import { ControlledTextField } from '@/next_utils/fields/ControlledTextField';
import { ControlledLocalizedTextField } from '@/next_utils/fields/ControlledLocalizedTextField';
import { ControlledDynamicSelectField } from '@/next_utils/fields/ControlledDynamicSelectField';
import { useTranslations } from 'next-intl';
import { PostPath } from "@/next_utils/apiHelpers";
import { FormFieldSchema, FormFieldType, GenericModalFormProps } from './types';
import { StyledModal } from '../modal/StyledModal';


function renderFields(fields: FormFieldSchema[], control: any, errors: any) {
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
        return (
            <Box key={field.name}>
                {resultElem}
                {errors[field.name] && (
                    <FormHelperText error>{errors[field.name]?.message as string}</FormHelperText>
                )}
            </Box>
        )
    })
    return fieldElements;
}

export function GenericModalForm<P extends PostPath>(props: GenericModalFormProps<P>) {
    const { formSchema, initialData, submitUrl, title, onClose, onSuccess } = props;
    const t = useTranslations('generic_modal_form');
    const { 
        control, 
        handleSubmit, 
        formState: { errors, isSubmitting } 
    } = useForm<any>({
        defaultValues: initialData
    });

    const onSubmit = async (data: any) => {
        await apiRequest(submitUrl, 'post', data, props.submitUrlParams);
        onSuccess?.();
        onClose?.();
    };

    return (
        <StyledModal
            onClose={onClose}
        >
            <Typography id="edit-company-modal-title" variant="h6" component="h2" gutterBottom>
                { title }
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    {renderFields(formSchema.fields, control, errors)}
                </Stack>
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                    <Button onClick={onClose} disabled={isSubmitting}>
                        { t('cancel') }
                    </Button>
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? t('submitting') : t('submit')}
                    </Button>
                </Box>
            </form>
        </StyledModal>
    );
}