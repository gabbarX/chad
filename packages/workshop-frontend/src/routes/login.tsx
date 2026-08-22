import { createFileRoute } from '@tanstack/react-router'
import { useRpcStub } from '../RpcContext'
import LoginPage from '../LoginPage'

export const Route = createFileRoute('/login')({ component: LoginRoute })

function LoginRoute() {
  const rpcStub = useRpcStub()
  return <LoginPage rpcStub={rpcStub} onLoginSuccess={() => { window.location.href = '/' }} />
}
