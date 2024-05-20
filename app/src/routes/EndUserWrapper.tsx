import { Outlet } from 'react-router-dom'

const EndUserWrapper = () => {
  return (
    <div className='grid h-[100dvh] grid-rows-[auto_1fr] bg-indigo-100 text-indigo-900'>
      <header className='bg-indigo-900 text-indigo-50'>
        <h1 className='text-center font-thin'>Vastaanotolle.fi</h1>
      </header>
      <main className='overflow-auto bg-indigo-100'>
        <div className='container mx-auto h-full py-10'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default EndUserWrapper
