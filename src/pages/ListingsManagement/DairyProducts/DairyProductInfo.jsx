import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate, useLocation } from 'react-router-dom'
import Select from 'react-select'
import { Save, Clear, Done } from '@mui/icons-material'

import { GoBackButton, TextField, CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { DairyProductInfoSchema } from './DairyProductInfoYupSchema'
import { FetchDairyProductData, SubmitDairyProductData } from './DairyProductInfoAxios'
import {
  InitialValues,
  DairyProductCategoryValues,
  DairyProductPricePerValues,
  OrderTypeIsSingleOrderValues,
  OrderTypeIsSubscriptionValues
} from './DairyProductInfoValues'
import { SelectMenuDisabledStyle } from '../../../values'
import { ResizeFile } from '../../../utilities'

const DairyProductInfo = () => {
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
    document.title = `Dairy Product Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/DairyProducts')
      return
    } else if (state && state.mode === 0) {
      setIsViewMode(true)
    }

    setIsEditMode(true)

    FetchDairyProductData({
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
        validationSchema={DairyProductInfoSchema}
        onSubmit={(values) => {
          if (isEditMode) {
            setShowUpdateDialogue(true)
          } else {
            SubmitDairyProductData({
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
                              ? 'View Dairy Product'
                              : 'Edit Dairy Product'
                            : 'Add Dairy Product'
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
                          name='productName'
                          formik={formik}
                          disable={isViewMode}
                          label='Name'
                          placeholder='Enter Product Name' />
                      </Col>

                      <Col sm={12} md={12} lg={8} xl={9}>
                        <TextField
                          name='productDescription'
                          formik={formik}
                          disable={isViewMode}
                          label='Description'
                          placeholder='Enter Product Description' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='productPrice'
                          formik={formik}
                          disable={isViewMode}
                          label='Price (PKR)'
                          placeholder='Enter Product Price' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Price Per</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='priceUnit'
                            name='priceUnit'
                            instanceId='priceUnit'
                            isSearchable={false}
                            placeholder='Choose Charges Per'
                            onChange={(data) => formik.setFieldValue('priceUnit', data)}
                            options={DairyProductPricePerValues}
                            value={formik.values.priceUnit}
                          />
                          {
                            formik.errors.priceUnit && formik.touched.priceUnit
                              ? <Form.Text className='text-danger'>{formik.errors.priceUnit.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Single Order Based</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='orderTypeIsSingleOrder'
                            name='orderTypeIsSingleOrder'
                            instanceId='orderTypeIsSingleOrder'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => formik.setFieldValue('orderTypeIsSingleOrder', data)}
                            options={OrderTypeIsSingleOrderValues}
                            value={formik.values.orderTypeIsSingleOrder}
                          />
                          {
                            formik.errors.orderTypeIsSingleOrder && formik.touched.orderTypeIsSingleOrder
                              ? <Form.Text className='text-danger'>{formik.errors.orderTypeIsSingleOrder.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Subscription Based</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='orderTypeIsSubscription'
                            name='orderTypeIsSubscription'
                            instanceId='orderTypeIsSubscription'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => formik.setFieldValue('orderTypeIsSubscription', data)}
                            options={OrderTypeIsSubscriptionValues}
                            value={formik.values.orderTypeIsSubscription}
                          />
                          {
                            formik.errors.orderTypeIsSubscription && formik.touched.orderTypeIsSubscription
                              ? <Form.Text className='text-danger'>{formik.errors.orderTypeIsSubscription.value}</Form.Text>
                              : null
                          }
                        </Form.Group>
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <Form.Group className='mb-3'>
                          <Form.Label>Category</Form.Label>
                          <Select
                            styles={isViewMode && SelectMenuDisabledStyle}
                            isDisabled={isViewMode}
                            key='productCategory'
                            name='productCategory'
                            instanceId='productCategory'
                            isSearchable={false}
                            placeholder='Select'
                            onChange={(data) => formik.setFieldValue('productCategory', data)}
                            options={DairyProductCategoryValues}
                            value={formik.values.productCategory}
                          />
                          {
                            formik.errors.productCategory && formik.touched.productCategory
                              ? <Form.Text className='text-danger'>{formik.errors.productCategory.value}</Form.Text>
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
                      Extra Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='rating'
                            formik={formik}
                            disable={true}
                            label='Avg. Rating'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='ratingCount'
                            formik={formik}
                            disable={true}
                            label='Rated By'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='purchasedCount'
                            formik={formik}
                            disable={true}
                            label='Purchased By'
                            placeholder='' />
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
                            formik.values.productImage
                              ? <h5>Product Photo</h5>
                              : <h5>Upload Product Photo</h5>
                          }
                          {
                            formik.values.productImage &&
                            <div className='position-relative'>
                              <div className='ratio ratio-1x1 mb-3'>
                                <img className='rounded'
                                  src={formik.values.productImage} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              {
                                !isViewMode &&
                                <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                  onClick={() => formik.setFieldValue('productImage', '')}>Remove</Button>
                              }
                            </div>
                          }
                          {
                            !isViewMode &&
                            <Form.Group className='mb-3'>
                              <Form.Control
                                type='file'
                                disabled={isViewMode}
                                placeholder='Upload Product Photo'
                                accept='image/*'
                                onChange={(e) => HandleImageUpload(e, 'productImage', formik.setFieldValue, formik.setFieldError)}
                              />
                              {
                                formik.errors.productImage
                                  ? <Form.Text className='text-danger'>{formik.errors.productImage}</Form.Text> : null
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
                      rating: formik.values.rating || 0,
                      ratingCount: formik.values.ratingCount || 0,
                      purchasedCount: formik.values.purchasedCount || 0,
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
                    SubmitDairyProductData({
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
            <GoBackButton path='/Admin/DairyProducts' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default DairyProductInfo