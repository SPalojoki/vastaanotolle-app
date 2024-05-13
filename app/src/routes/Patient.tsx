import { Outlet } from 'react-router-dom'

const Patient = () => {
  return (
    <div className='min-h-[100dvh] bg-indigo-100 text-indigo-900'>
      <header className='bg-indigo-900 text-indigo-50'>
        <h1 className='text-center font-thin'>Vastaanotolle.fi</h1>
      </header>
      <main className='md:container md:mx-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default Patient
