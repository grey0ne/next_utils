'use client';
import { 
    Modal, 
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
import { ItemsPath, PostPath, RequestParams } from "@/next_utils/apiHelpers";


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    bgcolor: 'background.paper',
    boxShadow: 24,
    minWidth: 600,
    p: 4,
    borderRadius: 2,
};

export enum FormFieldType {
    TEXT_FIELD = 'textField',
    LOCALIZED_TEXT_FIELD = 'localizedTextField',
    DYNAMIC_SELECT_FIELD = 'dynamicSelectField',
}

interface BaseFieldSchema {
    name: string;
    label: string;
    fieldType: FormFieldType;
    required?: boolean;
}

export interface DynamicSelectFieldSchema <P extends ItemsPath> extends BaseFieldSchema {
    fieldType: FormFieldType.DYNAMIC_SELECT_FIELD;
    fieldOptions: {
        dataUrl: P,
        dataUrlParams: RequestParams<P, 'get'>
        optionLabelField: string;
    }
}

export interface BasicFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.TEXT_FIELD | FormFieldType.LOCALIZED_TEXT_FIELD;
}

export type FormFieldSchema = 
    BasicFieldSchema | 
    DynamicSelectFieldSchema<ItemsPath>;    

export type FormSchema = {
    fields: FormFieldSchema[]
}

interface GenericModalFormProps <P extends PostPath> {
    formSchema: FormSchema;
    submitUrl: P;
    submitUrlParams: RequestParams<P, 'post'>
    title: string;
    initialData?: any;
    onClose?: () => void;
    onSuccess?: () => void;
}


function renderFields(fields: FormFieldSchema[], control: any, errors: any) {
    const fieldElements = fields.map((field) => {
        let resultElem;
        const baseFields = {control, name: field.name, label: field.label, required: field.required};
        if (field.fieldType === FormFieldType.TEXT_FIELD) {
            resultElem = <ControlledTextField {...baseFields} />
        }
        if (field.fieldType === FormFieldType.LOCALIZED_TEXT_FIELD){
            resultElem = <ControlledLocalizedTextField {...baseFields} />
        }
        if (field.fieldType === FormFieldType.DYNAMIC_SELECT_FIELD) {
            resultElem = (
                <ControlledDynamicSelectField
                    {...baseFields}
                    dataUrl={field.fieldOptions?.dataUrl}
                    dataUrlParams={field.fieldOptions?.dataUrlParams}
                    optionLabelField={ field.fieldOptions?.optionLabelField}
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

export function GenericModalForm(props: GenericModalFormProps<PostPath>) {
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
        if (onSuccess) {
            onSuccess();
        }
        if (onClose) {
            onClose();
        }
    };

    return (
        <Modal
            open={true}
            onClose={onClose}
        >
            <Box sx={modalStyle}>
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
            </Box>
        </Modal>
    );
}