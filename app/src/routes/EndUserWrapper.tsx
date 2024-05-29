import { Outlet } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

const languages = [
  { langCode: 'FI', langName: 'Suomi' },
  { langCode: 'SE', langName: 'Svenska' },
  { langCode: 'EN', langName: 'English' },
]

const SelectLanguage = () => {
  const { i18n } = useTranslation()

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng)
  }

  return (
    <div className='flex gap-4 font-thin'>
      {languages.map((lang) => (
        <button
          key={lang.langCode}
          onClick={() => changeLanguage(lang.langCode)}
          className={`${i18n.language === lang.langCode ? 'bg-indigo-500' : 'bg-none'} rounded-md px-2 py-1 text-indigo-50 transition-all hover:bg-indigo-400`}
        >
          {lang.langName}
        </button>
      ))}
    </div>
  )
}

const EndUserWrapper = () => {
  const { t } = useTranslation()
  const navigate = useNavigate()
  return (
    <div className='grid h-[100dvh] grid-rows-[auto_1fr] bg-indigo-100 text-indigo-900'>
      <header className='flex items-center justify-between bg-indigo-900 p-2 text-indigo-50'>
        <button
          className='group w-1/4 text-left transition-all'
          onClick={(e) => navigate('/')}
        >
          <h1 className='group-hover:hidden'>Vastaanotolle.fi</h1>
          <p className='hidden font-light group-hover:block'>
            {t('startOver')}
          </p>
        </button>
        <SelectLanguage />
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
