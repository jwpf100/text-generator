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
  value?: string | number
  onClick?: (value: string | number) => void
}

export const SelectComponent = ({
  id,
  label, 
  name,
  selectOptions,
  value, 
  onClick
}: ISelectProps) => {
  const options = selectOptions.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.label}
    </MenuItem>
  ))

  const handleOnClick = (event: React.ChangeEvent<HTMLSelectElement>) => {
    if(onClick) {
      onClick(event.target.value)
    }
  }

  return (
    <FormControl fullWidth margin='normal'>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select name={name} labelId={`${id}-label`} id={id} label={label} value={value} onChange={handleOnClick}>
        {...options}
      </Select>
    </FormControl>
  )
}