import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchDairyOrders = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dairyOrders`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((dairyOrder, index) => {
          dairyOrder.rowNumber = index + 1
          dairyOrder.title = dairyOrder.product.productName
          dairyOrder.owner = dairyOrder.owner.businessName
          dairyOrder.placedBy = dairyOrder.placedBy.fullname
          dairyOrder.deliveryTime = UpperCaseFirstLetter(dairyOrder.deliveryTime || '') || ''
          dairyOrder.status = UpperCaseFirstLetter(dairyOrder.status)
          dairyOrder.placedOn = FormatTimestamp(dairyOrder.placedOn)
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

export const DeleteDairyOrder = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/dairyOrders/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/DairyOrders', {
          state: {
            message: 'Dairy Order Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}