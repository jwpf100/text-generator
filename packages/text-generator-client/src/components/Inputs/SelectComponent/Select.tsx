import { FormControl, InputLabel, MenuItem, Select, SelectChangeEvent } from '@mui/material'

export type TSelectOption = {
  value: string
  label: string
}

export interface ISelectProps {
  id: string
  label: string
  name: string
  selectOptions: TSelectOption[]
  value?: string
  onChange?: (event: SelectChangeEvent<string>) => void
}

export const SelectComponent = ({
  id,
  label,
  name,
  selectOptions,
  value,
  onChange
}: ISelectProps) => {
  const options = selectOptions.map((item) => (
    <MenuItem key={item.value} value={item.value}>
      {item.label}
    </MenuItem>
  ))

  const handleonChange = (event: SelectChangeEvent<string>) => {
    if (onChange) {
      onChange(event)
    }
  }

  return (
    <FormControl fullWidth margin='normal'>
      <InputLabel id={`${id}-label`}>{label}</InputLabel>
      <Select
        name={name}
        labelId={`${id}-label`}
        id={id}
        label={label}
        value={value}
        onChange={handleonChange}
      >
        {...options}
      </Select>
    </FormControl>
  )
}
