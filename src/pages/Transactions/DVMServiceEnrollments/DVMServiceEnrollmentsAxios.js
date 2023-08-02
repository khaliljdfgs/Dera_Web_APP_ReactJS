import { API_SERVICE } from '../../../services'
import { FormatTimestamp, HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchDVMServiceEnrollments = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dvmServiceEnrollments`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        response.data.forEach((dvmServiceEnrollment, index) => {
          dvmServiceEnrollment.rowNumber = index + 1
          dvmServiceEnrollment.title = dvmServiceEnrollment.service.serviceTitle
          dvmServiceEnrollment.owner = dvmServiceEnrollment.owner.fullname
          dvmServiceEnrollment.availedBy = dvmServiceEnrollment.availedBy.businessName
          dvmServiceEnrollment.status = UpperCaseFirstLetter(dvmServiceEnrollment.serviceStatus)
          dvmServiceEnrollment.availedAt = FormatTimestamp(dvmServiceEnrollment.serviceAvailedAt)
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

export const DeleteDVMServiceEnrollment = async ({
  id,
  navigate,
  setError,
  setIsDeleting,
}) => {
  const endpoint = `/dvmServiceEnrollments/${id}`

  setIsDeleting(true)

  await API_SERVICE()
    .delete(endpoint)
    .then(response => {
      if (response.status === 200) {
        navigate('/Admin/ServiceEnrollments', {
          state: {
            message: 'DVM Service Enrollment Deleted Successfully!'
          },
          replace: true
        })
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsDeleting(false)
}