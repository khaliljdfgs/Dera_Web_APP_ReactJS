import * as Yup from 'yup'

const DairyProductInfoSchema = Yup.object().shape({
  uid: Yup.string(),

  productName: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  productPrice: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  productDescription: Yup.string()
    .trim()
    .min(5, 'Too Short!')
    .max(250, 'Too Long!')
    .required('Required!'),

  productCategory: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  priceUnit: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  productImage: Yup.string()
    .trim()
    .required('Required!'),

  orderTypeIsSingleOrder: Yup.object()
    .shape({
      value: Yup.boolean().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  orderTypeIsSubscription: Yup.object()
    .shape({
      value: Yup.boolean().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
})

export { DairyProductInfoSchema }