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
import { untypedApiRequest } from '@/next_utils/apiClient';
import { ControlledTextField } from '@/next_utils/fields/ControlledTextField';
import { ControlledLocalizedTextField } from '@/next_utils/fields/ControlledLocalizedTextField';
import { useTranslations } from 'next-intl';


const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
    borderRadius: 2,
};

export enum FormFieldType {
    TEXT_FIELD = 'textField',
    LOCALIZED_TEXT_FIELD = 'localizedTextField',
}

export type FormFieldSchema = {
    name: string;
    label: string;
    fieldType: FormFieldType;
    required?: boolean;
}

export type FormSchema = {
    fields: FormFieldSchema[]
}

interface GenericModalFormProps {
    formSchema: FormSchema;
    submitUrl: string;
    title: string;
    initialData?: any;
    onClose?: () => void;
    onSuccess?: () => void;
}



export function GenericModalForm(props: GenericModalFormProps) {
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
        await untypedApiRequest(submitUrl, 'post', data);
        if (onSuccess) {
            onSuccess();
        }
        if (onClose) {
            onClose();
        }
    };

    const fieldElements = formSchema.fields.map((field) => {
        let resultElem;
        if (field.fieldType === FormFieldType.TEXT_FIELD) {
            resultElem = (
                <ControlledTextField
                    key={field.name}
                    name={field.name}
                    label={field.label}
                    control={control}
                    required={field.required}
                />
            );
        }
        if (field.fieldType === FormFieldType.LOCALIZED_TEXT_FIELD){
            resultElem = (
                <ControlledLocalizedTextField
                    key={field.name}
                    name={field.name}
                    label={field.name.charAt(0).toUpperCase() + field.name.slice(1)}
                    control={control}
                    required={field.required}
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
        );
    });

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
                        {fieldElements}
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