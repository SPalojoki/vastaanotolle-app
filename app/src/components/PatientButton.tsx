const PatientButton = ({
  text,
  children,
  reversed,
  disabled,
  onClick,
}: {
  text?: string
  children: React.ReactNode
  reversed?: boolean
  onClick?: () => void
  disabled?: boolean
}) => {
  return (
    <button
      className={`flex items-center justify-center rounded-full bg-indigo-900 p-5 text-indigo-50 shadow-md transition-all hover:bg-indigo-950 ${reversed ? 'flex-row-reverse' : ''} ${text ? 'gap-2' : ''} disabled:bg-gray-400`}
      onClick={onClick}
      disabled={disabled}
    >
      <span className='text-md font-semibold'>{text}</span>
      <div className='text-xl'>{children}</div>
    </button>
  )
}

export default PatientButton
