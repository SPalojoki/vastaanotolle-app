import AlterForm from '../components/AlterForm'
import useAdminFormItems from '../hooks/useAdminFormItems'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'

const NewForm = () => {
  const navigate = useNavigate()
  const adminFormItems = useAdminFormItems()

  const { formItems } = adminFormItems

  const saveForm = () => {
    axios.post('/api/admin/form', formItems).then(() => {
      navigate('/admin')
    })
  }

  return (
    <>
      <AlterForm useAdminFormItems={adminFormItems} finalAction={saveForm} />
    </>
  )
}

export default NewForm
