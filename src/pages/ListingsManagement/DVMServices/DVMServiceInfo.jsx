import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { DVMServiceInfoSchema } from './DVMServiceInfoYupSchema'
import { FetchDVMServiceData, SubmitDVMServiceData } from './DVMServiceInfoAxios'
import { InitialValues, ServiceChargesPerValues, ServiceTypeIsOnSiteValues, ServiceTypeIsRemoteValues } from './DVMServiceInfoValues'
import { SelectMenuDisabledStyle } from '../../../values'
import { ResizeFile } from '../../../utilities'

const DVMServiceInfo = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isGettingData, setIsGettingData] = useState(true)
  const [isEditMode, setIsEditMode] = useState(false)
  const [isViewMode, setIsViewMode] = useState(false)
  const [showClearDialogue, setShowClearDialogue] = useState(false)
  const [showUpdateDialogue, setShowUpdateDialogue] = useState(false)

  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()
  const { state } = useLocation()

  const [initialValues, setInitialValues] = useState({ ...InitialValues })

  useEffect(() => {
    document.title = `DVM Service Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/Services')
      return
    } else if (state && state.mode === 0) {
      setIsViewMode(true)
    }

    setIsEditMode(true)

    FetchDVMServiceData({
      id: parameters.id,
      setError: setFetchError,
      setInitialValues,
      setIsGettingData,
      navigate,
    })
  }, [navigate, parameters.id, state])

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
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={DVMServiceInfoSchema}
        onSubmit={(values) => {
          if (isEditMode) {
            setShowUpdateDialogue(true)
          } else {
            SubmitDVMServiceData({
              id: parameters.id,
              values,
              isEditMode,
              navigate,
              setError,
              setIsLoading,
              setLoadingMessage,
            })
          }
        }}>
        {(formik) => (
          <Form onSubmit={formik.handleSubmit} className='m-0 p-0' method='POST'>
            <Container style={{
              background: '#fff',
              padding: '1.5rem',
              borderRadius: '0.5rem',
            }}>
              {
                isGettingData && isEditMode
                  ?
                  <div className='d-flex justify-content-center align-items-center flex-column py-3'>
                    <span className='mb-2 fs-5 text-secondary'>
                      {
                        fetchError.length > 0
                          ? fetchError
                          : 'Getting Data'
                      }
                    </span>
                    {
                      fetchError.length > 0
                        ? ''
                        : <BeatLoader color='#333333' size={12} />
                    }
                  </div>
                  :
                  <>
                    <p className='p-0 m-0 mb-3 d-inline'>
                      <span className='fs-3 fw-bold text-uppercase'>
                        {
                          isEditMode
                            ? isViewMode
                              ? 'View DVM Service'
                              : 'Edit DVM Service'
                            : 'Add DVM Service'
                        }
                      </span>
                      {
                        loadingMessage &&
                        <span className='fs-6 m-0 text-danger p-0 m-0 ms-3'>{loadingMessage}</span>
                      }
                    </p>

                    {error && <Form.Text className='text-danger ms-3'>{error}</Form.Text>}

                    <Row>
                      <Col sm={12} md={12} lg={4} xl={3}>
                        <TextField
                          name='serviceTitle'
                          formik={formik}
                          disable={isViewMode}
                          label='Title'
                          placeholder='Enter Service Title' />
                      </Col>

                      <Col sm={12} md={12} lg={8} xl={9}>
                        <TextField
                          name='serviceDescription'
                          formik={formik}
                          disable={isViewMode}
                          label='Description'
                          placeholder='Enter Service Description' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='serviceCharges'
                          formik={formik}
                          disable={isViewMode}
                          label='Charges (PKR)'
                          placeholder='Enter Service Charges' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Charges Per</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='serviceChargesPer'
                            name='serviceChargesPer'
                            instanceId='serviceChargesPer'
                            isSearchable={false}
                            placeholder='Choose Charges Per'
                            onChange={(data) => formik.setFieldValue('serviceChargesPer', data)}
                            options={ServiceChargesPerValues}
                            value={formik.values.serviceChargesPer}
                          />
                          {
                            formik.errors.serviceChargesPer && formik.touched.serviceChargesPer
                              ? <Form.Text className='text-danger'>{formik.errors.serviceChargesPer.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Is Remote</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='serviceTypeIsRemote'
                            name='serviceTypeIsRemote'
                            instanceId='serviceTypeIsRemote'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => formik.setFieldValue('serviceTypeIsRemote', data)}
                            options={ServiceTypeIsRemoteValues}
                            value={formik.values.serviceTypeIsRemote}
                          />
                          {
                            formik.errors.serviceTypeIsRemote && formik.touched.serviceTypeIsRemote
                              ? <Form.Text className='text-danger'>{formik.errors.serviceTypeIsRemote.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Is On-Site</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='serviceTypeIsOnSite'
                            name='serviceTypeIsOnSite'
                            instanceId='serviceTypeIsOnSite'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => formik.setFieldValue('serviceTypeIsOnSite', data)}
                            options={ServiceTypeIsOnSiteValues}
                            value={formik.values.serviceTypeIsOnSite}
                          />
                          {
                            formik.errors.serviceTypeIsOnSite && formik.touched.serviceTypeIsOnSite
                              ? <Form.Text className='text-danger'>{formik.errors.serviceTypeIsOnSite.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='updatedAt'
                          formik={formik}
                          disable={true}
                          label='Updated At'
                          placeholder='Enter Updated At' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='createdAt'
                          formik={formik}
                          disable={true}
                          label='Created At'
                          placeholder='Enter Created At' />
                      </Col>

                      <Col></Col>
                    </Row>
                  </>
              }
            </Container>

            {
              isGettingData && isEditMode
                ? ''
                :
                <>
                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }} className='mt-3'>
                    <p className='m-0 p-0 text-uppercase fw-bold'
                      style={{
                        fontSize: '1.5rem',
                      }}>
                      Owner Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerFullname'
                            formik={formik}
                            disable={true}
                            label='Fullname'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={8} xl={9}>
                          <TextField
                            name='ownerAddress'
                            formik={formik}
                            disable={true}
                            label='Address'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerGeolocationLongitude'
                            formik={formik}
                            disable={true}
                            label='Longitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerGeolocationLatitude'
                            formik={formik}
                            disable={true}
                            label='Latitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerPrimaryPhone'
                            formik={formik}
                            disable={true}
                            label='Primary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerSecondaryPhone'
                            formik={formik}
                            disable={true}
                            label='Secondary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ownerEmail'
                            formik={formik}
                            disable={true}
                            label='Email'
                            placeholder='' />
                        </Col>
                      </Row>
                    </Container>
                  </Container>

                  <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                    <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.5rem' }}>Images</p>
                    <p className='m-0 p-0 text-danger' style={{ fontSize: '1rem' }}>
                      * Images will be resized automatically to their respective sizes, in the mobile app.
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.serviceImage
                              ? <h5>Service Photo</h5>
                              : <h5>Upload Service Photo</h5>
                          }
                          {
                            formik.values.serviceImage &&
                            <div className='position-relative'>
                              <div className='ratio ratio-1x1 mb-3'>
                                <img className='rounded'
                                  src={formik.values.serviceImage} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('serviceImage', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Service Photo'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'serviceImage', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.serviceImage
                                  ? <Form.Text className='text-danger'>{formik.errors.serviceImage}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4}>
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4}>
                        </Col>
                      </Row>
                    </Container>
                  </Container>

                  {
                    !isViewMode &&
                    <>
                      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                        <Container className='m-0 p-0'>
                          <Row>
                            <Col className='d-flex align-items-center'>
                              {
                                loadingMessage &&
                                <span className='fs-6 text-danger'>{loadingMessage}</span>
                              }
                            </Col>
                            {
                              isViewMode
                                ? ''
                                :
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
                                        : isEditMode
                                          ? <><Save style={IconStyles} />{'Update'}</>
                                          : <><Done style={IconStyles} />{'Proceed'}</>
                                    }
                                  </Button>
                                </Col>
                            }
                          </Row>
                        </Container>
                      </Container>
                    </>
                  }
                </>
            }

            {
              showClearDialogue
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Proceed'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    setInitialValues({
                      ...InitialValues,
                      updatedAt: formik.values.updatedAt || '',
                      createdAt: formik.values.createdAt || '',
                      ownerFullname: formik.values.ownerFullname || '',
                      ownerEmail: formik.values.ownerEmail || '',
                      ownerPrimaryPhone: formik.values.ownerPrimaryPhone || '',
                      ownerSecondaryPhone: formik.values.ownerSecondaryPhone || '',
                      ownerAddress: formik.values.ownerAddress || '',
                      ownerGeolocationLongitude: formik.values.ownerGeolocationLongitude || '',
                      ownerGeolocationLatitude: formik.values.ownerGeolocationLatitude || '',
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
              showUpdateDialogue && isEditMode
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Update'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    SubmitDVMServiceData({
                      id: parameters.id,
                      navigate,
                      values: formik.values,
                      isEditMode,
                      setIsLoading,
                      setError,
                      setLoadingMessage,
                    })
                    setShowUpdateDialogue(false)
                  }}
                  negativeCallback={() => setShowUpdateDialogue(false)}
                  show={showUpdateDialogue}
                  handleClose={() => setShowUpdateDialogue(false)}>
                  <p>Are you sure you want to update this form?</p>
                  <p>Once updated, you will not be able to revert the changes!</p>
                </CustomAlertDialogue>
                : ''
            }
            <GoBackButton path='/Admin/Services' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default DVMServiceInfo