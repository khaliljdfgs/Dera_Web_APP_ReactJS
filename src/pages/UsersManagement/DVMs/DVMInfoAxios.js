import { API_SERVICE } from '../../../services'
import { StatusOptions, GenderOptions } from './DVMInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchDVMData = async ({
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
          specialization: response.data?.specialization || '',
          yearsOfExperience: response.data?.yearsOfExperience || '',
          updatedAt: FormatTimestamp(response.data.updatedAt) || '',
          createdAt: FormatTimestamp(response.data.createdAt) || '',
          facebook: response.data?.socialMediaHandles?.facebook || '',
          twitter: response.data?.socialMediaHandles?.twitter || '',
          instagram: response.data?.socialMediaHandles?.instagram || '',
          tiktok: response.data?.socialMediaHandles?.tiktok || '',
          youtube: response.data?.socialMediaHandles?.youtube || '',
          easyPaisaTitle: response.data?.paymentWallets?.easyPaisa?.title || '',
          easyPaisaNumber: response.data?.paymentWallets?.easyPaisa?.number || '',
          jazzCashTitle: response.data?.paymentWallets?.jazzCash?.title || '',
          jazzCashNumber: response.data?.paymentWallets?.jazzCash?.number || '',
          uPaisaTitle: response.data?.paymentWallets?.uPaisa?.title || '',
          uPaisaNumber: response.data?.paymentWallets?.uPaisa?.number || '',
          profilePhoto: response.data?.profilePhoto || '',
          profilePhoto__: response.data?.profilePhoto || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}


export const SubmitDVMData = async ({
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
    accountType: values.accountType || 'dvm',
    specialization: `${values.specialization}`.trim(),
    yearsOfExperience: Number(values.yearsOfExperience),
    socialMediaHandles: {
      facebook: `${values.facebook}`.trim(),
      twitter: `${values.twitter}`.trim(),
      instagram: `${values.instagram}`.trim(),
      tiktok: `${values.tiktok}`.trim(),
      youtube: `${values.youtube}`.trim(),
    },
    paymentWallets: {
      easyPaisa: {
        title: `${values.easyPaisaTitle}`.trim(),
        number: `${values.easyPaisaNumber}`.trim(),
      },
      jazzCash: {
        title: `${values.jazzCashTitle}`.trim(),
        number: `${values.jazzCashNumber}`.trim(),
      },
      uPaisa: {
        title: `${values.uPaisaTitle}`.trim(),
        number: `${values.uPaisaNumber}`.trim(),
      },
    }
  }

  if (values?.profilePhoto?.startsWith('data')) {
    setLoadingMessage('Uploading Profile Photo...')
    const url = await UploadImage(values.profilePhoto, values.profilePhoto__)
    _values.profilePhoto = url
  } else {
    _values.profilePhoto = values.profilePhoto
  }

  const addRedirect = {
    state: {
      message: 'DVM Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'DVM Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating DVM Profile...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/DVMs', editRedirect)
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
    setLoadingMessage('Creating DVM Profile...')

    await API_SERVICE()
      .post(addEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/DVMs', addRedirect)
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