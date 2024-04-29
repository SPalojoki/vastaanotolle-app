import axios from 'axios'
import { useLoaderData } from 'react-router-dom'
import { isFormArray } from '../types/guards'
import type { LoaderData, Form } from '../types'
import { format } from 'date-fns'
import { HiPlus } from 'react-icons/hi'

export const loader = async () => {
  const { data } = await axios.get('http://localhost:3000/admin/forms')
  return { data }
}

const Forms = () => {
  const { data } = useLoaderData() as LoaderData

  if (!isFormArray(data)) {
    throw new Error('Received malformatted data from the server!')
  }

  return (
    <div className='w-full'>
      <div className='mb-8 flex items-center justify-between'>
        <h1 className=' text-3xl font-bold'>Forms</h1>
        <button
          type='button'
          className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white transition-all hover:bg-blue-700'
        >
          <HiPlus size={24} />
          Create new form
        </button>
      </div>
      <table className='text-md w-full overflow-clip rounded-lg text-left text-gray-500 shadow-sm'>
        <thead className='overflow-hidden bg-gray-200 text-sm uppercase text-gray-700'>
          <tr>
            <th className='px-6 py-3'>Title</th>
            <th className='px-6 py-3'>Access code</th>
            <th className='px-6 py-3'>Published</th>
            <th className='px-6 py-3'>Created at</th>
            <th className='px-6 py-3'>Updated at</th>
            <th className='px-6 py-3'>Action</th>
          </tr>
        </thead>
        <tbody>
          {data.map((form: Form) => (
            <tr key={form.id}>
              <th className='px-6 py-3 font-medium text-gray-900'>
                {form.title}
              </th>
              <td className='px-6 py-3'>{form.accessCode}</td>
              <td className='px-6 py-3'>{form.published ? 'Yes' : 'No'}</td>
              <td className='px-6 py-3'>
                {format(new Date(form.createdAt), 'dd MMM yyyy HH:mm')}
              </td>
              <td className='px-6 py-3'>
                {format(new Date(form.updatedAt), 'dd MMM yyyy HH:mm')}
              </td>
              <td className='px-6 py-3 text-blue-600'>Edit</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Forms
