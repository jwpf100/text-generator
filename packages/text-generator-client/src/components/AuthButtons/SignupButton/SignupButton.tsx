import { useAuth0 } from "@auth0/auth0-react"
import { ButtonComponent } from "../../Inputs"

export const SignupButton = () => {
  const { loginWithRedirect } = useAuth0()

  const handleSignup = async () => {
    await loginWithRedirect({
      appState: {
        returnTo: "/text-generator"
      },
      authorizationParams: {
        screen_hint: "signup",
      }
    })
  }

  return <ButtonComponent onClick={handleSignup}>Sign Up</ButtonComponent>
}
