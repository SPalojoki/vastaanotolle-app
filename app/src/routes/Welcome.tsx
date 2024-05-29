import { useState, useRef } from 'react'
import { MdArrowForward } from 'react-icons/md'
import axios, { AxiosError } from 'axios'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

const codeLength = 4

const InputDot = ({
  code,
  index,
  focused,
}: {
  code: string
  index: number
  focused: boolean
}) => {
  const getConditionalStyles = (): string => {
    if (index === code.length) {
      return `bg-white border-2 ${focused ? 'border-indigo-500' : 'border-gray-300'}`
    }
    if (index < code.length) {
      return 'bg-gray-800 text-white'
    }
    return 'bg-indigo-50 md:bg-indigo-200'
  }

  return (
    <div
      className={`flex h-12 w-12 items-center justify-center rounded-full font-bold transition-all lg:h-16 lg:w-16 ${getConditionalStyles()}`}
    >
      {code[index] || ''}
    </div>
  )
}

const InputCode = () => {
  const [code, setCode] = useState<string>('')
  const [focused, setFocused] = useState<boolean>(false) // Used for interactive styling
  const [error, setError] = useState<string>('')
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()
  const { t } = useTranslation()

  const focusInput = () => {
    if (inputRef.current !== null) {
      inputRef.current.focus()
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    if (value.length <= codeLength && /^[0-9]*$/.test(value)) {
      setCode(value)
    }
  }

  // TODO: Centralize fetching logics outside the components
  const fetchForm = async () => {
    try {
      const response = await axios.get('/api/form/' + code)
      navigate(`/${code}`, { state: { data: response.data } })
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response?.status === 404) {
        setError(t('formNotFound'))
        setCode('')
        focusInput()
      } else {
        setError('An unexpected error occurred')
      }
    }
  }

  return (
    <>
      <input
        type='text'
        inputMode='numeric'
        autoFocus
        className='sr-only'
        value={code}
        onChange={handleInput}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        ref={inputRef}
      />
      <div className='mt-8 flex gap-4 hover:cursor-pointer'>
        <div className='flex gap-4' onClick={focusInput}>
          {Array.from({ length: codeLength }).map((_, i) => (
            <InputDot key={i} code={code} index={i} focused={focused} />
          ))}
        </div>
        <button
          className={`flex h-12 w-12 items-center justify-center rounded-full bg-indigo-900 shadow-md transition-all hover:bg-indigo-950 md:hover:translate-x-1 lg:h-16 lg:w-16 ${code.length === 4 ? '' : 'hidden'}`}
          onClick={fetchForm}
        >
          <MdArrowForward className='text-xl text-white' />
        </button>
      </div>
      <div className='mt-4 font-bold text-red-500'>{error}</div>
    </>
  )
}

const Welcome = () => {
  const { t } = useTranslation()
  return (
    <div className='grid grid-rows-[2fr_1fr] place-items-center md:mt-4 md:grid-cols-[1fr_1fr] md:grid-rows-1 md:rounded-md md:bg-indigo-50 md:shadow-md'>
      <img
        src='/logo.png'
        className='w-3/5 max-w-80 drop-shadow-2xl md:max-w-none'
      />
      <div className='text-center md:justify-self-start md:text-left'>
        <h1 className='md:text-md hidden md:block lg:text-xl'>
          Vastaanotolle.fi
        </h1>
        <p className='text-2xl font-bold'>{t('enterCode')}</p>
        <InputCode />
      </div>
    </div>
  )
}

export default Welcome
