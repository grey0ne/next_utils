'use client';
import { 
    Box, 
    FormHelperText, 
    Button,
    Stack,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/next_utils/apiClient';
import { ControlledTextField } from '@/next_utils/fields/ControlledTextField';
import { ControlledLocalizedTextField } from '@/next_utils/fields/ControlledLocalizedTextField';
import { ControlledDynamicSelectField } from '@/next_utils/fields/ControlledDynamicSelectField';
import { ControlledSelectField } from '@/next_utils/fields/ControlledSelectField';
import { useTranslations } from 'next-intl';
import { PostPath } from "@/next_utils/apiHelpers";
import { FormFieldSchema, FormFieldType, GenericModalFormProps } from './types';
import { StyledModal } from '../modal/StyledModal';

type FieldsProps = {
    fields: FormFieldSchema[];
    control: any;
    errors: any;
}

function FormFields(props: FieldsProps) {
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
            <DialogTitle>
                { title }
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)}>
                <DialogContent>
                    <FormFields fields={formSchema.fields} control={control} errors={errors} />
                </DialogContent>
                <DialogActions>
                    <Button onClick={onClose} disabled={isSubmitting} variant='contained' color='warning'>
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
                </DialogActions>
            </form>
        </StyledModal>
    );
}