import { API_SERVICE } from '../../../services'
import { HandleAxiosError, FormatTimestamp } from '../../../utilities.js'

export const FetchQueryData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/queries/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')

        const payload = {
          uid: response.data.uid || '',

          submittedByFullname: response.data.submittedBy.fullname || '',
          submittedByEmail: response.data.submittedBy.email || '',
          submittedByPrimaryPhone: response.data.submittedBy.phone.primary || '',
          submittedBySecondaryPhone: response.data.submittedBy.phone.secondary || '',
          submittedByAddress: response.data.submittedBy.address || '',
          submittedByGeolocationLongitude: response.data.submittedBy.geoLocation.longitude || '',
          submittedByGeolocationLatitude: response.data.submittedBy.geoLocation.latitude || '',

          submittedAt: FormatTimestamp(response.data.submittedAt) || '',
          subject: response.data.subject || '',
          query: response.data.query || '',
        }

        setInitialValues(payload)
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}