import React from 'react'

const Selector = ({
  options,
  selected,
  setSelected,
  title,
}: {
  options: string[]
  selected: string
  setSelected: (value: string) => void
  title: string
}) => {
  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelected(event.target.value)
  }

  return (
    <div>
      <label
        htmlFor='selector'
        className='text-md mr-2 font-medium text-gray-700'
      >
        {title}
      </label>
      <select
        id='selector'
        value={selected}
        onChange={handleChange}
        className='rounded-md border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm'
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}

export default Selector
