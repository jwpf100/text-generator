import { withAuthenticationRequired } from '@auth0/auth0-react'
import { PageLoader } from '../PageLoader'
import { ComponentType } from 'react'

export interface AuthenticationGuardProps {
  component: ComponentType<object>
}

export const AuthGuard = ({ component }: AuthenticationGuardProps) => {
  const Component = withAuthenticationRequired(component, {
    onRedirecting: () => <PageLoader />
  })

  return <Component />
}
