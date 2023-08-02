import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError } from '../../../utilities.js'

export const FetchDairyProducts = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dairyProducts`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((dairyProduct, index) => {
          dairyProduct.rowNumber = index + 1
          dairyProduct.price = `Rs. ${dairyProduct.productPrice} / ${dairyProduct.priceUnit}`
          dairyProduct.owner = dairyProduct.owner.businessName
          dairyProduct.updatedAt = FormatTimestamp(dairyProduct.updatedAt)
          dairyProduct.createdAt = FormatTimestamp(dairyProduct.createdAt)
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

export const DeleteDairyProduct = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/dairyProducts/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/DairyProducts', {
          state: {
            message: 'Dairy Product Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}