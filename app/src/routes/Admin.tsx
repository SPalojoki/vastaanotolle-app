import { NavLink, Outlet, useLocation } from 'react-router-dom'

const NavigationButton = ({
  to,
  end,
  children,
}: {
  to: string
  end: boolean | undefined
  children: React.ReactNode
}) => {
  return (
    <li>
      <NavLink
        to={to}
        end={end || false} // Determines whether the link is an exact match
        className={({ isActive }) =>
          isActive
            ? 'rounded bg-gray-900 px-4 py-2 text-gray-200'
            : 'rounded px-4 py-2 text-gray-300 transition-all hover:bg-gray-700'
        }
      >
        {children}
      </NavLink>
    </li>
  )
}

const NavigationBar = () => {
  return (
    <nav>
      <div className='bg-gray-800 py-2'>
        <div className='container mx-auto flex'>
          <div className='flex items-center pr-12 text-gray-400'>
            <p className='border-r-2 border-r-gray-200 pr-4 text-2xl font-bold '>
              Vastaanotolle.fi
            </p>
            <h1 className=' pl-4 text-xl font-medium '>Admin tools</h1>
          </div>
          <ul className='flex items-center gap-2'>
            <NavigationButton to={'/admin/'} end>
              Forms
            </NavigationButton>
          </ul>
        </div>
      </div>
    </nav>
  )
}

const Header = () => {
  const location = useLocation()
  let title: string

  switch (location.pathname) {
    case '/admin/':
      title = 'Forms'
      break
    case '/admin/form/new':
      title = 'New Form'
      break
    default:
      title = ''
      break
  }

  return <h2 className='container mx-auto py-6 text-4xl font-bold'>{title}</h2>
}

const Admin = () => {
  return (
    <div className='grid h-screen grid-rows-[auto_1fr]'>
      <header className='z-10 shadow-md'>
        <NavigationBar />
        <Header />
      </header>
      <main className='overflow-auto bg-gray-100'>
        <div className='container mx-auto py-10'>
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default Admin
