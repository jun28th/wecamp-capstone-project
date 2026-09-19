import AppRouter from './routes/AppRouter'
import { ToastProvider } from '@contexts/toastContext'

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}

export default App