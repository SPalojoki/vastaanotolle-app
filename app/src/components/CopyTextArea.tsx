import React, { useState } from 'react'
import { MdContentCopy, MdCheck } from 'react-icons/md'

interface CopyTextareaProps {
  value: string
  setValue: React.Dispatch<React.SetStateAction<string>>
}

const CopyTextarea: React.FC<CopyTextareaProps> = ({ value, setValue }) => {
  const [copied, setCopied] = useState<boolean>(false)

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000) // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy text: ', err)
    }
  }

  return (
    <div className='relative w-full max-w-md'>
      <textarea
        className='w-full rounded-lg border border-gray-300 p-2 pr-10 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500'
        rows={10}
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <button
        className='absolute bottom-4 left-2 flex items-center justify-center rounded-lg bg-indigo-500 p-2 text-white shadow transition-all hover:bg-indigo-700 focus:outline-none'
        onClick={copyToClipboard}
      >
        {copied ? (
          <MdCheck className='text-xl' />
        ) : (
          <MdContentCopy className='text-xl' />
        )}
      </button>
    </div>
  )
}

export default CopyTextarea
