import * as Yup from 'yup'

const ConsumerInfoBase = {
  uid: Yup.string(),

  fullname: Yup.string()
    .trim()
    .matches(/^[a-zA-Z\s-.]+$/, 'Only Alphabets, Spaces, Dots and Hyphens Allowed!')
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  email: Yup.string()
    .trim()
    .email('Invalid Email!')
    .min(5, 'Too Short!')
    .max(60, 'Too Long!')
    .required('Required!'),

  primaryPhone: Yup.string()
    .trim()
    .matches(/^03[0-9]{9}$/, 'Invalid Phone Number!')
    .min(11, 'Too Short!')
    .max(11, 'Too Long!')
    .required('Required!'),

  secondaryPhone: Yup.string()
    .trim()
    .matches(/^03[0-9]{9}$/, 'Invalid Phone Number!')
    .min(11, 'Too Short!')
    .max(11, 'Too Long!')
    .test('notSame', 'Phone Numbers Should Be Different!', function (value) {
      if (`${value || ''}`.length === 0) return true
      return this.parent.primaryPhone !== value
    }),

  address: Yup.string()
    .trim()
    .min(10, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required!'),

  longitude: Yup.number()
    .typeError('Invalid')
    .min(-180, 'Too Short!')
    .max(180, 'Too Long!')
    .required('Required!'),

  latitude: Yup.number()
    .typeError('Invalid')
    .min(-90, 'Too Short!')
    .max(90, 'Too Long!')
    .required('Required!'),

  status: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  gender: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
}

const ConsumerInfoAddSchema = Yup.object().shape({
  ...ConsumerInfoBase,
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),
})

const ConsumerInfoEditSchema = Yup.object().shape({
  ...ConsumerInfoBase,
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(25, 'Too Long!'),
})

export { ConsumerInfoAddSchema, ConsumerInfoEditSchema }