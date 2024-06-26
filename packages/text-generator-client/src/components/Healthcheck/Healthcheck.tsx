import { Container } from "@mui/material"
import axios from "axios"
import { useEffect, useState } from "react"

export const HealthCheck = () => {
  const [healthCheck, setHealthCheck] = useState('')

  const getHealthCheck = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_SERVER_URL
      const url = `${baseUrl}/api/v1/healthcheck`
      const response = await axios.get(url)
      return response.data
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    const getData = async () => {
      const data = await getHealthCheck()
      setHealthCheck(data)
    }
    getData()
  }, [])
  
  return (
    <Container fixed>
      <h5>Healthcheck</h5>
      <h5>{healthCheck}</h5>
    </Container>
  )
}