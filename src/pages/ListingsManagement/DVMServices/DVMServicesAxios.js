import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError } from '../../../utilities.js'

export const FetchDVMServices = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/services`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((service, index) => {
          service.rowNumber = index + 1
          service.serviceCharges = `Rs. ${service.serviceCharges} / ${service.serviceChargesPer}`
          service.owner = service.owner.fullname
          service.updatedAt = FormatTimestamp(service.updatedAt)
          service.createdAt = FormatTimestamp(service.createdAt)
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

export const DeleteDVMService = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/services/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/Services', {
          state: {
            message: 'DVM Service Deleted Successfully!',
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}