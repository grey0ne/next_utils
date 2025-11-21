'use client';
import { 
    Button,
    DialogActions,
    DialogTitle,
    DialogContent,
} from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { apiPost } from '@/next_utils/apiClient';
import { useTranslations } from 'next-intl';
import { PostPath } from "@/next_utils/apiHelpers";
import { GenericModalFormProps } from './types';
import { StyledModal } from '../modal/StyledModal';
import { FormFields } from './GenericFormFields';
import { useNotifications } from '../notifications/NotificationsContext';


export function GenericModalForm<P extends PostPath>(props: GenericModalFormProps<P>) {
    const { formSchema, initialData, submitUrl, title, onClose, onSuccess, fullscreenBreakpoint, fullWidth, maxWidth } = props;
    const t = useTranslations('generic_modal_form');
    const { showNotification } = useNotifications();
    const formMethods = useForm<any>({
        defaultValues: initialData
    });

    const onSubmit = async (data: any) => {
        const responseData = await apiPost(submitUrl, data, props.submitUrlParams);
        if (responseData.status === 200) {
            onSuccess?.(data, responseData);
            onClose?.();
        } else {
            showNotification(`Status: ${responseData.status}, Error: ${responseData.errors[0]}`);
        }
    };

    const isSubmitting = formMethods.formState.isSubmitting;

    return (
        <StyledModal
            fullscreenBreakpoint={fullscreenBreakpoint}
            fullWidth={fullWidth}
            maxWidth={maxWidth}
            onClose={onClose}
        >
            <DialogTitle fontWeight="bold" fontSize="1.5rem">
                { title }
            </DialogTitle>
            <FormProvider {...formMethods}>
                <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                    <DialogContent>
                        <FormFields fields={formSchema.fields} />
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
            </FormProvider>
        </StyledModal>
    );
}