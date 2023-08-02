import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'

import { GoBackButton, TextField } from '../../../components'
import { APP_TITLE } from '../../../config'
import { FetchDVMServiceEnrollmentData } from './DVMServiceEnrollmentInfoAxios'

const DVMServiceEnrollmentInfo = () => {
  const [isGettingData, setIsGettingData] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `DVM Service Enrollment Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/ServiceEnrollments')
      return
    }

    FetchDVMServiceEnrollmentData({
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
                    {/* <p className='p-0 m-0 mb-3 d-inline'>
                      <span className='fs-3 fw-bold text-uppercase'>
                        DVM Service Enrollment
                      </span>
                    </p> */}

                    <Row>
                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='serviceAvailedAt'
                          formik={formik}
                          disable={true}
                          label='Availed At'
                          placeholder='' />
                      </Col>

                      <Col sm={12} md={6} lg={4} xl={3}>
                        <TextField
                          name='serviceStatus'
                          formik={formik}
                          disable={true}
                          label='Status'
                          placeholder='' />
                      </Col>
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
                      Service Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row className='g-2'>
                        <Col sm={12} md={4} lg={4} xl={3}>
                          <div className='ratio ratio-1x1 mb-3'>
                            <img className='rounded'
                              src={formik.values.serviceImage} alt='' style={{ width: '100%', objectFit: 'cover' }} />
                          </div>
                        </Col>
                        <Col sm={12} md={8} lg={8} xl={9}>
                          {/* table */}
                          <table className='table table-striped table-bordered'>
                            <tbody>
                              <tr>
                                <th scope='row'>Name</th>
                                <td>{formik.values.serviceTitle}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Description</th>
                                <td>{formik.values.serviceDescription}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Charges</th>
                                <td>{formik.values.serviceCharges}</td>
                              </tr>
                              <tr>
                                <th scope='row'>Total Availments</th>
                                <td>{formik.values.totalAvailments}</td>
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
                      Dera Details
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByFullname'
                            formik={formik}
                            disable={true}
                            label='Fullname'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={8} xl={9}>
                          <TextField
                            name='availedByAddress'
                            formik={formik}
                            disable={true}
                            label='Address'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByBusinessName'
                            formik={formik}
                            disable={true}
                            label='Business Name'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByGeolocationLongitude'
                            formik={formik}
                            disable={true}
                            label='Longitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByGeolocationLatitude'
                            formik={formik}
                            disable={true}
                            label='Latitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByPrimaryPhone'
                            formik={formik}
                            disable={true}
                            label='Primary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedBySecondaryPhone'
                            formik={formik}
                            disable={true}
                            label='Secondary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='availedByEmail'
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
            <GoBackButton path='/Admin/ServiceEnrollments' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default DVMServiceEnrollmentInfo