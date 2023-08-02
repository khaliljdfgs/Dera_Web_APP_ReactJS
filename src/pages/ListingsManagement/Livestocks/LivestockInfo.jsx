import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { LivestockInfoSchema } from './LivestockInfoYupSchema'
import { FetchLivestockData, SubmitLivestockData } from './LivestockInfoAxios'
import {
  InitialValues,
  LivestockCategoryValues,
  LivestockStatusValues,
} from './LivestockInfoValues'
import { SelectMenuDisabledStyle } from '../../../values'
import { ResizeFile } from '../../../utilities'

const LivestockInfo = () => {
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
    document.title = `Livestock Product Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/Livestocks')
      return
    } else if (state && state.mode === 0) {
      setIsViewMode(true)
    }

    setIsEditMode(true)

    FetchLivestockData({
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
        validationSchema={LivestockInfoSchema}
        onSubmit={(values) => {
          if (isEditMode) {
            setShowUpdateDialogue(true)
          } else {
            SubmitLivestockData({
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
                              ? 'View Livestock'
                              : 'Edit Livestock'
                            : 'Add Livestock'
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
                          name='liveStockTitle'
                          formik={formik}
                          disable={isViewMode}
                          label='Title'
                          placeholder='Enter Livestock Title' />
                      </Col>

                      <Col sm={12} md={12} lg={8} xl={9}>
                        <TextField
                          name='liveStockDescription'
                          formik={formik}
                          disable={isViewMode}
                          label='Description'
                          placeholder='Enter Livestock Description' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='liveStockPrice'
                          formik={formik}
                          disable={isViewMode}
                          label='Price (PKR)'
                          placeholder='Enter Livestock Price' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Category</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='liveStockCategory'
                            name='liveStockCategory'
                            instanceId='liveStockCategory'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => {
                              formik.setFieldValue('liveStockCategory', data)
                              formik.setFieldValue('breed', '')
                            }}
                            options={LivestockCategoryValues}
                            value={formik.values.liveStockCategory}
                          />
                          {
                            formik.errors.liveStockCategory && formik.touched.liveStockCategory
                              ? <Form.Text className='text-danger'>{formik.errors.liveStockCategory.value}</Form.Text>
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
                            key='liveStockStatus'
                            name='liveStockStatus'
                            instanceId='liveStockStatus'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => {
                              formik.setFieldValue('liveStockStatus', data)
                            }}
                            options={LivestockStatusValues}
                            value={formik.values.liveStockStatus}
                          />
                          {
                            formik.errors.liveStockStatus && formik.touched.liveStockStatus
                              ? <Form.Text className='text-danger'>{formik.errors.liveStockStatus.value}</Form.Text>
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
                          placeholder='' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='createdAt'
                          formik={formik}
                          disable={true}
                          label='Created At'
                          placeholder='' />
                      </Col>
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
                      Features
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <Form.Group className='mb-3'>
                            <Form.Label>Breed</Form.Label>
                            <Form.Control
                              placeholder='Enter Livestock Breed'
                              name='breed'
                              value={
                                formik.values.liveStockCategory?.value?.toLowerCase() !== 'cow' &&
                                  formik.values.liveStockCategory?.value?.toUpperCase() !== 'buffalo'
                                  ? formik.values.breed?.value ? formik.setFieldValue('breed', '') : formik.values.breed
                                  : null
                              }
                              onChange={formik.handleChange}
                              disabled={isViewMode} />
                            {
                              formik.errors.breed && formik.touched.breed
                                ? <Form.Text className='text-danger'>{formik.errors.breed}</Form.Text>
                                : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='color'
                            formik={formik}
                            disable={isViewMode}
                            label='Color'
                            placeholder='Enter Livestock Color' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ageDay'
                            formik={formik}
                            disable={isViewMode}
                            label='Age (Day)'
                            placeholder='Enter Age (Day)' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ageMonth'
                            formik={formik}
                            disable={isViewMode}
                            label='Age (Month)'
                            placeholder='Enter Age (Month)' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ageYear'
                            formik={formik}
                            disable={isViewMode}
                            label='Age (Year)'
                            placeholder='Enter Age (Year)' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='height'
                            formik={formik}
                            disable={isViewMode}
                            label='Height (Inch)'
                            placeholder='Enter Height (Inch)' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='weight'
                            formik={formik}
                            disable={isViewMode}
                            label='Weight (Kg)'
                            placeholder='Enter Weight (Kg)' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='teethCount'
                            formik={formik}
                            disable={isViewMode}
                            label='Teeth Count (Optional)'
                            placeholder='Enter Teeth Count' />
                        </Col>
                      </Row>
                    </Container>
                  </Container>

                  {
                    formik.values.predictions_breed &&
                    <Container style={{
                      background: '#fff',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                    }} className='mt-3'>
                      <p className='m-0 p-0 text-uppercase fw-bold'
                        style={{
                          fontSize: '1.5rem',
                        }}>
                        Estimated Details
                      </p>
                      <Container className='m-0 p-0 mt-3'>
                        <Row>
                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='predictions_breed'
                              formik={formik}
                              disable={true}
                              label='Breed'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='predictions_confidence'
                              formik={formik}
                              disable={true}
                              label='Confidence'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='predictions_height'
                              formik={formik}
                              disable={true}
                              label='Height'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='predictions_weight'
                              formik={formik}
                              disable={true}
                              label='Weight'
                              placeholder='' />
                          </Col>
                        </Row>
                      </Container>
                    </Container>
                  }

                  {
                    formik.values.soldOutToFullname &&
                    <Container style={{
                      background: '#fff',
                      padding: '1.5rem',
                      borderRadius: '0.5rem',
                    }} className='mt-3'>
                      <p className='m-0 p-0 text-uppercase fw-bold'
                        style={{
                          fontSize: '1.5rem',
                        }}>
                        Buyer Details
                      </p>
                      <Container className='m-0 p-0 mt-3'>
                        <Row>
                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToFullname'
                              formik={formik}
                              disable={true}
                              label='Fullname'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={8} xl={9}>
                            <TextField
                              name='soldOutToAddress'
                              formik={formik}
                              disable={true}
                              label='Address'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToGeolocationLongitude'
                              formik={formik}
                              disable={true}
                              label='Longitude'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToGeolocationLatitude'
                              formik={formik}
                              disable={true}
                              label='Latitude'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToPrimaryPhone'
                              formik={formik}
                              disable={true}
                              label='Primary Phone'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToSecondaryPhone'
                              formik={formik}
                              disable={true}
                              label='Secondary Phone'
                              placeholder='' />
                          </Col>

                          <Col sm={12} md={6} lg={4} xl={3}>
                            <TextField
                              name='soldOutToEmail'
                              formik={formik}
                              disable={true}
                              label='Email'
                              placeholder='' />
                          </Col>
                        </Row>
                      </Container>
                    </Container>
                  }

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
                            name='ownerBusinessName'
                            formik={formik}
                            disable={true}
                            label='Business Name'
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
                            formik.values.imageOne
                              ? <h5>Image # 01</h5>
                              : <h5>Upload Image # 01</h5>
                          }
                          {
                            formik.values.imageOne &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.imageOne} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('imageOne', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Image # 01'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'imageOne', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.imageOne
                                  ? <Form.Text className='text-danger'>{formik.errors.imageOne}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.imageTwo
                              ? <h5>Image # 02</h5>
                              : <h5>Upload Image # 02</h5>
                          }
                          {
                            formik.values.imageTwo &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.imageTwo} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('imageTwo', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Image # 02'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'imageTwo', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.imageTwo
                                  ? <Form.Text className='text-danger'>{formik.errors.imageTwo}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.imageThree
                              ? <h5>Image # 03</h5>
                              : <h5>Upload Image # 03</h5>
                          }
                          {
                            formik.values.imageThree &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.imageThree} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('imageThree', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Image # 03'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'imageThree', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.imageThree
                                  ? <Form.Text className='text-danger'>{formik.errors.imageThree}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.imageFour
                              ? <h5>Image # 04</h5>
                              : <h5>Upload Image # 04</h5>
                          }
                          {
                            formik.values.imageFour &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.imageFour} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('imageFour', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Image # 04'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'imageFour', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.imageFour
                                  ? <Form.Text className='text-danger'>{formik.errors.imageFour}</Form.Text> : null
                              }
                            </Form.Group>
                          }
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.imageFive
                              ? <h5>Image # 05</h5>
                              : <h5>Upload Image # 05</h5>
                          }
                          {
                            formik.values.imageFive &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.imageFive} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('imageFive', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Image # 05'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'imageFive', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.imageFive
                                  ? <Form.Text className='text-danger'>{formik.errors.imageFive}</Form.Text> : null
                              }
                            </Form.Group>
                          }
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
                      ownerFullname: formik.values.ownerFullname || '',
                      ownerBusinessName: formik.values.ownerBusinessName || '',
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
                    SubmitLivestockData({
                      id: parameters.id,
                      navigate,
                      values: formik.values,
                      isEditMode,
                      setIsLoading,
                      setError,
                      setLoadingMessage,
                      formik
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
            <GoBackButton path='/Admin/Livestocks' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default LivestockInfo