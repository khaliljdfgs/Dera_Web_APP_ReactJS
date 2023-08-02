import React, { useState, useEffect } from 'react'
import { Container, Form, Button, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useLocation, useNavigate } from 'react-router-dom'
import { Save } from '@mui/icons-material'
import { toast, ToastContainer } from 'react-toastify'

import { CustomAlertDialogue } from '../../../components'
import { APP_TITLE } from '../../../config'
import { ToastValues } from '../../../values'
import { FetchPromotions, SubmitPromotions } from './PromotionAxios'
import { ResizeFile } from '../../../utilities'

const Promotions = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loadingMessage, setLoadingMessage] = useState('')
  const [isGettingData, setIsGettingData] = useState(true)
  const [showUpdateDialogue, setShowUpdateDialogue] = useState(false)

  const [error, setError] = useState('')
  const [fetchError, setFetchError] = useState('')

  const navigate = useNavigate()
  const { state } = useLocation()

  const [initialValues, setInitialValues] = useState({
    dvmPhotoOne: '',
    dvmPhotoTwo: '',
    dvmPhotoThree: '',
    dvmPhotoFour: '',
    dvmPhotoFive: '',
    consumerPhotoOne: '',
    consumerPhotoTwo: '',
    consumerPhotoThree: '',
    consumerPhotoFour: '',
    consumerPhotoFive: '',

    dvmPhotoOne__: '',
    dvmPhotoTwo__: '',
    dvmPhotoThree__: '',
    dvmPhotoFour__: '',
    dvmPhotoFive__: '',
    consumerPhotoOne__: '',
    consumerPhotoTwo__: '',
    consumerPhotoThree__: '',
    consumerPhotoFour__: '',
    consumerPhotoFive__: '',
  })

  useEffect(() => {
    document.title = `Promotions | ${APP_TITLE}`

    if (state?.message && !toast.isActive('xyz')) {
      toast.success(state.message, ToastValues)

      navigate('/Admin/Promotions', {
        state: {},
        replace: true,
      })
    }

    FetchPromotions({
      setError: setFetchError,
      setInitialValues,
      setIsGettingData,
      navigate,
    })
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
              {
                isGettingData
                  ?
                  <div className='d-flex justify-content-center align-items-center flex-column py-3'>
                    <span className='mb-2 fs-6 text-secondary'>
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
                        Promotions
                      </span>
                      {
                        loadingMessage &&
                        <span className='fs-6 m-0 text-danger p-0 m-0 ms-3'>{loadingMessage}</span>
                      }
                    </p>

                    {error && <Form.Text className='text-danger ms-3'>{error}</Form.Text>}

                    <p className='m-0 p-0'>
                      From here, you can upload images for both DVM and Consumer promotions.<br />
                      These images will be displayed in the mobile app, in the promotions section.
                    </p>
                  </>
              }
            </Container>

            {
              isGettingData
                ? ''
                :
                <>
                  <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                    <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.5rem' }}>DVM Promotions</p>
                    <p className='m-0 p-0 text-danger' style={{ fontSize: '1rem' }}>
                      * Images will be resized automatically to their respective sizes, in the mobile app.
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.dvmPhotoOne
                              ? <h5>Image # 01</h5>
                              : <h5>Upload Image # 01</h5>
                          }
                          {
                            formik.values.dvmPhotoOne &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.dvmPhotoOne} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('dvmPhotoOne', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 01'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'dvmPhotoOne', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.dvmPhotoOne
                                ? <Form.Text className='text-danger'>{formik.errors.dvmPhotoOne}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.dvmPhotoTwo
                              ? <h5>Image # 02</h5>
                              : <h5>Upload Image # 02</h5>
                          }
                          {
                            formik.values.dvmPhotoTwo &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.dvmPhotoTwo} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('dvmPhotoTwo', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 02'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'dvmPhotoTwo', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.dvmPhotoTwo
                                ? <Form.Text className='text-danger'>{formik.errors.dvmPhotoTwo}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.dvmPhotoThree
                              ? <h5>Image # 03</h5>
                              : <h5>Upload Image # 03</h5>
                          }
                          {
                            formik.values.dvmPhotoThree &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.dvmPhotoThree} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('dvmPhotoThree', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 03'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'dvmPhotoThree', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.dvmPhotoThree
                                ? <Form.Text className='text-danger'>{formik.errors.dvmPhotoThree}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.dvmPhotoFour
                              ? <h5>Image # 04</h5>
                              : <h5>Upload Image # 04</h5>
                          }
                          {
                            formik.values.dvmPhotoFour &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.dvmPhotoFour} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('dvmPhotoFour', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 04'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'dvmPhotoFour', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.dvmPhotoFour
                                ? <Form.Text className='text-danger'>{formik.errors.dvmPhotoFour}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.dvmPhotoFive
                              ? <h5>Image # 05</h5>
                              : <h5>Upload Image # 05</h5>
                          }
                          {
                            formik.values.dvmPhotoFive &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.dvmPhotoFive} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('dvmPhotoFive', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 05'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'dvmPhotoFive', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.dvmPhotoFive
                                ? <Form.Text className='text-danger'>{formik.errors.dvmPhotoFive}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                      </Row>
                    </Container>
                  </Container>

                  <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} className='mt-3'>
                    <p className='m-0 p-0 text-uppercase fw-bold' style={{ fontSize: '1.5rem' }}>Consumer Promotions</p>
                    <p className='m-0 p-0 text-danger' style={{ fontSize: '1rem' }}>
                      * Images will be resized automatically to their respective sizes, in the mobile app.
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.consumerPhotoOne
                              ? <h5>Image # 01</h5>
                              : <h5>Upload Image # 01</h5>
                          }
                          {
                            formik.values.consumerPhotoOne &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.consumerPhotoOne} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('consumerPhotoOne', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 01'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'consumerPhotoOne', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.consumerPhotoOne
                                ? <Form.Text className='text-danger'>{formik.errors.consumerPhotoOne}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.consumerPhotoTwo
                              ? <h5>Image # 02</h5>
                              : <h5>Upload Image # 02</h5>
                          }
                          {
                            formik.values.consumerPhotoTwo &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.consumerPhotoTwo} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('consumerPhotoTwo', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 02'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'consumerPhotoTwo', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.consumerPhotoTwo
                                ? <Form.Text className='text-danger'>{formik.errors.consumerPhotoTwo}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.consumerPhotoThree
                              ? <h5>Image # 03</h5>
                              : <h5>Upload Image # 03</h5>
                          }
                          {
                            formik.values.consumerPhotoThree &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.consumerPhotoThree} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('consumerPhotoThree', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 03'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'consumerPhotoThree', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.consumerPhotoThree
                                ? <Form.Text className='text-danger'>{formik.errors.consumerPhotoThree}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.consumerPhotoFour
                              ? <h5>Image # 04</h5>
                              : <h5>Upload Image # 04</h5>
                          }
                          {
                            formik.values.consumerPhotoFour &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.consumerPhotoFour} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('consumerPhotoFour', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 04'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'consumerPhotoFour', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.consumerPhotoFour
                                ? <Form.Text className='text-danger'>{formik.errors.consumerPhotoFour}</Form.Text> : null
                            }
                          </Form.Group>
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={4}>
                          {
                            formik.values.consumerPhotoFive
                              ? <h5>Image # 05</h5>
                              : <h5>Upload Image # 05</h5>
                          }
                          {
                            formik.values.consumerPhotoFive &&
                            <div className='position-relative'>
                              <div className='ratio ratio-16x9 mb-3'>
                                <img className='rounded'
                                  src={formik.values.consumerPhotoFive} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                              </div>
                              <Button variant='danger' className='position-absolute top-0 end-0 btn-sm m-2'
                                onClick={() => formik.setFieldValue('consumerPhotoFive', '')}>Remove</Button>
                            </div>
                          }
                          <Form.Group className='mb-3'>
                            <Form.Control
                              type='file'
                              placeholder='Upload Image # 05'
                              accept='image/*'
                              onChange={(e) => HandleImageUpload(e, 'consumerPhotoFive', formik.setFieldValue, formik.setFieldError)}
                            />
                            {
                              formik.errors.consumerPhotoFive
                                ? <Form.Text className='text-danger'>{formik.errors.consumerPhotoFive}</Form.Text> : null
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
                                : <><Save style={IconStyles} />{'Update'}</>
                            }
                          </Button>
                        </Col>
                      </Row>
                    </Container>
                  </Container>
                </>
            }

            {
              showUpdateDialogue
                ?
                <CustomAlertDialogue
                  title='Warning'
                  positiveMessage='Update'
                  negativeMessage='Cancel'
                  positiveCallback={() => {
                    SubmitPromotions({
                      navigate,
                      values: formik.values,
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
                  <p>Are you sure you want to update the promotions?</p>
                  <p>Once updated, you will not be able to revert the changes!</p>
                </CustomAlertDialogue>
                : ''
            }
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default Promotions