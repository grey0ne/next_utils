import { Control } from "react-hook-form";
import { ControlledSelectField } from "@/next_utils/fields/ControlledSelectField";
import { ItemsPath, RequestParams } from "@/next_utils/apiHelpers";
import { useApi } from "@/next_utils/apiClient";

type ControlledDynamiSelectFieldProps <P extends ItemsPath> = {
    control: Control<any>,
    name: string,
    label: string,
    dataUrl: P,
    dataUrlParams: RequestParams<P, 'get'>
    optionLabelField: string,
    required?: boolean
}

export function ControlledDynamicSelectField <P extends ItemsPath>({
    control, name, label, dataUrl, dataUrlParams, optionLabelField, required = false
}: ControlledDynamiSelectFieldProps<P>) {
    const optionsData = useApi(dataUrl, dataUrlParams);
    const options = (optionsData?.data?.items || []) as Array<{ [key: string | number]: any; id: number }>;

    const optionElems = options.map(option => ({
        value: option.id,
        title: option[optionLabelField]
    }));

    return (
        <ControlledSelectField
            control={control}
            name={name}
            label={label}
            options={optionElems}
            required={required}
        />
    )
}