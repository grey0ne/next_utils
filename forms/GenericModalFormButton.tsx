import { PostPath } from "../apiHelpers";
import { GenericModalFormProps } from "./types"
import { GenericModalForm } from "./GenericModalForm";
import { useState } from "react";
import { Button } from "@mui/material";

interface GenericModalFormButtonProps<P extends PostPath> extends GenericModalFormProps<P> {
    buttonTitle: string;
    buttonColor?: 'primary' | 'secondary' | 'inherit' | 'success' | 'error' | 'warning' | 'info';
    buttonVariant?: 'contained' | 'outlined' | 'text';
}

export function GenericModalFormButton<P extends PostPath>(props: GenericModalFormButtonProps<P>) {
    const {
        buttonTitle, onClose, buttonColor='primary', buttonVariant='contained',
        ...modalFormProps

    } = props;
    const [showModal, setShowModal] = useState(false);

    return (
        <>
             <Button 
                variant={buttonVariant}
                color={buttonColor}
                onClick={() => setShowModal(true)}
            >
                { buttonTitle }
            </Button>
            { showModal && 
                <GenericModalForm
                    {...modalFormProps}
                    onClose={() => { setShowModal(false); onClose?.(); }}
                />
            }
        </>

    )
}