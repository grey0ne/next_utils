import { ItemsPath, PostPath, RequestParams } from "@/next_utils/apiHelpers";
import { Option } from '@/next_utils/fields/SelectFieldHelpers';

export enum FormFieldType {
    TEXT_FIELD = 'textField',
    INTEGER_FIELD = 'integerField',
    LOCALIZED_TEXT_FIELD = 'localizedTextField',
    DYNAMIC_SELECT_FIELD = 'dynamicSelectField',
    SELECT_FIELD = 'selectField',
    TEXT_LIST_FIELD = 'textListField',
    BASE64_FILE_FIELD = 'base64ImageUploadField',
    CHECKBOX_FIELD = 'checkboxField',
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
    multiple?: boolean;
}

export interface SelectFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.SELECT_FIELD;
    options: Option[]
}

export interface TextFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.TEXT_FIELD | FormFieldType.LOCALIZED_TEXT_FIELD
    rows?: number;
    enableTranslate?: boolean;
}

export interface Base64FileFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.BASE64_FILE_FIELD;
    acceptedFileTypes: string;
}

export interface TextListFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.TEXT_LIST_FIELD;
    rows?: number;
}

export interface IntegerFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.INTEGER_FIELD;
}

export interface CheckboxFieldSchema extends BaseFieldSchema {
    fieldType: FormFieldType.CHECKBOX_FIELD;
}

export type FormFieldSchema = 
    TextFieldSchema | 
    SelectFieldSchema |
    TextListFieldSchema |
    Base64FileFieldSchema |
    IntegerFieldSchema |
    CheckboxFieldSchema |
    DynamicSelectFieldSchema<ItemsPath>;    

export type FormSchema = {
    fields: FormFieldSchema[]
}

export interface GenericFormProps {
    formSchema: FormSchema;
    initialData?: any;
    onSuccess?: (data?: any) => void;
    buttonTitle?: string;
}

export interface GenericModalFormProps <P extends PostPath> {
    formSchema: FormSchema;
    submitUrl: P;
    submitUrlParams: RequestParams<P, 'post'>
    title: string;
    initialData?: any;
    fullscreenBreakpoint?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    fullWidth?: boolean;
    maxWidth?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | false;
    onClose?: () => void;
    onSuccess?: (data?: any, responseData?: any) => void;
}

