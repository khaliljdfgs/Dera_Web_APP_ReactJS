import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchConsumers = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/users?accountType=consumer`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.users.forEach((user, index) => {
          user.rowNumber = index + 1
          user.primaryPhone = user?.phone?.primary || 'Not Set'
          user.status = UpperCaseFirstLetter(user.status)
          user.updatedAt = FormatTimestamp(user.updatedAt)
          user.createdAt = FormatTimestamp(user.createdAt)
        })
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsLoading(false)
}

export const DeleteConsumer = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/users/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/Consumers', {
          state: {
            message: 'User Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}