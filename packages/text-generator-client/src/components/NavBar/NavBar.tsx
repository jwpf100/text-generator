import AppBar from '@mui/material/AppBar'
import Box from '@mui/material/Box'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import { LoginButton, LogoutButton, SignupButton } from '../Buttons'
import { useAuth0 } from '@auth0/auth0-react'

interface NavBarConfig {
  title: string
  signUpEnabled: boolean
  menuButtonEnabled: boolean
}

interface NavBarButtonsProps {
  signUp: boolean
}

export const NavBarButtons = ({ signUp }: NavBarButtonsProps) => {
  const { isAuthenticated } = useAuth0()

  return (
    <div>
      {!isAuthenticated && (
        <>
          {signUp && <SignupButton />}
          <LoginButton />
        </>
      )}
      {isAuthenticated && <LogoutButton />}
    </div>
  )
}

export const NavBar = () => {
  const navBarConfig: NavBarConfig = {
    title: '',
    signUpEnabled: false,
    menuButtonEnabled: false
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position='static'>
        <Toolbar>
          {navBarConfig.menuButtonEnabled && (
            <IconButton size='large' edge='start' color='inherit' aria-label='menu' sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {navBarConfig.title}
          </Typography>
          <NavBarButtons signUp={navBarConfig.signUpEnabled} />
        </Toolbar>
      </AppBar>
    </Box>
  )
}
