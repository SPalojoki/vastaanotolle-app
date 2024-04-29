import { HiDocumentText, HiUserCircle, HiOutlineLogout } from 'react-icons/hi'
import { Outlet } from 'react-router-dom'

const SidebarButton = ({
  text,
  isActive,
  children,
}: {
  text: string
  isActive: boolean
  children: React.ReactNode
}) => {
  return (
    <button
      type='button'
      className={`flex w-full items-center gap-3 rounded-md px-3 py-2 transition-all ${isActive ? 'scale-[1.01] bg-blue-500 font-bold text-white drop-shadow-md' : 'outline outline-1 outline-gray-200 hover:outline-gray-300'}`}
    >
      <div className='text-2xl'>{children}</div>
      {text}
    </button>
  )
}

const Admin = () => {
  return (
    <div className='grid h-screen grid-cols-[300px_auto] text-zinc-800'>
      <nav className='flex h-full flex-col items-start bg-slate-100 p-4'>
        <div className='text-blue-900'>
          <p className='text-sm font-semibold '>Vastaanotolle.fi</p>
          <h1 className='mb-6 text-2xl font-bold'>Admin interface</h1>
        </div>
        <div className='flex w-full flex-col gap-3'>
          <SidebarButton text='Questionnaire' isActive={true}>
            <HiDocumentText />
          </SidebarButton>
          <SidebarButton text='Manage account' isActive={false}>
            <HiUserCircle />
          </SidebarButton>
        </div>
        <div className='flex-grow' />
        <button type='button' className='flex gap-2 text-red-500'>
          <HiOutlineLogout size={24} className='rotate-180' />
          Sign out
        </button>
      </nav>
      <main className='flex bg-zinc-50'>
        <Outlet />
      </main>
    </div>
  )
}

export default Admin
