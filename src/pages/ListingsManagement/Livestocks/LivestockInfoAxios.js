import { API_SERVICE } from '../../../services'
import {
  LivestockStatusValues,
  LivestockCategoryValues,
} from './LivestockInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchLivestockData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/livestocks/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          uid: response.data.uid || '',
          liveStockTitle: response.data.liveStockTitle || '',
          liveStockPrice: response.data.liveStockPrice || '',
          liveStockDescription: response.data.liveStockDescription || '',
          liveStockCategory: LivestockCategoryValues.find(item => {
            return `${item.value}`.toLowerCase() === `${response.data.liveStockCategory}`.toLowerCase()
          }) || '',
          liveStockStatus: LivestockStatusValues.find(item => {
            return `${item.value}`.toLowerCase() === `${response.data.liveStockStatus}`.toLowerCase()
          }) || '',

          breed: response.data.liveStockFeatures?.breed || '',

          color: response.data.liveStockFeatures?.color || '',
          ageDay: response.data.liveStockFeatures?.age?.day || 0,
          ageMonth: response.data.liveStockFeatures?.age?.month || 0,
          ageYear: response.data.liveStockFeatures?.age?.year || 0,
          height: response.data.liveStockFeatures?.height || '',
          weight: response.data.liveStockFeatures?.weight || '',
          teethCount: response.data.liveStockFeatures?.teethCount || '',

          predictions_breed: response.data.predictions?.breed || '',
          predictions_confidence: Number(response.data.predictions?.confidence).toFixed(2) || '',
          predictions_weight: Number(response.data.predictions?.weight).toFixed(2) || '',
          predictions_height: Number(response.data.predictions?.height).toFixed(2) || '',

          imageOne: response.data.liveStockPhotos?.[0] || '',
          imageOne__: response.data.liveStockPhotos?.[0] || '',
          imageTwo: response.data.liveStockPhotos?.[1] || '',
          imageTwo__: response.data.liveStockPhotos?.[1] || '',
          imageThree: response.data.liveStockPhotos?.[2] || '',
          imageThree__: response.data.liveStockPhotos?.[2] || '',
          imageFour: response.data.liveStockPhotos?.[3] || '',
          imageFour__: response.data.liveStockPhotos?.[3] || '',
          imageFive: response.data.liveStockPhotos?.[4] || '',
          imageFive__: response.data.liveStockPhotos?.[4] || '',

          updatedAt: FormatTimestamp(response.data.updatedAt) || '',
          createdAt: FormatTimestamp(response.data.createdAt) || '',
          ownerFullname: response.data.owner.fullname || '',
          ownerBusinessName: response.data.owner.businessName || '',
          ownerEmail: response.data.owner.email || '',
          ownerPrimaryPhone: response.data.owner.phone.primary || '',
          ownerSecondaryPhone: response.data.owner.phone.secondary || '',
          ownerAddress: response.data.owner.address || '',
          ownerGeolocationLongitude: response.data.owner.geoLocation.longitude || '',
          ownerGeolocationLatitude: response.data.owner.geoLocation.latitude || '',

          soldOutToFullname: (response.data?.soldOutTo?.fullname && response.data.soldOutTo.fullname) || '',
          soldOutToEmail: (response.data?.soldOutTo?.email && response.data.soldOutTo.email) || '',
          soldOutToPrimaryPhone: (response.data?.soldOutTo?.phone.primary && response.data.soldOutTo.phone.primary) || '',
          soldOutToSecondaryPhone: (response.data?.soldOutTo?.phone.secondary && response.data.soldOutTo.phone.secondary) || '',
          soldOutToAddress: (response.data?.soldOutTo?.address && response.data.soldOutTo.address) || '',
          soldOutToGeolocationLongitude: (response.data?.soldOutTo?.geoLocation.longitude && response.data.soldOutTo.geoLocation.longitude) || '',
          soldOutToGeolocationLatitude: (response.data?.soldOutTo?.geoLocation.latitude && response.data.soldOutTo.geoLocation.latitude) || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitLivestockData = async ({
  id,
  navigate,
  values,
  setIsLoading,
  setError,
  setLoadingMessage,
  formik,
}) => {
  setIsLoading(true)
  setLoadingMessage('Please wait...')

  const editEndpoint = `/livestocks/${id}`

  const _values = {
    uid: values.uid,
    liveStockTitle: `${values.liveStockTitle}`.trim(),
    liveStockPrice: Number(values.liveStockPrice),
    liveStockDescription: `${values.liveStockDescription}`.trim(),
    liveStockCategory: `${values.liveStockCategory.value}`.trim(),
    liveStockStatus: `${values.liveStockStatus.value}`.trim(),
    liveStockFeatures: {
      breed: `${values.breed?.value || values.breed}`.trim(),
      color: `${values.color}`.trim(),
      age: {
        day: Number(values.ageDay),
        month: Number(values.ageMonth),
        year: Number(values.ageYear),
      },
      height: Number(values.height),
      weight: Number(values.weight),
      teethCount: Number(values.teethCount) || 0,
    },
    liveStockPhotos: []
  }

  const _breed = `${_values.liveStockFeatures.breed}`.trim() || ''
  if (!_breed) {
    formik.setFieldError('breed', 'Required!')
    return
  } else if (_breed?.length < 3) {
    formik.setFieldError('breed', 'Too short!')
    return
  } else if (_breed?.length > 50) {
    formik.setFieldError('breed', 'Too long!')
    return
  }

  if (values?.imageOne?.startsWith('data')) {
    setLoadingMessage('Uploading Image One...')
    const url = await UploadImage(values.imageOne, values.imageOne__)
    _values.imageOne = url
  } else {
    _values.imageOne = values.imageOne || ''
  }

  if (values?.imageTwo?.startsWith('data')) {
    setLoadingMessage('Uploading Image Two...')
    const url = await UploadImage(values.imageTwo, values.imageTwo__)
    _values.imageTwo = url
  } else {
    _values.imageTwo = values.imageTwo || ''
  }

  if (values?.imageThree?.startsWith('data')) {
    setLoadingMessage('Uploading Image Three...')
    const url = await UploadImage(values.imageThree, values.imageThree__)
    _values.imageThree = url
  } else {
    _values.imageThree = values.imageThree || ''
  }

  if (values?.imageFour?.startsWith('data')) {
    setLoadingMessage('Uploading Image Four...')
    const url = await UploadImage(values.imageFour, values.imageFour__)
    _values.imageFour = url
  } else {
    _values.imageFour = values.imageFour || ''
  }

  if (values?.imageFive?.startsWith('data')) {
    setLoadingMessage('Uploading Image Five...')
    const url = await UploadImage(values.imageFive, values.imageFive__)
    _values.imageFive = url
  } else {
    _values.imageFive = values.imageFive || ''
  }

  _values.liveStockPhotos = [
    _values.imageOne,
    _values.imageTwo,
    _values.imageThree,
    _values.imageFour,
    _values.imageFive,
  ]

  const editRedirect = {
    state: {
      message: 'Livestock Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating Livestock...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Livestocks', editRedirect)
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