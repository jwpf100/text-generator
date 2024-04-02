import './App.css'
import { HealthCheck } from './components/Healthcheck'

function App() {

  return (
    <>
      <h1>Text Generator App</h1>
      <div className='card'>
        <h3>Healthcheck: </h3>
        <HealthCheck />
      </div>
    </>
  )
}

export default App
