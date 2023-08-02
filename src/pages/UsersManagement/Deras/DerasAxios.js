import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchDeras = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/users?accountType=dera`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.users.forEach((user, index) => {
          user.rowNumber = index + 1
          user.primaryPhone = user?.phone?.primary || 'Not Set'
          user.businessName = user?.businessName || 'Not Set'
          user.status = UpperCaseFirstLetter(user?.status)
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

export const DeleteDera = async ({
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
        navigate('/Admin/Deras', {
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