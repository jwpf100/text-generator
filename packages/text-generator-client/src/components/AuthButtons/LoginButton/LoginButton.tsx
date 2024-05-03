import { useAuth0 } from "@auth0/auth0-react"
import { ButtonComponent } from "../../Inputs"
export const LoginButton = () => {
  const { loginWithRedirect } = useAuth0()

  const handleLogin = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/text-generator"
      }
    })
  }

  return <ButtonComponent onClick={handleLogin}>Log In</ButtonComponent>
}
