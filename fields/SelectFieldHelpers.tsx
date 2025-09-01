import { AutocompleteRenderOptionState } from "@mui/material"
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export type Option = {
    value: string | number,
    title: string
}

export function SelectFieldOption (props: any, option: Option, state: AutocompleteRenderOptionState) {
    return (
        <li {...props} key={option.value}>
            {option.title}
            {state.selected && <CheckCircleIcon sx={{ ml: 1, fontSize: '1rem' }} />}
        </li>
    )
}