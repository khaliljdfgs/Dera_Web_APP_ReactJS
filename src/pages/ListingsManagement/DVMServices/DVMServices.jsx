import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Container, Button, Row, Col } from 'react-bootstrap'
import { Box, Tooltip, IconButton } from '@mui/material'
import { Add, Delete, Edit, Visibility } from '@mui/icons-material'
import { BeatLoader } from 'react-spinners'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

import { CustomDataTable, CustomAlertDialogue } from '../../../components'
import { FetchDVMServices, DeleteDVMService } from './DVMServicesAxios'
import { APP_TITLE } from '../../../config'
import { ToastValues } from '../../../values'

const DVMServices = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState(false)
  const [data, setData] = useState([])
  const [error, setError] = useState('')
  const [showDeleteDialogue, setShowDeleteDialogue] = useState({
    value: -1,
    status: false,
  })

  const navigate = useNavigate()
  const { state } = useLocation()

  const GetData = useCallback(async (props) => {
    if (error?.length > 1) return

    await FetchDVMServices({
      setError,
      setData,
      navigate,
      setIsLoading,
      ...props,
    })
  }, [error, navigate])

  useEffect(() => {
    document.title = `DVM Services | ${APP_TITLE}`

    if (state?.message && !toast.isActive('xyz')) {
      toast.success(state.message, ToastValues)

      navigate('/Admin/Services', {
        state: {},
        replace: true,
      })
    }

    GetData()
  }, [state, GetData, navigate])


  const columns = useMemo(() => [
    { accessorKey: 'rowNumber', header: '#', size: 0 },
    { accessorKey: 'serviceTitle', header: 'Title', size: 0 },
    { accessorKey: 'serviceCharges', header: 'Charges', size: 0 },
    { accessorKey: 'owner', header: 'Owner', size: 0 },
    { accessorKey: 'updatedAt', header: 'Last Modified', size: 0 },
    // { accessorKey: 'createdAt', header: 'Created At', size: 0 },
  ], [])

  return (
    <Container style={{
      padding: '1.25rem',
    }} >
      <ToastContainer />
      <Container style={{
        background: '#fff',
        padding: '1.5rem',
        borderRadius: '0.5rem',
      }}>
        {
          isLoading || error.length > 0
            ?
            <div className='d-flex justify-content-center align-items-center flex-column py-3'>
              <span className='mb-2 fs-5 text-secondary text-center'>
                {
                  error.length > 0
                    ? <>{error}<br />{'Refresh The Page!'}</>
                    : 'Loading Data'
                }
              </span>
              {
                error.length > 0
                  ? ''
                  : <BeatLoader color='#333333' size={12} />
              }
            </div>
            :
            <CustomDataTable
              state={{ isLoading }}
              columns={columns}
              data={data}
              renderTopToolbarCustomActions={() => (
                <Container className='m-0 p-0'>
                  <Row className='m-0 p-0'>
                    <Col className='m-0 p-0'>
                      <Button
                        variant='primary'
                        disabled
                        className='btn-sm text-uppercase d-flex justify-content-center align-items-center pe-3 mb-2 mb-lg-0'>
                        <Add style={{ marginRight: '0.25rem', fontSize: '1rem' }} />Add
                      </Button>
                    </Col>
                  </Row>
                </Container>
              )}
              renderRowActions={({ row, table }) => (
                <Box sx={{ display: 'flex' }}>
                  <Tooltip
                    arrow
                    placement='left'
                    title='Edit'>
                    <IconButton onClick={() => navigate(`/Admin/ServiceInfo/${row.original.uid}`)}>
                      <Edit />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement='right'
                    title='View'>
                    <IconButton
                      color='primary'
                      onClick={() => {
                        navigate(`/Admin/ServiceInfo/${row.original.uid}`, {
                          state: {
                            mode: 0,
                          },
                        })
                      }}>
                      <Visibility />
                    </IconButton>
                  </Tooltip>
                  <Tooltip
                    arrow
                    placement='right'
                    title='Delete'>
                    <IconButton
                      color='error'
                      onClick={() => setShowDeleteDialogue({
                        value: row.original.uid,
                        status: true,
                      })}>
                      <Delete />
                    </IconButton>
                  </Tooltip>
                </Box>
              )}
            />
        }

        {
          showDeleteDialogue.status
            ?
            <CustomAlertDialogue
              title='Warning'
              positiveMessage='Delete'
              negativeMessage='Cancel'
              isLoading={isDeleting}
              positiveCallback={async () => {
                await DeleteDVMService({
                  id: showDeleteDialogue.value,
                  setError,
                  navigate,
                  setIsDeleting,
                })

                setShowDeleteDialogue({ status: false })
              }}
              negativeCallback={() => setShowDeleteDialogue({ status: false })}
              show={showDeleteDialogue.status}
              handleClose={() => setShowDeleteDialogue({ status: false })}>
              <p>Are you sure you want to delete this DVM service?</p>
              <p>Once deleted, you will not be able to revert the changes! Following information will be deleted:</p>
              <ul>
                <li>DVM Service's Information</li>
                <li>DVM Service's Availments and History</li>
              </ul>
            </CustomAlertDialogue>
            : ''
        }
      </Container>
    </Container>
  )
}

export default DVMServices