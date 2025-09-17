import { useMemo } from "react";
import { Control } from "react-hook-form";
import { ControlledSelectField } from "@/next_utils/fields/ControlledSelectField";
import { ControlledMultipleSelectField } from "@/next_utils/fields/ControlledMultipleSelectField";
import { ItemsPath, PostPath, RequestParams } from "@/next_utils/apiHelpers";
import { useApi } from "@/next_utils/apiClient";
import { SxProps } from "@mui/material";
import { GenericModalFormButtonProps } from "../forms/GenericModalFormButton";


type ControlledDynamiSelectFieldProps <P extends ItemsPath, Q extends PostPath> = {
    control: Control<any>,
    name: string,
    label: string,
    dataUrl: P,
    dataUrlParams: RequestParams<P, 'get'>
    optionLabelField: string,
    required?: boolean,
    multiple?: boolean
    sx?: SxProps
    extraButtonProps?: GenericModalFormButtonProps<any>[]
}


export function ControlledDynamicSelectField <P extends ItemsPath, Q extends PostPath>({
    control, name, label, dataUrl, dataUrlParams,
    optionLabelField,
    required = false, multiple = false, sx, extraButtonProps
}: ControlledDynamiSelectFieldProps<P, Q>) {
    const optionsData = useApi(dataUrl, dataUrlParams);
    const options = useMemo(
        () => (optionsData?.data?.items || []) as Array<{ [key: string | number]: any; id: number }>,
        [optionsData]
    );

    const optionElems = useMemo(
        () => options.map(option => ({
            value: option.id,
            title: option[optionLabelField]
        })),
        [options, optionLabelField]
    );

    if (multiple) {
        return <ControlledMultipleSelectField
            control={control}
            name={name}
            label={label}
            options={optionElems}
            required={required}
            sx={sx}
            extraButtonProps={extraButtonProps}
        />
    }
    return (
        <ControlledSelectField
            control={control}
            name={name}
            label={label}
            options={optionElems}
            required={required}
            sx={sx}
            extraButtonProps={extraButtonProps}
        />
    )
}