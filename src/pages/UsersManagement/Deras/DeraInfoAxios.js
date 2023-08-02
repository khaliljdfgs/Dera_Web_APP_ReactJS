import { API_SERVICE } from '../../../services'
import { StatusOptions, GenderOptions } from './DeraInfoValues'
import { HandleAxiosError, FormatTimestamp, UploadImage } from '../../../utilities.js'

export const FetchDeraData = async ({
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
          uid: response.data.uid || '',
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
          businessName: response.data?.businessName || '',
          aboutUs: response.data?.aboutUs || '',
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
          bannerPhotoOne: response.data?.bannerPhotos?.[0] || '',
          bannerPhotoOne__: response.data?.bannerPhotos?.[0] || '',
          bannerPhotoTwo: response.data?.bannerPhotos?.[1] || '',
          bannerPhotoTwo__: response.data?.bannerPhotos?.[1] || '',
          bannerPhotoThree: response.data?.bannerPhotos?.[2] || '',
          bannerPhotoThree__: response.data?.bannerPhotos?.[2] || '',
          bannerPhotoFour: response.data?.bannerPhotos?.[3] || '',
          bannerPhotoFour__: response.data?.bannerPhotos?.[3] || '',
        })
        setIsGettingData(false)
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })
}

export const SubmitDeraData = async ({
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
    accountType: values.accountType || 'dera',
    businessName: `${values.businessName}`.trim(),
    aboutUs: `${values.aboutUs}`.trim(),
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
    },
    bannerPhotos: []
  }

  if (values?.profilePhoto?.startsWith('data')) {
    setLoadingMessage('Uploading Profile Photo...')
    const url = await UploadImage(values.profilePhoto, values.profilePhoto__)
    _values.profilePhoto = url
  } else {
    _values.profilePhoto = values.profilePhoto
  }

  if (values?.bannerPhotoOne?.startsWith('data')) {
    setLoadingMessage('Uploading Banner Photo One...')
    const url = await UploadImage(values.bannerPhotoOne, values.bannerPhotoOne__)
    _values.bannerPhotos.push(url)
  } else {
    _values.bannerPhotos.push(values.bannerPhotoOne)
  }

  if (values?.bannerPhotoTwo?.startsWith('data')) {
    setLoadingMessage('Uploading Banner Photo Two...')
    const url = await UploadImage(values.bannerPhotoTwo, values.bannerPhotoTwo__)
    _values.bannerPhotos.push(url)
  } else {
    _values.bannerPhotos.push(values.bannerPhotoTwo)
  }

  if (values?.bannerPhotoThree?.startsWith('data')) {
    setLoadingMessage('Uploading Banner Photo Three...')
    const url = await UploadImage(values.bannerPhotoThree, values.bannerPhotoThree__)
    _values.bannerPhotos.push(url)
  } else {
    _values.bannerPhotos.push(values.bannerPhotoThree)
  }

  if (values?.bannerPhotoFour?.startsWith('data')) {
    setLoadingMessage('Uploading Banner Photo Four...')
    const url = await UploadImage(values.bannerPhotoFour, values.bannerPhotoFour__)
    _values.bannerPhotos.push(url)
  } else {
    _values.bannerPhotos.push(values.bannerPhotoFour)
  }

  const addRedirect = {
    state: {
      message: 'Dera Created Successfully!',
    },
    replace: true,
  }

  const editRedirect = {
    state: {
      message: 'Dera Updated Successfully!',
    },
    replace: true,
  }

  const HandleEditMode = async () => {
    setLoadingMessage('Updating Dera Profile...')

    await API_SERVICE()
      .patch(editEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Deras', editRedirect)
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
    setLoadingMessage('Creating Dera Profile...')

    await API_SERVICE()
      .post(addEndpoint, JSON.stringify(_values))
      .then(response => {
        if (response.status === 200) {
          navigate('/Admin/Deras', addRedirect)
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