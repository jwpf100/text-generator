import { TextField } from '@mui/material'

export interface ITextFieldProps {
  id: string
  label: string
  name: string
  helperText?: string
  rows?: number
}

export const TextFieldComponent = ({
  id,
  label, 
  name,
  helperText,
  rows = 4
}: ITextFieldProps) => {
  return (
    <TextField
      id={id}
      name={name}
      label={label}
      helperText={helperText}
      multiline
      rows={rows}
      margin='normal'
      fullWidth
  />
  )
}