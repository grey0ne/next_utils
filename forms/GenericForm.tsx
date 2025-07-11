'use client';
import { Button, Stack } from '@mui/material';
import { useForm } from 'react-hook-form';
import { GenericFormProps } from './types';
import { FormFields } from './GenericFormFields';
import { useTranslations } from 'next-intl';



export function GenericForm(props: GenericFormProps) {
    const { formSchema, initialData, onSuccess } = props;
    const t = useTranslations('generic_modal_form');
    const { 
        control, 
        handleSubmit,
        formState: { errors } 
    } = useForm<any>({
        defaultValues: initialData
    });

    const onSubmit = async (data: any) => {
        onSuccess?.(data);
    };


    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={2}>
                <FormFields fields={formSchema.fields} control={control} errors={errors} />
                <Button 
                    type="submit" 
                    variant="contained" 
                    color="primary"
                >
                    { t('submit') } 
                </Button>
            </Stack>
        </form>
    )
}