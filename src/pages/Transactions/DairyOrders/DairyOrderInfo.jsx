import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'

import { GoBackButton, TextField } from '../../../components'
import { APP_TITLE } from '../../../config'
import { FetchDairyOrderData } from './DairyOrderInfoAxios'

const DairyProductInfo = () => {
  const [isGettingData, setIsGettingData] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Dairy Order Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/DairyOrders')
      return
    }

    FetchDairyOrderData({
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
            <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }}>
              {
                isGettingData
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
                        Dairy Order
                      </span>
                    </p>

                    <Row>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='quantity'
                          formik={formik}
                          disable={true}
                          label='Quantity'
                          placeholder='' />
                      </Col>

                      {
                        formik.values.isSubscription &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <Form.Group className='mb-3'>
                            <Form.Label>Subscribed</Form.Label>
                            <Form.Control value={formik.values.isSubscription ? 'Yes' : 'No'} disabled />
                          </Form.Group>
                        </Col>
                      }


                      {
                        formik.values.isSingleOrder &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <Form.Group className='mb-3'>
                            <Form.Label>Single Order</Form.Label>
                            <Form.Control value={formik.values.isSingleOrder ? 'Yes' : 'No'} disabled />
                          </Form.Group>
                        </Col>
                      }

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='deliveryTime'
                          formik={formik}
                          disable={true}
                          label='Delivery Time'
                          placeholder='' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='status'
                          formik={formik}
                          disable={true}
                          label='Status'
                          placeholder='' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='placedOn'
                          formik={formik}
                          disable={true}
                          label='Placed On'
                          placeholder='' />
                      </Col>

                      {
                        formik.values.confirmedOn &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='confirmedOn'
                            formik={formik}
                            disable={true}
                            label='Confirmed On'
                            placeholder='' />
                        </Col>
                      }

                      {
                        formik.values.cancelledOn &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='cancelledOn'
                            formik={formik}
                            disable={true}
                            label='Cancelled On'
                            placeholder='' />
                        </Col>
                      }

                      {
                        formik.values.deliveredOn &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='deliveredOn'
                            formik={formik}
                            disable={true}
                            label='Delivered On'
                            placeholder='' />
                        </Col>
                      }

                      {
                        formik.values.rejectedOn &&
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='rejectedOn'
                            formik={formik}
                            disable={true}
                            label='Rejected On'
                            placeholder='' />
                        </Col>
                      }
                    </Row>
                  </>
              }
            </Container>

            {
              isGettingData
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
                      Product Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row className='g-2'>
                        <Col sm={12} md={4} lg={4} xl={3}>
                          <div className='ratio ratio-1x1 mb-3'>
                            <img className='rounded'
                              src={formik.values.productImage} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                          </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xl={9}>
                          {/* table */}
                          <table className='table table-striped table-bordered'>
                            <tbody>
                              <tr>
                                <th scope='row'>Name</th>
                                <td>{formik.values.productName}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Description</th>
                                <td>{formik.values.productDescription}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Price</th>
                                <td>{formik.values.productPrice}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Category</th>
                                <td>{formik.values.productCategory}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Rating</th>
                                <td>{formik.values.rating}&nbsp;&nbsp;&nbsp;&nbsp;
                                  <sm className='text-italic text-danger'>{`Rated By: ${formik.values.ratingCount}`}</sm>
                                </td>
                              </tr>
                              <tr>
                                <th scope='row'>Purchased</th>
                                <td>{formik.values.purchasedCount}</td>
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
            <GoBackButton path='/Admin/DairyOrders' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default DairyProductInfo