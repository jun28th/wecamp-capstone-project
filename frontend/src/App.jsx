import AppRouter from './routes/AppRouter'
import { ToastProvider } from './components/Toast'

function App() {
  return (
    <ToastProvider>
      <AppRouter />
    </ToastProvider>
  )
}

export default App