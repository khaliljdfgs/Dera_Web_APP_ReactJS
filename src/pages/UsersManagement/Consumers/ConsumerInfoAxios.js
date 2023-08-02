import { API_SERVICE } from '../../../services'
import { StatusOptions, GenderOptions } from './ConsumerInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchConsumerData = async ({
  id,
  navigate,
  setError,
  setIsGettingData,
  setInitialValues,
}) => {
  setIsGettingData(true)

  const endpoint = `/users/${id}`

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setError('')
        setInitialValues({
          uid: response.data?.uid || '',
          fullname: response.data?.fullname || '',
          address: response.data?.address || '',
          email: response.data?.email || '',
          primaryPhone: response.data?.phone?.primary || '',
          secondaryPhone: response.data?.phone?.secondary || '',
          latitude: response.data?.geoLocation?.latitude || '',
          longitude: response.data?.geoLocation?.longitude || '',
          status: StatusOptions.filter(status => status.value === response.data?.status)[0],
          gender: GenderOptions.filter(gender => gender.value === response.data?.gender)[0],
          accountType: response.data?.accountType || '',
          updatedAt: FormatTimestamp(response.data.updatedAt) || '',
          createdAt: FormatTimestamp(response.data.createdAt) || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}


export const SubmitConsumerData = async ({
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

  const editEndpoint = `/users/${id}`
  const addEndpoint = `/users/`

  const _values = {
    fullname: `${values.fullname}`.trim(),
    address: `${values.address}`.trim(),
    email: `${values.email}`.trim(),
    phone: {
      primary: `${values.primaryPhone}`.trim(),
      secondary: `${values.secondaryPhone}`.trim(),
    },
    geoLocation: {
      latitude: Number(values.latitude),
      longitude: Number(values.longitude),
    },
    status: `${values.status.value}`.trim(),
    gender: `${values.gender.value}`.trim(),
    password: values.password || null,
    accountType: values.accountType || 'consumer',
  }

  if (values?.profilePhoto?.startsWith('data')) {
    setLoadingMessage('Uploading Profile Photo...')
    const url = await UploadImage(values.profilePhoto, values.profilePhoto__)
    _values.profilePhoto = url
  } else {
    _values.profilePhoto = values.profilePhoto || null
  }

  const addRedirect = {
    state: {
      message: 'Consumer Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'Consumer Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating Consumer Profile...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Consumers', editRedirect)
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

  const HandleCreateMode = async () => {
    setLoadingMessage('Creating Consumer Profile...')

    await API_SERVICE()
      .post(addEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Consumers', addRedirect)
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

  isEditMode ? await HandleEditMode() : await HandleCreateMode()
}