import { useAuth0 } from "@auth0/auth0-react"
import { ButtonComponent } from "../../Inputs"
export const LogoutButton = () => {
  const { logout } = useAuth0()

  const handleLogout = () => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      }
    })
  }

  return (
    <ButtonComponent onClick={handleLogout}>
      Log Out
    </ButtonComponent>
  )
}