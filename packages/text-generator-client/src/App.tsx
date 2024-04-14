import './App.css'
import { TextGenerator } from './modules'
import { Box, CssBaseline } from '@mui/material'

function App() {

  return (
    <>
    <CssBaseline />
    <Box>
      <h1>Text Generator App</h1>
      <TextGenerator.Screens.PromptGenerator />
    </Box>
    </>
  )
}

export default App
