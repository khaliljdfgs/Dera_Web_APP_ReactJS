import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'

import { GoBackButton, TextField } from '../../../components'
import { APP_TITLE } from '../../../config'
import { FetchLivestockRequestData } from './LivestockRequestInfoAxios'

const LivestockRequestInfo = () => {
  const [isGettingData, setIsGettingData] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Livestock Request Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/LivestockRequests')
      return
    }

    FetchLivestockRequestData({
      id: parameters.id,
      setError: setFetchError,
      setInitialValues,
      setIsGettingData,
      navigate,
    })
  }, [navigate, parameters, parameters.id])

  return (
    <Container style={{ padding: '1.25rem' }}>
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        onSubmit={(values) => { }}>
        {(formik) => (
          <Form onSubmit={formik.handleSubmit} className='m-0 p-0' method='POST'>
            {
              isGettingData
                ?
                <Container style={{
                  background: '#fff',
                  padding: '1.5rem',
                  borderRadius: '0.5rem',
                }}>
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
                </Container>
                :
                <>
                  <Container style={{
                    background: '#fff',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                  }}>
                    <p className='m-0 p-0 text-uppercase fw-bold'
                      style={{
                        fontSize: '1.5rem',
                      }}>
                      Livestock Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row className='g-2'>
                        <Col sm={12} md={6} lg={6} xl={6}>
                          <table className='table table-striped table-bordered'>
                            <tbody>
                              <tr>
                                <th scope='row'>Title</th>
                                <td>{formik.values.liveStockTitle}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Description</th>
                                <td>{formik.values.liveStockDescription}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Price</th>
                                <td>Rs. {formik.values.liveStockPrice}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Category</th>
                                <td>{formik.values.liveStockCategory}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Breed</th>
                                <td>{formik.values.breed}</td>
                              </tr>
                            </tbody>
                          </table>
                        </Col>

                        <Col sm={12} md={6} lg={6} xl={6}>
                          <table className='table table-striped table-bordered'>
                            <tbody>
                              <tr>
                                <th scope='row'>Color</th>
                                <td>{formik.values.color}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Age</th>
                                <td>{formik.values.age}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Height</th>
                                <td>{formik.values.height}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Weight</th>
                                <td>{formik.values.weight}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Teeth Count</th>
                                <td>{formik.values.teethCount}</td>
                              </tr>
                            </tbody>
                          </table>
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
                      Livestock Images
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row className='g-2'>
                        {
                          formik.values.imageOne &&
                          <Col sm={12} md={6} lg={6} xl={4}>
                            <div className='ratio ratio-16x9'>
                              <img className='rounded'
                                src={formik.values.imageOne} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                            </div>
                          </Col>
                        }
                        {
                          formik.values.imageTwo &&
                          <Col sm={12} md={6} lg={6} xl={4}>
                            <div className='ratio ratio-16x9'>
                              <img className='rounded'
                                src={formik.values.imageTwo} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                            </div>
                          </Col>
                        }
                        {
                          formik.values.imageThree &&
                          <Col sm={12} md={6} lg={6} xl={4}>
                            <div className='ratio ratio-16x9'>
                              <img className='rounded'
                                src={formik.values.imageThree} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                            </div>
                          </Col>
                        }
                        {
                          formik.values.imageFour &&
                          <Col sm={12} md={6} lg={6} xl={4}>
                            <div className='ratio ratio-16x9'>
                              <img className='rounded'
                                src={formik.values.imageFour} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                            </div>
                          </Col>
                        }
                        {
                          formik.values.imageFive &&
                          <Col sm={12} md={6} lg={6} xl={4}>
                            <div className='ratio ratio-16x9'>
                              <img className='rounded'
                                src={formik.values.imageFive} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                            </div>
                          </Col>
                        }
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
                      Consumer Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerFullname'
                            formik={formik}
                            disable={true}
                            label='Fullname'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={8} xl={9}>
                          <TextField
                            name='consumerAddress'
                            formik={formik}
                            disable={true}
                            label='Address'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerGeolocationLongitude'
                            formik={formik}
                            disable={true}
                            label='Longitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerGeolocationLatitude'
                            formik={formik}
                            disable={true}
                            label='Latitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerPrimaryPhone'
                            formik={formik}
                            disable={true}
                            label='Primary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerSecondaryPhone'
                            formik={formik}
                            disable={true}
                            label='Secondary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='consumerEmail'
                            formik={formik}
                            disable={true}
                            label='Email'
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
                </>
            }
            <GoBackButton path='/Admin/LivestockRequests' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default LivestockRequestInfo
