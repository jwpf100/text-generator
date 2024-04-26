import { FormControlLabel, FormGroup, Switch } from '@mui/material'

export interface ISwitchProps {
  name: string
  label: string
  disabled?: boolean
  checked?: boolean
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void
}

export const SwitchComponent = ({
  name,
  label,
  disabled,
  checked, 
  onChange,
}: ISwitchProps) => {
  return (
    <FormGroup>
      <FormControlLabel control={<Switch disabled={disabled} checked={checked} onChange={onChange} name={name} />} label={label}/>
    </FormGroup>
  )
}