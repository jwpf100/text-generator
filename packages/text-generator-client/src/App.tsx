import { useAuth0 } from '@auth0/auth0-react'
import { TextGenerator } from './modules'
import { Route, Routes } from 'react-router-dom'
import { CallbackPage, LoginScreen } from './pages'
import { HealthCheckScreen } from './pages/HealthCheckScreen'
import { PageLoader } from './components/PageLoader'
import { ProfilePage } from './pages/ProfilePage'
import { AuthGuard } from './components/AuthGuard'
import './App.css'

function App() {
  const { isLoading } = useAuth0()

  if (isLoading) {
    return <PageLoader />
  }

  return (
    <Routes>
      <Route path='/' element={<LoginScreen />} />
      <Route path='/healthCheck' element={<AuthGuard component={HealthCheckScreen}/>} />
      <Route path='/profile' element={<AuthGuard component={ProfilePage}/>} />
      <Route path='/text-generator' element={<AuthGuard component={TextGenerator.Screens.PromptGenerator}/>} />
      <Route path='/callback' element={<CallbackPage />} />
    </Routes>
  )
}

export default App
