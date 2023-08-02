import { API_SERVICE } from '../../../services'
import { HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchLivestockRequests = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/livestockRequests`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((livestockRequest, index) => {
          livestockRequest.rowNumber = index + 1
          livestockRequest.title = livestockRequest.liveStockTitle
          livestockRequest.price = `Rs. ${livestockRequest.liveStockPrice}`
          livestockRequest.owner = livestockRequest.owner.businessName
          livestockRequest.requestedBy = livestockRequest.requestedBy.fullname
          livestockRequest.status = UpperCaseFirstLetter(livestockRequest.liveStockStatus)
          livestockRequest.liveStockCategory = UpperCaseFirstLetter(livestockRequest.liveStockCategory)
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

export const DeleteLivestockRequest = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/livestockRequests/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/LivestockRequests', {
          state: {
            message: 'Livestock Request Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}