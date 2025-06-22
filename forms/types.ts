import { ItemsPath, PostPath, RequestParams } from "@/next_utils/apiHelpers";
import { Option } from '@/next_utils/fields/ControlledSelectField';

export enum FormFieldType {
    TEXT_FIELD = 'textField',
    MULTILINE_TEXT_FIELD = 'multilineTextField',
    LOCALIZED_TEXT_FIELD = 'localizedTextField',
    MULTILINE_LOCALIZED_TEXT_FIELD = 'multilineLocalizedTextField',
    DYNAMIC_SELECT_FIELD = 'dynamicSelectField',
    SELECT_FIELD = 'selectField'
}

interface BaseFieldSchema {
    name: string;
    label: string;
    fieldType: FormFieldType;
    required?: boolean;
}

export interface DynamicSelectFieldSchema <P extends ItemsPath> extends BaseFieldSchema {
    fieldType: FormFieldType.DYNAMIC_SELECT_FIELD;
    dataUrl: P,
    dataUrlParams: RequestParams<P, 'get'>
    optionLabelField: string;
}

export interface SelectFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.SELECT_FIELD;
    options: Option[]
}

export interface TextFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.TEXT_FIELD | FormFieldType.LOCALIZED_TEXT_FIELD | FormFieldType.MULTILINE_TEXT_FIELD | FormFieldType.MULTILINE_LOCALIZED_TEXT_FIELD
    rows?: number;
}

export type FormFieldSchema = 
    TextFieldSchema | 
    SelectFieldSchema |
    DynamicSelectFieldSchema<ItemsPath>;    

export type FormSchema = {
    fields: FormFieldSchema[]
}

export interface GenericModalFormProps <P extends PostPath> {
    formSchema: FormSchema;
    submitUrl: P;
    submitUrlParams: RequestParams<P, 'post'>
    title: string;
    initialData?: any;
    onClose?: () => void;
    onSuccess?: () => void;
}

