import * as Yup from 'yup'

const PushNotificationsSchema = Yup.object().shape({
  title: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(50, 'Too Long!')
    .required('Required!'),

  content: Yup.string()
    .trim()
    .min(3, 'Too Short!')
    .max(1000, 'Too Long!')
    .required('Required!'),

  readMore: Yup.string()
    .trim()
    .url('Invalid URL!'),

  notificationPhoto: Yup.string()
    .trim()
    .required('Required!'),

  accountType: Yup.object()
    .shape({
      value: Yup.string().required('Required!'),
      label: Yup.string().required('Required!')
    })
    .required('Required!'),
})

export { PushNotificationsSchema }