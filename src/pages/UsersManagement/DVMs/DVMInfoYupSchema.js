import * as Yup from 'yup'

const DVMInfoBase = {
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

  yearsOfExperience: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  specialization: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!'),

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

  facebook: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Only Alphabets, Numbers, Dots, Hyphens and Underscores Allowed!')
    .min(2, 'Too Short!')
    .max(200, 'Too Long!'),

  twitter: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Only Alphabets, Numbers, Dots, Hyphens and Underscores Allowed!')
    .min(2, 'Too Short!')
    .max(200, 'Too Long!'),

  instagram: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Only Alphabets, Numbers, Dots, Hyphens and Underscores Allowed!')
    .min(2, 'Too Short!')
    .max(200, 'Too Long!'),

  tiktok: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Only Alphabets, Numbers, Dots, Hyphens and Underscores Allowed!')
    .min(2, 'Too Short!')
    .max(200, 'Too Long!'),

  youtube: Yup.string()
    .trim()
    .matches(/^[a-zA-Z0-9_.-]*$/, 'Only Alphabets, Numbers, Dots, Hyphens and Underscores Allowed!')
    .min(2, 'Too Short!')
    .max(200, 'Too Long!'),

  easyPaisaTitle: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!'),

  easyPaisaNumber: Yup.string().when('easyPaisaTitle', {
    is: (val) => val && val.length > 0,
    then: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Required!'),
    otherwise: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!'),
  }),

  jazzCashTitle: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!'),

  jazzCashNumber: Yup.string().when('jazzCashTitle', {
    is: (val) => val && val.length > 0,
    then: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Required!'),
    otherwise: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!'),
  }),

  uPaisaTitle: Yup.string()
    .trim()
    .min(2, 'Too Short!')
    .max(50, 'Too Long!'),

  uPaisaNumber: Yup.string().when('uPaisaTitle', {
    is: (val) => val && val.length > 0,
    then: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!')
      .required('Required!'),
    otherwise: () => Yup.string()
      .trim()
      .matches(/^[0-9]{11}$/, 'Invalid Account Number!')
      .min(11, 'Too Short!')
      .max(11, 'Too Long!'),
  }),
}

const DVMInfoAddSchema = Yup.object().shape({
  ...DVMInfoBase,
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(25, 'Too Long!')
    .required('Required!'),
})

const DVMInfoEditSchema = Yup.object().shape({
  ...DVMInfoBase,
  password: Yup.string()
    .min(6, 'Too Short!')
    .max(25, 'Too Long!'),
})

export { DVMInfoAddSchema, DVMInfoEditSchema }