import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useLocation, useNavigate } from 'react-router-dom'
import { Clear, Save } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'
import Select from 'react-select'

import { CustomAlertDialogue, TextField } from '../../../components'
import { APP_TITLE } from '../../../config'
import { ToastValues } from '../../../values'
import { SendPushNotification } from './PushNotificationsAxios'
import { ResizeFile } from '../../../utilities'
import { AccountTypes } from './PushNotificationsValues'
import { PushNotificationsSchema } from './PushNotificationsYupSchema'

const PushNotifications = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [showClearDialogue, setShowClearDialogue] = useState(false)
  const [showUpdateDialogue, setShowUpdateDialogue] = useState(false)

  const [error, setError] = useState('')

  const navigate = useNavigate()
  const { state } = useLocation()

  const [initialValues, setInitialValues] = useState({
    title: '',
    content: '',
    readMore: '',
    notificationPhoto: '',
    notificationPhoto__: '',
    accountType: '',
  })

  useEffect(() => {
    document.title = `Push Notifications | ${APP_TITLE}`

    if (state?.message && !toast.isActive('xyz')) {
      toast.success(state.message, ToastValues)

      navigate('/Admin/PushNotifications', {
        state: {},
        replace: true,
      })
    }
  }, [navigate, state])

  const IconStyles = {
    marginRight: '0.25rem',
    fontSize: '1.25rem',
  }

  const HandleImageUpload = async (e, fieldName, setFieldValue, setFieldError, initialValue) => {
    const file = e.target.files[0]
    if (file?.size / 1024 / 1024 < 5) {
      const resizedImage = await ResizeFile(file, 1600, 1600, 80)
      setFieldValue(fieldName, resizedImage)
    } else {
      setFieldError(fieldName, 'Image size must be of 5MB or less!')
    }
  }

  return (
    <Container style={{
      padding: '1.25rem',
    }}>
      <ToastContainer />
      <Formik
        enableReinitialize={true}
        validationSchema={PushNotificationsSchema}
        initialValues={initialValues}
        onSubmit={(values) => {
          setShowUpdateDialogue(true)
        }}>
        {(formik) => (
          <Form onSubmit={formik.handleSubmit} className='m-0 p-0' method='POST'>
            <Container style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
            }}>
              <p className='p-0 m-0 mb-3 d-inline'>
                <span className='fs-3 fw-bold text-uppercase'>
                  Push Notifications
                </span>
                {
                  loadingMessage &&
                  <span className='fs-6 m-0 text-danger p-0 m-0 ms-3'>{loadingMessage}</span>
                }
              </p>

              {error && <Form.Text className='text-danger ms-3'>{error}</Form.Text>}
              <Container className='m-0 p-0 mt-3'>
                <Row>
                  <Col sm={12} md={6} lg={8} xl={8}>
                    <TextField
                      name='title'
                      formik={formik}
                      label='Title'
                      placeholder='Enter Title' />
                    <TextField
                      name='content'
                      formik={formik}
                      label='Content'
                      multiline={true}
                      placeholder='Enter Content' />

                    <Row>
                      <Col>
                        <Form.Group className='mb-3'>
                          <Form.Label>Account Type</Form.Label>
                          <Select
                            key='accountType'
                            name='accountType'
                            instanceId='accountType'
                            isSearchable={false}
                            placeholder='Choose Account Type'
                            onChange={(data) => formik.setFieldValue('accountType', data)}
                            options={AccountTypes}
                            value={formik.values.accountType}
                          />
                          {
                            formik.errors.accountType && formik.touched.accountType
                              ? <Form.Text className='text-danger'>{formik.errors.accountType.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>
                      <Col>
                        <TextField
                          name='readMore'
                          formik={formik}
                          label='Read More'
                          placeholder='Enter Read More URL' />
                      </Col>
                    </Row>
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={4}>
                    {
                      formik.values.notificationPhoto
                        ? <h5>Photo</h5>
                        : <h5>Upload Photo</h5>
                    }
                    {
                      formik.values.notificationPhoto &&
                      <div className='position-relative'>
                        <div className='ratio ratio-1x1 mb-3'>
                          <img className='rounded'
                            src={formik.values.notificationPhoto} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                        </div>
                        <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                          onClick={() => formik.setFieldValue('notificationPhoto', '')}>Remove</Button>
                      </div>
                    }
                    <Form.Group className='mb-3'>
                      <Form.Control
                        type='file'
                        placeholder='Upload Photo'
                        accept='image/*'
                        onChange={(e) => HandleImageUpload(e, 'notificationPhoto', formik.setFieldValue, formik.setFieldError)}
                      />
                      {
                        formik.errors.notificationPhoto
                          ? <Form.Text className='text-danger'>{formik.errors.notificationPhoto}</Form.Text> : null
                      }
                    </Form.Group>
                  </Col>


                </Row>
              </Container>
            </Container>

            <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
              <Container className='m-0 p-0'>
                <Row>
                  <Col className='d-flex align-items-center'>
                    {
                      loadingMessage &&
                      <span className='fs-6 text-danger'>{loadingMessage}</span>
                    }
                  </Col>
                  <Col sm={12} md={6} lg={4} xl={3}
                    className='d-flex justify-content-end align-items-end mt-1 gap-3'>
                    <Button
                      type='reset'
                      className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                      style={{
                        width: '50%',
                      }}
                      variant='danger'
                      onClick={e => setShowClearDialogue(true)}>
                      <Clear style={IconStyles} />{'Clear'}
                    </Button>
                    <Button
                      type='submit'
                      className='text-uppercase d-flex justify-content-center align-items-center pe-3'
                      style={
                        isLoading
                          ? { width: '50%', height: '2.35rem', }
                          : { width: '50%', }
                      }
                      variant='success'>
                      {
                        isLoading
                          ? <BeatLoader color='#fff' size={8} />
                          : <><Save style={IconStyles} />{'Send'}</>
                      }
                    </Button>
                  </Col>
                </Row>
              </Container>
            </Container>

            {
              showClearDialogue
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Proceed'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    setInitialValues({
                      title: '',
                      content: '',
                      notificationPhoto: '',
                      notificationPhoto__: '',
                      accountType: '',
                      readMore: '',
                    })
                    formik.resetForm(formik.initialValues)
                    setError('')
                    setShowClearDialogue(false)
                  }}
                  negativeCallback={() => setShowClearDialogue(false)}
                  show={showClearDialogue}
                  handleClose={() => setShowClearDialogue(false)}>
                  <p>Are you sure you want to clear this form?</p>
                  <p>All data will be lost if you proceed.</p>
                </CustomAlertDialogue>
                : ''
            }


            {
              showUpdateDialogue
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Proceed'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    SendPushNotification({
                      navigate,
                      values: formik.values,
                      setIsLoading,
                      setError,
                      setLoadingMessage,
                      formik,
                    })
                    setShowUpdateDialogue(false)
                  }}
                  negativeCallback={() => setShowUpdateDialogue(false)}
                  show={showUpdateDialogue}
                  handleClose={() => setShowUpdateDialogue(false)}>
                  <p>Are you sure you want to send this notification?</p>
                  <p>Once sent, you will not be able to revert this action.</p>
                </CustomAlertDialogue>
                : ''
            }
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default PushNotifications
