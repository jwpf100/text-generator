import { FormControlLabel, FormGroup, Switch } from '@mui/material'
import { IEventTarget } from '../../../modules/TextGenerator/components/PromptGeneratorForm/PromptGeneratorForm'

export interface ISwitchProps {
  name: string
  label: string
  disabled?: boolean
  checked?: boolean
  onChange?: (target: IEventTarget) => void
}

export const SwitchComponent = ({
  name,
  label,
  disabled,
  checked, 
  onChange,
}: ISwitchProps) => {

  const handleonChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(onChange) {
      onChange(event.target)
    }
  }

  return (
    <FormGroup>
      <FormControlLabel control={<Switch disabled={disabled} checked={checked} onChange={handleonChange} name={name} />} label={label}/>
    </FormGroup>
  )
}