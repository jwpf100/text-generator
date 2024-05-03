import { TextField } from '@mui/material'

export interface ITextFieldProps {
  id: string
  label: string
  name: string
  helperText?: string
  rows?: number
  value?: string
  onChange?: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
}

export const TextFieldComponent = ({
  id,
  label, 
  name,
  helperText,
  rows = 4,
  value,
  onChange,
}: ITextFieldProps) => {

  const handleonChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(onChange) {
      onChange(event)
    }
  }

  return (
    <TextField
      id={id}
      name={name}
      label={label}
      helperText={helperText}
      multiline
      rows={rows}
      margin='normal'
      value={value}
      onChange={handleonChange}
      fullWidth
  />
  )
}