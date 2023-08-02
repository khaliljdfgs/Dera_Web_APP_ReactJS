import { API_SERVICE } from '../../../services'
import { ServiceChargesPerValues, ServiceTypeIsOnSiteValues, ServiceTypeIsRemoteValues } from './DVMServiceInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchDVMServiceData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/services/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          uid: response.data.uid || '',
          serviceTitle: response.data.serviceTitle || '',
          serviceCharges: response.data.serviceCharges || '',
          serviceDescription: response.data.serviceDescription || '',
          serviceChargesPer: ServiceChargesPerValues.find(item => `${item.value}`.toLowerCase() === `${response.data.serviceChargesPer}`.toLowerCase()) || '',
          serviceTypeIsRemote: ServiceTypeIsRemoteValues.find(item => item.value === response.data.serviceType.isRemote) || '',
          serviceTypeIsOnSite: ServiceTypeIsOnSiteValues.find(item => item.value === response.data.serviceType.isOnSite) || '',
          serviceImage: response.data.serviceImage || '',
          serviceImage__: response.data.serviceImage || '',
          updatedAt: FormatTimestamp(response.data.updatedAt) || '',
          createdAt: FormatTimestamp(response.data.createdAt) || '',
          ownerFullname: response.data.owner.fullname || '',
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

export const SubmitDVMServiceData = async ({
  id,
  navigate,
  values,
  isEditMode,
  setIsLoading,
  setError,
  setLoadingMessage
}) => {
  setIsLoading(true)
  setLoadingMessage('Please wait...')

  const editEndpoint = `/services/${id}`

  const _values = {
    uid: values.uid,
    serviceTitle: `${values.serviceTitle}`.trim(),
    serviceCharges: Number(values.serviceCharges),
    serviceDescription: `${values.serviceDescription}`.trim(),
    serviceChargesPer: `${values.serviceChargesPer.value}`.trim(),
    serviceType: {
      isRemote: values.serviceTypeIsRemote.value,
      isOnSite: values.serviceTypeIsOnSite.value,
    },
  }

  if (values?.serviceImage?.startsWith('data')) {
    setLoadingMessage('Uploading Service Image...')
    const url = await UploadImage(values.serviceImage, values.serviceImage__)
    _values.serviceImage = url
  } else {
    _values.serviceImage = values.serviceImage
  }

  const editRedirect = {
    state: {
      message: 'DVM Service Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating DVM Service...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Services', editRedirect)
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