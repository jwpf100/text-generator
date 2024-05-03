import { Button, SxProps } from '@mui/material'

export interface IButtonProps {
  variant?: 'contained' | 'outlined' | 'text'
  type?: 'button' | 'reset' | 'submit' | undefined
  onClick?: () => void
  children?: string
  sx?: SxProps
  fullWidth?: boolean
}

export const ButtonComponent = ({
  variant = 'contained',
  type, 
  onClick,
  children,
  sx,
  fullWidth
}: IButtonProps) => {
  return (
      <Button sx={sx} variant={variant} onClick={onClick} type={type} fullWidth={fullWidth}>
        {children}
      </Button>
  )
}