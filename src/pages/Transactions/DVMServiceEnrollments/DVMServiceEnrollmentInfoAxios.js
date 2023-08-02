import { API_SERVICE } from '../../../services'
import { HandleAxiosError, FormatTimestamp, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchDVMServiceEnrollmentData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/dvmServiceEnrollments/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')

        const payload = {
          uid: response.data.uid || '',

          availedByFullname: response.data.availedBy.fullname || '',
          availedByBusinessName: response.data.availedBy.businessName || '',
          availedByEmail: response.data.availedBy.email || '',
          availedByPrimaryPhone: response.data.availedBy.phone.primary || '',
          availedBySecondaryPhone: response.data.availedBy.phone.secondary || '',
          availedByAddress: response.data.availedBy.address || '',
          availedByGeolocationLongitude: response.data.availedBy.geoLocation.longitude || '',
          availedByGeolocationLatitude: response.data.availedBy.geoLocation.latitude || '',

          ownerFullname: response.data.owner.fullname || '',
          ownerEmail: response.data.owner.email || '',
          ownerPrimaryPhone: response.data.owner.phone.primary || '',
          ownerSecondaryPhone: response.data.owner.phone.secondary || '',
          ownerAddress: response.data.owner.address || '',
          ownerGeolocationLongitude: response.data.owner.geoLocation.longitude || '',
          ownerGeolocationLatitude: response.data.owner.geoLocation.latitude || '',

          serviceAvailedAt: FormatTimestamp(response.data.serviceAvailedAt) || '',
          serviceStatus: UpperCaseFirstLetter(response.data.serviceStatus) || '',

          serviceImage: response.data.service.serviceImage || '',
          serviceTitle: response.data.service.serviceTitle || '',
          serviceDescription: response.data.service.serviceDescription || '',
          serviceCharges: `Rs. ${response.data.service.serviceCharges || ''} / ${response.data.service.serviceChargesPer || ''}`,
          totalAvailments: `${response.data.totalAvailments || 0} Time(s)`,
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