import { useAuth0 } from "@auth0/auth0-react"

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

  return <button className="button__sign-up" onClick={handleSignup}>Sign Up</button>
}
