import { useAuth0 } from '@auth0/auth0-react'
import { TextGenerator } from './modules'
import { Route, Routes } from 'react-router-dom'
import { CallbackPage, LoginScreen, HealthCheckScreen } from './pages'
import { PageLoader } from './components/PageLoader'
import { ProfilePage } from './pages/ProfilePage'
import { AuthGuard } from './components/AuthGuard'
import { Box, Container } from '@mui/material'
import { NavBar } from './components'

export interface ILayoutBoxProps {
  children: React.ReactNode
}

const App = () => {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return <PageLoader />
  }

  const LayoutBox = ({ children }: ILayoutBoxProps) => {
    return (
      <Box className='LayoutBox'>
        <NavBar />
        {children}
      </Box>
    )
  }
  return (
    <LayoutBox>
      <Container className='LayoutContainer' maxWidth='sm' sx={{ my: { xs: 2, sm: 4 }, height: '100%' }}>
        <Routes>
          <Route path='/' element={<LoginScreen />} />
          <Route path='/healthcheck' element={<AuthGuard component={HealthCheckScreen} />} />
          <Route path='/profile' element={<AuthGuard component={ProfilePage} />} />
          <Route path='/text-generator' element={<AuthGuard component={TextGenerator.Screens.PromptGenerator} />} />
          <Route path='/callback' element={<CallbackPage />} />
        </Routes>
      </Container>
    </LayoutBox>
  )
}

export default App
