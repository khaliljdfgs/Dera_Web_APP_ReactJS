import { API_SERVICE } from '../../../services'
import { HandleAxiosError, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchLivestockRequestData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/livestockRequests/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')

        const payload = {
          uid: response.data.uid || '',

          consumerFullname: response.data.requestedBy.fullname || '',
          consumerEmail: response.data.requestedBy.email || '',
          consumerPrimaryPhone: response.data.requestedBy.phone.primary || '',
          consumerSecondaryPhone: response.data.requestedBy.phone.secondary || '',
          consumerAddress: response.data.requestedBy.address || '',
          consumerGeolocationLongitude: response.data.requestedBy.geoLocation.longitude || '',
          consumerGeolocationLatitude: response.data.requestedBy.geoLocation.latitude || '',

          ownerFullname: response.data.owner.fullname || '',
          ownerBusinessName: response.data.owner?.businessName || '',
          ownerEmail: response.data.owner.email || '',
          ownerPrimaryPhone: response.data.owner.phone.primary || '',
          ownerSecondaryPhone: response.data.owner.phone.secondary || '',
          ownerAddress: response.data.owner.address || '',
          ownerGeolocationLongitude: response.data.owner.geoLocation.longitude || '',
          ownerGeolocationLatitude: response.data.owner.geoLocation.latitude || '',

          status: UpperCaseFirstLetter(response.data.liveStockStatus) || '',

          imageOne: response.data.liveStockPhotos?.[0] || '',
          imageTwo: response.data.liveStockPhotos?.[1] || '',
          imageThree: response.data.liveStockPhotos?.[2] || '',
          imageFour: response.data.liveStockPhotos?.[3] || '',
          imageFive: response.data.liveStockPhotos?.[4] || '',

          liveStockCategory: UpperCaseFirstLetter(response.data.liveStockCategory) || '',

          color: UpperCaseFirstLetter(response.data.liveStockFeatures.color || '') || '',
          breed: UpperCaseFirstLetter(response.data.liveStockFeatures.breed || '') || '',
          height: `${response.data.liveStockFeatures.height || 0} Inches`,
          weight: `${response.data.liveStockFeatures.weight || 0} Kg`,
          age: `${response.data.liveStockFeatures.age.day || 0} Days, ${response.data.liveStockFeatures.age.month || 0} Months, ${response.data.liveStockFeatures.age.year || 0} Years`,
          teethCount: `${response.data.liveStockFeatures.teethCount || 0}`,

          liveStockTitle: response.data.liveStockTitle || '',
          liveStockDescription: response.data.liveStockDescription || '',
          liveStockPrice: response.data.liveStockPrice || '',
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