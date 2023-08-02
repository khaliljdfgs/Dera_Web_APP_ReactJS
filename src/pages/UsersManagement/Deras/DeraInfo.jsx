import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { DeraInfoAddSchema, DeraInfoEditSchema } from './DeraInfoYupSchema'
import { FetchDeraData, SubmitDeraData } from './DeraInfoAxios'
import { InitialValues, StatusOptions, GenderOptions } from './DeraInfoValues'
import { SelectMenuDisabledStyle } from '../../../values'
import { ResizeFile } from '../../../utilities'

const DeraInfo = () => {
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

  const DeraSchema = isEditMode
    ? DeraInfoEditSchema
    : DeraInfoAddSchema

  const [initialValues, setInitialValues] = useState({ ...InitialValues })

  useEffect(() => {
    document.title = `Dera Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      return
    } else if (state && state.mode === 0) {
      setIsViewMode(true)
    }

    setIsEditMode(true)

    FetchDeraData({
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
        validationSchema={DeraSchema}
        onSubmit={(values) => {
          if (isEditMode) {
            setShowUpdateDialogue(true)
          } else {
            SubmitDeraData({
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
                              ? 'View Dera'
                              : 'Edit Dera'
                            : 'Add Dera'
                        }
                      </span>
                      {
                        loadingMessage &&
                        <span className='fs-6 m-0 text-danger p-0 m-0 ms-3'>{loadingMessage}</span>
                      }
                    </p>

                    {error && <Form.Text className='text-danger ms-3'>{error}</Form.Text>}

                    <Row>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='fullname'
                          formik={formik}
                          disable={isViewMode}
                          label='Fullname'
                          placeholder='Enter Fullname' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='password'
                          formik={formik}
                          disable={isViewMode}
                          label='Password'
                          placeholder='Enter Password' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='primaryPhone'
                          formik={formik}
                          disable={isViewMode}
                          label='Primary Phone'
                          placeholder='03xxxxxxxxx' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='secondaryPhone'
                          formik={formik}
                          disable={isViewMode}
                          label='Secondary Phone'
                          placeholder='03xxxxxxxxx' />
                      </Col>

                      <Col sm={12} md={6} lg={8} xl={3}>
                        <TextField
                          name='email'
                          formik={formik}
                          disable={isViewMode}
                          label='Email'
                          placeholder='Enter Email Address' />
                      </Col>

                      <Col sm={12} md={6} lg={8} xl={9}>
                        <TextField
                          name='address'
                          formik={formik}
                          disable={isViewMode}
                          label='Address'
                          placeholder='Enter Address' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='longitude'
                          formik={formik}
                          disable={isViewMode}
                          label='Longitude'
                          placeholder='Enter Longitude' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='latitude'
                          formik={formik}
                          disable={isViewMode}
                          label='Latitude'
                          placeholder='Enter Latitude' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Gender</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='gender'
                            name='gender'
                            instanceId='gender'
                            isSearchable={false}
                            placeholder='Choose Gender'
                            onChange={(data) => formik.setFieldValue('gender', data)}
                            options={GenderOptions}
                            value={formik.values.gender}
                          />
                          {
                            formik.errors.gender && formik.touched.gender
                              ? <Form.Text className='text-danger'>{formik.errors.gender.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Status</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='status'
                            name='status'
                            instanceId='status'
                            isSearchable={false}
                            placeholder='Choose Status'
                            onChange={(data) => formik.setFieldValue('status', data)}
                            options={StatusOptions}
                            value={formik.values.status}
                          />
                          {
                            formik.errors.status && formik.touched.status
                              ? <Form.Text className='text-danger'>{formik.errors.status.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='businessName'
                          formik={formik}
                          disable={isViewMode}
                          label='Business Name'
                          placeholder='Enter Business Name' />
                      </Col>

                      <Col sm={12} md={6} lg={8} xl={9}>
                        <TextField
                          name='aboutUs'
                          formik={formik}
                          disable={isViewMode}
                          label='About Us'
                          placeholder='Enter About Us' />
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
                      Social Media Handles
                    </p>
                    <Container className='m-0 p-0 d-flex justify-content-between align-items-center mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='facebook'
                            formik={formik}
                            disable={isViewMode}
                            label='Facebook'
                            placeholder='Enter Facebook Username' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='instagram'
                            formik={formik}
                            disable={isViewMode}
                            label='Instagram'
                            placeholder='Enter Instagram Username' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='twitter'
                            formik={formik}
                            disable={isViewMode}
                            label='Twitter'
                            placeholder='Enter Twitter Username' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='tiktok'
                            formik={formik}
                            disable={isViewMode}
                            label='Tiktok'
                            placeholder='Enter Tiktok Username' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='youtube'
                            formik={formik}
                            disable={isViewMode}
                            label='Youtube'
                            placeholder='Enter Youtube Username' />
                        </Col>
                      </Row>
                    </Container>
                  </Container>

                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }} className='mt-3'>
                    <p className='m-0 p-0 text-uppercase fw-bold'
                      style={{
                        fontSize: '1.5rem',
                      }}>
                      Payment Wallets
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          <h5>EasyPaisa</h5>
                          <TextField
                            name='easyPaisaTitle'
                            formik={formik}
                            disable={isViewMode}
                            label='Title'
                            placeholder='Enter Title' />
                          <TextField
                            name='easyPaisaNumber'
                            formik={formik}
                            disable={isViewMode}
                            label='Account Number'
                            placeholder='03xxxxxxxxx' />
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          <h5>JazzCash</h5>
                          <TextField
                            name='jazzCashTitle'
                            formik={formik}
                            disable={isViewMode}
                            label='Title'
                            placeholder='Enter Title' />
                          <TextField
                            name='jazzCashNumber'
                            formik={formik}
                            disable={isViewMode}
                            label='Account Number'
                            placeholder='03xxxxxxxxx' />
                        </Col>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          <h5>UPaisa</h5>
                          <TextField
                            name='uPaisaTitle'
                            formik={formik}
                            disable={isViewMode}
                            label='Title'
                            placeholder='Enter Title' />
                          <TextField
                            name='uPaisaNumber'
                            formik={formik}
                            disable={isViewMode}
                            label='Account Number'
                            placeholder='03xxxxxxxxx' />
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
                            formik.values.bannerPhotoOne
                              ? <h5>Banner # 01</h5>
                              : <h5>Upload Banner # 01</h5>
                          }
                          {
                            formik.values.bannerPhotoOne &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.bannerPhotoOne} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('bannerPhotoOne', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Banner Photo # 01'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'bannerPhotoOne', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.bannerPhotoOne
                                  ? <Form.Text className='text-danger'>{formik.errors.bannerPhotoOne}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.bannerPhotoTwo
                              ? <h5>Banner # 02</h5>
                              : <h5>Upload Banner # 02</h5>
                          }
                          {
                            formik.values.bannerPhotoTwo &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.bannerPhotoTwo} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('bannerPhotoTwo', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Banner Photo # 02'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'bannerPhotoTwo', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.bannerPhotoTwo
                                  ? <Form.Text className='text-danger'>{formik.errors.bannerPhotoTwo}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.bannerPhotoThree
                              ? <h5>Banner # 03</h5>
                              : <h5>Upload Banner # 03</h5>
                          }
                          {
                            formik.values.bannerPhotoThree &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.bannerPhotoThree} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('bannerPhotoThree', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Banner Photo # 03'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'bannerPhotoThree', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.bannerPhotoThree
                                  ? <Form.Text className='text-danger'>{formik.errors.bannerPhotoThree}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.bannerPhotoFour
                              ? <h5>Banner # 04</h5>
                              : <h5>Upload Banner # 04</h5>
                          }
                          {
                            formik.values.bannerPhotoFour &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.bannerPhotoFour} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('bannerPhotoFour', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Banner Photo # 04'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'bannerPhotoFour', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.bannerPhotoFour
                                  ? <Form.Text className='text-danger'>{formik.errors.bannerPhotoFour}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.profilePhoto
                              ? <h5>Profile Photo</h5>
                              : <h5>Upload Profile Photo</h5>
                          }
                          {
                            formik.values.profilePhoto &&
                            <div className='position-relative'>
                              <div className='ratio ratio-1x1 mb-3'>
                                <img className='rounded'
                                  src={formik.values.profilePhoto} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('profilePhoto', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Profile Photo'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'profilePhoto', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.profilePhoto
                                  ? <Form.Text className='text-danger'>{formik.errors.profilePhoto}</Form.Text> : null
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
                    SubmitDeraData({
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
            <GoBackButton path='/Admin/Deras' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default DeraInfo