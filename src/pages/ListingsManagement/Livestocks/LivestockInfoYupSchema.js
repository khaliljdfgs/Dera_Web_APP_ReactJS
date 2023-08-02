import * as Yup from 'yup'

const LivestockInfoSchema = Yup.object().shape({
  uid: Yup.string(),

  liveStockTitle: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  liveStockPrice: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  liveStockDescription: Yup.string()
    .trim()
    .min(5, 'Too Short!')
    .max(250, 'Too Long!')
    .required('Required!'),

  liveStockCategory: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  liveStockStatus: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  imageOne: Yup.string()
    .trim()
    .required('Required!'),

  color: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  ageDay: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .max(31, 'Too Long!')
    .required('Required!'),

  ageMonth: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .max(12, 'Too Long!')
    .required('Required!'),

  ageYear: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .max(100, 'Too Long!')
    .required('Required!'),

  height: Yup.number()
    .typeError('Invalid')
    .min(3, 'Too Short!')
    .max(250, 'Too Long!')
    .required('Required!'),

  weight: Yup.number()
    .typeError('Invalid')
    .min(1, 'Too Short!')
    .max(2000, 'Too Long!')
    .required('Required!'),

  teethCount: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .max(32, 'Too Long!'),
})

export { LivestockInfoSchema }