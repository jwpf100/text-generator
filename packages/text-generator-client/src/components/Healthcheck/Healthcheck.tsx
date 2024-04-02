import axios from "axios"
import { useEffect, useState } from "react"

export const HealthCheck = () => {
  const [healthCheck, setHealthCheck] = useState('')

  const getHealthCheck = async () => {
    try {
      const url = 'http://localhost:1234/api/v1/healthcheck'
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
    <div>
      <h2>{healthCheck}</h2>
    </div>
  )
}