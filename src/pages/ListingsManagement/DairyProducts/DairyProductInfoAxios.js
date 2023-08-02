import { API_SERVICE } from '../../../services'
import {
  DairyProductCategoryValues, DairyProductPricePerValues,
  OrderTypeIsSingleOrderValues, OrderTypeIsSubscriptionValues
} from './DairyProductInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchDairyProductData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/dairyProducts/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          uid: response.data.uid || '',
          productName: response.data.productName || '',
          productPrice: response.data.productPrice || '',
          productDescription: response.data.productDescription || '',
          productCategory: DairyProductCategoryValues.find(item => `${item.value}`.toLowerCase() === `${response.data.productCategory}`.toLowerCase()) || '',
          priceUnit: DairyProductPricePerValues.find(item => `${item.value}`.toLowerCase() === `${response.data.priceUnit}`.toLowerCase()) || '',
          orderTypeIsSingleOrder: OrderTypeIsSingleOrderValues.find(item => item.value === response.data.orderType.isSingleOrder) || '',
          orderTypeIsSubscription: OrderTypeIsSubscriptionValues.find(item => item.value === response.data.orderType.isSubscription) || '',
          productImage: response.data.productImage || '',
          productImage__: response.data.productImage || '',
          updatedAt: FormatTimestamp(response.data.updatedAt) || '',
          createdAt: FormatTimestamp(response.data.createdAt) || '',
          rating: `${response.data.rating || 0} / 5`,
          ratingCount: `${response.data.ratingCount || 0} Customer(s)`,
          purchasedCount: `${response.data.purchasedCount || 0} Time(s)`,
          ownerFullname: response.data.owner.fullname || '',
          ownerBusinessName: response.data.owner?.businessName || '',
          ownerEmail: response.data.owner.email || '',
          ownerPrimaryPhone: response.data.owner.phone.primary || '',
          ownerSecondaryPhone: response.data.owner.phone.secondary || '',
          ownerAddress: response.data.owner.address || '',
          ownerGeolocationLongitude: response.data.owner.geoLocation.longitude || '',
          ownerGeolocationLatitude: response.data.owner.geoLocation.latitude || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitDairyProductData = async ({
  id,
  navigate,
  values,
  setIsLoading,
  setError,
  setLoadingMessage
}) => {
  setIsLoading(true)
  setLoadingMessage('Please wait...')

  const editEndpoint = `/dairyProducts/${id}`

  const _values = {
    uid: values.uid,
    productName: `${values.productName}`.trim(),
    productPrice: Number(values.productPrice),
    productDescription: `${values.productDescription}`.trim(),
    productCategory: `${values.productCategory.value}`.trim(),
    priceUnit: `${values.priceUnit.value}`.trim(),
    orderType: {
      isSingleOrder: values.orderTypeIsSingleOrder.value,
      isSubscription: values.orderTypeIsSubscription.value,
    },
  }

  if (values?.productImage?.startsWith('data')) {
    setLoadingMessage('Uploading Product Image...')
    const url = await UploadImage(values.productImage, values.productImage__)
    _values.productImage = url
  } else {
    _values.productImage = values.productImage
  }

  const editRedirect = {
    state: {
      message: 'Dairy Product Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating Dairy Product...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/DairyProducts', editRedirect)
        } else {
          setLoadingMessage('')
          setIsLoading(false)
          setError(`${response.status} - ${response.statusText}`)
        }
      }).catch(error => {
        setLoadingMessage('')
        setIsLoading(false)
        HandleAxiosError({ error, setError, navigate })
      })
  }

  await HandleEditMode()
}