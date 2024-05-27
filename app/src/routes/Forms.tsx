import axios from 'axios'
import { Link } from 'react-router-dom'
import { FormListing, FormListingArraySchema } from '../types'
import { useEffect, useState } from 'react'
import { format } from 'date-fns'
import { MdAdd } from 'react-icons/md'

const useForms = () => {
  const [forms, setForms] = useState<FormListing[]>([])

  const setFormState = async () => {
    try {
      const response = await axios.get('/api/admin/forms')
      console.log(response)
      const data = FormListingArraySchema.parse(response.data)
      setForms(data)
    } catch (error) {
      console.error('Failed to fetch forms.', error)
    }
  }

  useEffect(() => {
    setFormState()
  }, [])

  return { forms }
}

const Forms = () => {
  const { forms } = useForms()

  return (
    <div className='w-full'>
      {forms.length === 0 ? (
        <p className='text-center font-light'>No forms created yet.</p>
      ) : (
        <table className='text-md overflow w-full overflow-hidden rounded-lg text-left text-gray-500 shadow-md'>
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
          <tbody className='bg-gray-50'>
            {forms.map((form: FormListing) => (
              <tr key={form.id}>
                <th className='px-6 py-3 font-medium text-gray-900'>
                  {form.translations[0].title}
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
      )}
      <div className='flex justify-center pt-8'>
        <Link to='form/new'>
          <button
            type='button'
            className='flex items-center gap-2 rounded-md bg-blue-600 px-3 py-2 text-white shadow-md transition-all hover:bg-blue-700 hover:shadow-inner'
          >
            <MdAdd size={24} />
            Create new form
          </button>
        </Link>
      </div>
    </div>
  )
}

export default Forms
