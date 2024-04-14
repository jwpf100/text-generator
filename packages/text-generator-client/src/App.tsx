import './App.css'
import { ChatExample } from './components/ChatExample'
import { HealthCheck } from './components/Healthcheck'
import { TextGenerator } from './modules'
import { Box, CssBaseline } from '@mui/material'

function App() {

  return (
    <>
    <CssBaseline />
    <Box>
      <h1>Text Generator App</h1>
      <HealthCheck />
      <ChatExample />
      <TextGenerator.Screens.PromptGenerator />
    </Box>
    </>
  )
}

export default App
