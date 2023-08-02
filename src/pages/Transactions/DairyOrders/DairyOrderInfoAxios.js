import { API_SERVICE } from '../../../services'
import { HandleAxiosError, FormatTimestamp, UpperCaseFirstLetter } from '../../../utilities.js'

export const FetchDairyOrderData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/dairyOrders/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')

        const payload = {
          uid: response.data.uid || '',

          consumerFullname: response.data.placedBy.fullname || '',
          consumerEmail: response.data.placedBy.email || '',
          consumerPrimaryPhone: response.data.placedBy.phone.primary || '',
          consumerSecondaryPhone: response.data.placedBy.phone.secondary || '',
          consumerAddress: response.data.placedBy.address || '',
          consumerGeolocationLongitude: response.data.placedBy.geoLocation.longitude || '',
          consumerGeolocationLatitude: response.data.placedBy.geoLocation.latitude || '',

          ownerFullname: response.data.owner.fullname || '',
          ownerBusinessName: response.data.owner?.businessName || '',
          ownerEmail: response.data.owner.email || '',
          ownerPrimaryPhone: response.data.owner.phone.primary || '',
          ownerSecondaryPhone: response.data.owner.phone.secondary || '',
          ownerAddress: response.data.owner.address || '',
          ownerGeolocationLongitude: response.data.owner.geoLocation.longitude || '',
          ownerGeolocationLatitude: response.data.owner.geoLocation.latitude || '',

          placedOn: FormatTimestamp(response.data.placedOn) || '',
          confirmedOn: (response.data?.confirmedOn && FormatTimestamp(response.data?.confirmedOn)) || '',
          cancelledOn: (response.data?.cancelledOn && FormatTimestamp(response.data?.cancelledOn)) || '',
          deliveredOn: (response.data?.deliveredOn && FormatTimestamp(response.data?.deliveredOn)) || '',
          rejectedOn: (response.data?.rejectedOn && FormatTimestamp(response.data?.rejectedOn)) || '',

          status: UpperCaseFirstLetter(response.data.status) || '',
          deliveryTime: UpperCaseFirstLetter(response.data.deliveryTime) || '',

          productName: response.data.product.productName || '',
          productDescription: response.data.product.productDescription || '',
          productPrice: `${response.data.product.productPrice || ''} / ${response.data.product.priceUnit || ''}`,
          productImage: response.data.product.productImage || '',
          productCategory: UpperCaseFirstLetter(response.data.product.productCategory || ''),
          rating: `${response.data.rating || 0} / 5`,
          ratingCount: `${response.data.ratingCount || 0} Customer(s)`,
          purchasedCount: `${response.data.purchasedCount || 0} Time(s)`,

          isSingleOrder: response.data.isSingleOrder || false,
          isSubscription: response.data.isSubscription || false,

          quantity: `${response.data.quantity || 0} ${response.data.product.priceUnit || ''}`,
        }

        if (response.data.isSubscription) {
          payload.dailyStatus = response.data.dailyStatus || []

          payload.dailyStatus.forEach((status, index) => {
            payload.dailyStatus[index] = UpperCaseFirstLetter(status)
          })
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