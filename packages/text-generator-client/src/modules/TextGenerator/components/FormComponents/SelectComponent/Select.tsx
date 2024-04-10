import { FormControl, InputLabel, MenuItem, Select } from '@mui/material'

export type TSelectOption = {
  value: string | number
  label: string
}

export interface ISelectProps {
  id: string
  label: string
  name: string
  selectOptions: TSelectOption[]
}

export const SelectComponent = ({
  id,
  label, 
  name,
  selectOptions,
}: ISelectProps) => {
  const paragraphOptions = selectOptions.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.label}
    </MenuItem>
  ))
  return (
    <FormControl fullWidth margin='normal'>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select name={name} labelId={`${id}-label`} id={id} label={label}>
        {...paragraphOptions}
      </Select>
    </FormControl>
  )
}