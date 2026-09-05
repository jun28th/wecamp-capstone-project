import { useState, useEffect } from 'react'
import axios from 'axios'

function App() {
  const [message, setMessage] = useState('')

  useEffect(() => {
    axios.get('/api')
      .then(res => setMessage(res.data))
      .catch(err => console.error('Lỗi:', err))
  }, [])

  return (
    <div>
      <h1 className="text-2xl font-bold">Frontend - Backend response:</h1>
      <p>{message || 'Đang tải...'}</p>
    </div>
  )
}

export default App