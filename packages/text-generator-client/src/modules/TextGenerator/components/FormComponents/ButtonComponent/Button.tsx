import { Button } from '@mui/material'

export interface IButtonProps {
  variant: 'contained' | 'outlined' | 'text'
  type?: 'button' | 'reset' | 'submit' | undefined
  onClick?: () => void
  children: string
}

export const ButtonComponent = ({
  variant,
  type, 
  onClick,
  children
}: IButtonProps) => {
  return (
      <Button variant={variant} onClick={onClick} type={type}>
        {children}
      </Button>
  )
}