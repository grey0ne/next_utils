'use client';
import { 
    Button,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { apiRequest } from '@/next_utils/apiClient';
import { useTranslations } from 'next-intl';
import { PostPath } from "@/next_utils/apiHelpers";
import { GenericModalFormProps } from './types';
import { StyledModal } from '../modal/StyledModal';
import { FormFields } from './GenericFormFields';



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
        onSuccess?.(data);
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