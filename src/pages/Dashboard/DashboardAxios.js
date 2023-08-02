import { API_SERVICE } from '../../services'
import { HandleAxiosError } from '../../utilities.js'

export const FetchUserData = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dashboard/userStats`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsLoading(false)
}

export const FetchDairyProductData = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dashboard/dairyProductStats`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsLoading(false)
}

export const FetchLivestockData = async ({
  setError,
  setData,
  navigate,
  setIsLoading,
}) => {
  const endpoint = `/dashboard/livestockStats`
  setIsLoading(true)

  await API_SERVICE()
    .get(endpoint)
    .then(response => {
      if (response.status === 200) {
        setData(response.data)
        setError('')
      } else {
        setError(`${response.status} - ${response.statusText}`)
      }
    }).catch(error => {
      HandleAxiosError({ error, setError, navigate })
    })

  setIsLoading(false)
}