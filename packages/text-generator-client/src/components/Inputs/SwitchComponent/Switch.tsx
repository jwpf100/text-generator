import { FormControlLabel, FormGroup, Switch } from '@mui/material'

export interface ISwitchProps {
  name: string
  label: string
  disabled?: boolean
  checked?: boolean
  onChange?: () => void
}

export const SwitchComponent = ({
  name,
  label,
  disabled,
  checked, 
  onChange,
}: ISwitchProps) => {

  const handleonChange = () => {
    if(onChange) {
      onChange()
    }
  }

  return (
    <FormGroup>
      <FormControlLabel control={<Switch disabled={disabled} checked={checked} onChange={handleonChange} name={name} />} label={label}/>
    </FormGroup>
  )
}