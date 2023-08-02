import React, { useState, useEffect } from 'react'
import { Container, Form, Col, Row } from 'react-bootstrap'
import { Formik } from 'formik'
import { BeatLoader } from 'react-spinners'
import { useParams, useNavigate } from 'react-router-dom'

import { GoBackButton, TextField } from '../../../components'
import { APP_TITLE } from '../../../config'
import { FetchQueryData } from './QueryInfoAxios'

const QueryInfo = () => {
  const [isGettingData, setIsGettingData] = useState(true)
  const [initialValues, setInitialValues] = useState({})
  const [fetchError, setFetchError] = useState('')

  const parameters = useParams()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Query Info | ${APP_TITLE}`

    if (parameters.id === undefined) {
      navigate('/Admin/Queries')
      return
    }

    FetchQueryData({
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
                    <h3 className='text-danger'>{formik.values.subject}</h3>
                    <small className='d-block text-secondary'>Submitted At: {formik.values.submittedAt}</small>
                    <p className='mt-2 mb-0 p-0'>{formik.values.query}</p>
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
                      Submitted By
                    </p>
                    <Container className='m-0 p-0 mt-3'>
                      <Row>
                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedByFullname'
                            formik={formik}
                            disable={true}
                            label='Fullname'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={8} xl={9}>
                          <TextField
                            name='submittedByAddress'
                            formik={formik}
                            disable={true}
                            label='Address'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedByGeolocationLongitude'
                            formik={formik}
                            disable={true}
                            label='Longitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedByGeolocationLatitude'
                            formik={formik}
                            disable={true}
                            label='Latitude'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedByPrimaryPhone'
                            formik={formik}
                            disable={true}
                            label='Primary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedBySecondaryPhone'
                            formik={formik}
                            disable={true}
                            label='Secondary Phone'
                            placeholder='' />
                        </Col>

                        <Col sm={12} md={6} lg={4} xl={3}>
                          <TextField
                            name='submittedByEmail'
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
            <GoBackButton path='/Admin/Queries' />
          </Form>
        )}
      </Formik>
    </Container>
  )
}

export default QueryInfo