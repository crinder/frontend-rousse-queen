import { useState } from 'react'
import '@coreui/coreui/dist/css/coreui.min.css';
import  './index.css';
import Routing from './routing/Routing';


function App() {
  const [count, setCount] = useState(0)

  return (
    <div className='App'>
      
      <Routing/>
    </div>
  )
}

export default App
