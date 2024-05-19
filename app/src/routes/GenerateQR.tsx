import { useLocation } from 'react-router-dom'
import QRCode from 'react-qr-code'

const GenerateQR = () => {
  const location = useLocation()
  const encoded = new URLSearchParams(location.search).get('data')
  return (
    <div className='grid h-full grid-rows-[2fr_4fr_3fr] items-center text-center'>
      <div className='flex flex-col gap-4'>
        <p> You are all set! </p>
        <h1 className='text-2xl font-bold'>Here is your QR code</h1>
      </div>
      <div className='flex items-center justify-center'>
        {encoded ? (
          <div className='rounded-lg bg-white p-4'>
            <QRCode value={encoded} />
          </div>
        ) : (
          <p className='font-semibold text-red-500'>
            Payload missing. Please resubmit the form.
          </p>
        )}
      </div>
    </div>
  )
}

export default GenerateQR
