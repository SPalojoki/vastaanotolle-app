import AlterForm from '../components/AlterForm'
import useAdminFormItems from '../hooks/useAdminFormItems'
import axios from 'axios'
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useParams } from 'react-router-dom'
import { FormSchema } from '../types'

const EditForm = () => {
  const navigate = useNavigate()
  const { id } = useParams()

  const adminFormItems = useAdminFormItems()
  const { formItems, setFormItems } = adminFormItems

  const fetchForm = async () => {
    try {
      const res = await axios.get(`/api/admin/form/${id}`)
      const data = FormSchema.parse(res.data)
      setFormItems(data)
    } catch (e) {
      console.error(e)
    }
  }

  const editForm = () => {
    axios.put(`/api/admin/form/${id}`, formItems).then(() => {
      navigate('/admin')
    })
  }

  useEffect(() => {
    fetchForm()
  }, [])

  return (
    <>
      <AlterForm useAdminFormItems={adminFormItems} finalAction={editForm} />
    </>
  )
}

export default EditForm
