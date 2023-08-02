import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError } from '../../../utilities.js'

export const FetchQueriesData = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/queries`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((query, index) => {
          query.rowNumber = index + 1
          query.submittedBy = query.submittedBy.fullname
          query.submittedAt = FormatTimestamp(query.submittedAt)
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

export const DeleteQuery = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/queries/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/Queries', {
          state: {
            message: 'Query Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}