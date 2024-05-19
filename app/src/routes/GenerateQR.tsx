import { useLocation } from 'react-router-dom'

const GenerateQR = () => {
  const location = useLocation()
  const encoded = new URLSearchParams(location.search).get('data')
  return (
    <div>
      Generate QR
      <div>{encoded}</div>
    </div>
  )
}

export default GenerateQR
