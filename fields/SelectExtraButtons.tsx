import { GenericModalFormButtonProps, GenericModalFormButton } from "../forms/GenericModalFormButton";

type SelectExtraButtonsProps = {
    extraButtonProps?: GenericModalFormButtonProps<any>[];
}

export function SelectExtraButtons({ extraButtonProps }: SelectExtraButtonsProps) {
    const buttonData = extraButtonProps || []
    return (
        <>
            { buttonData.map((buttonProps) => <GenericModalFormButton key={buttonProps.title} {...buttonProps} />) }
        </>
    )
}