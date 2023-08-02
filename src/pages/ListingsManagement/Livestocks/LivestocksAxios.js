import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchLivestocks = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/livestocks`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((livestock, index) => {
          livestock.rowNumber = index + 1
          livestock.liveStockPrice = `Rs. ${livestock.liveStockPrice}`
          livestock.owner = livestock.owner.businessName
          livestock.liveStockStatus = UpperCaseFirstLetter(livestock.liveStockStatus)
          livestock.updatedAt = FormatTimestamp(livestock.updatedAt)
          livestock.createdAt = FormatTimestamp(livestock.createdAt)
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

export const DeleteLivestock = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/livestocks/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/Livestocks', {
          state: {
            message: 'Livestock Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}