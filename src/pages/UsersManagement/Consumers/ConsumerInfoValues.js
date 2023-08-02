export const InitialValues = {
  uid: '',
  fullname: '',
  address: '',
  email: '',
  primaryPhone: '',
  secondaryPhone: '',
  latitude: '',
  longitude: '',
  status: {
    value: '',
    label: 'Choose Status'
  },
  gender: {
    value: '',
    label: 'Choose Gender'
  },
  accountType: '',
  profilePhoto: '',
  profilePhoto__: '',
}

export const StatusOptions = [
  {
    value: 'pending',
    label: 'Pending'
  },
  {
    value: 'active',
    label: 'Active'
  },
  {
    value: 'suspended',
    label: 'Suspended'
  }
]

export const GenderOptions = [
  {
    value: 'male',
    label: 'Male'
  },
  {
    value: 'female',
    label: 'Female'
  },
  {
    value: 'other',
    label: 'Other'
  }
]