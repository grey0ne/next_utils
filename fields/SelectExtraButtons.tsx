import { PostPath } from "../apiHelpers";
import { GenericModalFormButtonProps, GenericModalFormButton } from "../forms/GenericModalFormButton";

type SelectExtraButtonsProps = {
    extraButtonProps?: GenericModalFormButtonProps<PostPath>[];
}

export function SelectExtraButtons({ extraButtonProps }: SelectExtraButtonsProps) {
    const buttonData = extraButtonProps || []
    return (
        <>
            { buttonData.map((buttonProps) => <GenericModalFormButton key={buttonProps.title} {...buttonProps} />) }
        </>
    )
}