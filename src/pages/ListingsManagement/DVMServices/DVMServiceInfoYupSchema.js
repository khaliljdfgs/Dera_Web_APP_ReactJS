import * as Yup from 'yup'

const DVMServiceInfoSchema = Yup.object().shape({
  uid: Yup.string(),

  serviceTitle: Yup.string()
    .trim()
    .min(5, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  serviceDescription: Yup.string()
    .trim()
    .min(5, 'Too Short!')
    .max(250, 'Too Long!')
    .required('Required!'),

  serviceCharges: Yup.number()
    .typeError('Invalid')
    .min(0, 'Too Short!')
    .required('Required!'),

  serviceChargesPer: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  serviceImage: Yup.string()
    .trim()
    .required('Required!'),

  serviceTypeIsRemote: Yup.object()
    .shape({
      value: Yup.boolean().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),

  serviceTypeIsOnSite: Yup.object()
    .shape({
      value: Yup.boolean().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
})

export { DVMServiceInfoSchema }