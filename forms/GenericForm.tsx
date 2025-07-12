'use client';
import { Button, Stack } from '@mui/material';
import { useForm, FormProvider } from 'react-hook-form';
import { GenericFormProps } from './types';
import { FormFields } from './GenericFormFields';
import { useTranslations } from 'next-intl';


export function GenericForm(props: GenericFormProps) {
    const { formSchema, initialData, onSuccess } = props;
    const t = useTranslations('generic_modal_form');
    const formMethods = useForm<any>({
        defaultValues: initialData
    });

    const onSubmit = async (data: any) => {
        onSuccess?.(data);
    };


    return (
        <FormProvider {...formMethods}>
            <form onSubmit={formMethods.handleSubmit(onSubmit)}>
                <Stack spacing={2}>
                    <FormFields fields={formSchema.fields} />
                    <Button 
                        type="submit" 
                        variant="contained" 
                        color="primary"
                    >
                        { t('submit') } 
                    </Button>
                </Stack>
            </form>
        </FormProvider>
    )
}