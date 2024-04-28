import { TextField } from '@mui/material'
import { IEventTarget } from '../../PromptGeneratorForm/PromptGeneratorForm'

export interface ITextFieldProps {
  id: string
  label: string
  name: string
  helperText?: string
  rows?: number
  value?: string
  onChange?: (target: IEventTarget) => void
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
      onChange(event.target)
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