/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useCallback } from 'react'
import { Container, Row, Col, Card } from 'react-bootstrap'
import { BeatLoader } from 'react-spinners'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Tooltip, Legend, PieChart, Pie, Cell } from 'recharts'

import { FetchUserData, FetchDairyProductData, FetchLivestockData } from './DashboardAxios'
import { APP_TITLE } from '../../config'

const RADIAN = Math.PI / 180
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  const percentage = (percent * 100).toFixed(0)

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {percentage > 0 ? `${percentage}%` : null}
    </text>
  )
}

const Dashboard = () => {
  const [error, setError] = useState('')

  const [userData, setUserData] = useState({})
  const [isUserDataLoading, setIsUserDataLoading] = useState(true)

  const [dairyProductData, setDairyProductData] = useState({})
  const [isDairyProductDataLoading, setIsDairyProductDataLoading] = useState(true)

  const [livestockData, setLivestockData] = useState({})
  const [isLivestockDataLoading, setIsLivestockDataLoading] = useState(true)

  const AllUsersColors = ['#55BB91', '#0A5688', '#FF8042', '#b586e6']
  const UserStatsColors = ['#0A5688', '#55BB91', '#F25F5C']
  const UserStatsKeys = ['pending', 'active', 'suspended']

  const GetData = useCallback(async (props) => {
    if (error?.length > 1) return

    await FetchUserData({
      setError,
      setData: setUserData,
      setIsLoading: setIsUserDataLoading,
      ...props,
    })

    await FetchDairyProductData({
      setError,
      setData: setDairyProductData,
      setIsLoading: setIsDairyProductDataLoading,
      ...props,
    })

    await FetchLivestockData({
      setError,
      setData: setLivestockData,
      setIsLoading: setIsLivestockDataLoading,
      ...props,
    })
  }, [error])

  useEffect(() => {
    document.title = `Dashboard | ${APP_TITLE}`

    GetData()
  }, [GetData])

  const Loading = ({ slim = false }) => {
    return slim
      ?
      <div className='d-flex justify-content-center align-items-center flex-column py-3'>
        <BeatLoader color='#333333' size={12} />
      </div>
      :
      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }} >
        <div className='d-flex justify-content-center align-items-center flex-column py-3'>
          <span className='mb-2 fs-5 text-secondary text-center'>Loading Data</span>
          <BeatLoader color='#333333' size={12} />
        </div>
      </Container>
  }

  if (error.length > 0) {
    return (
      <Container style={{ padding: '1.25rem' }} >
        <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }}>
          <div className='d-flex justify-content-center align-items-center flex-column py-3'>
            <span className='mb-2 fs-5 text-secondary text-center'>
              <>{error}<br />{'Refresh The Page!'}</>
            </span>
          </div>
        </Container>
      </Container>
    )
  }


  return (
    <Container style={{ padding: '1.25rem' }} >
      {
        isUserDataLoading ? <Loading /> :
          <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }}>
            <Container>
              <Row className='m-0 p-0'>
                <Col sm={12} md={12} lg={3} xl={3} className='m-0 p-0'>
                  <p className='p-0 m-0 text-center'>User Stats <small className=''>(all time)</small></p>
                  <ResponsiveContainer width='100%' height={250}>
                    <PieChart>
                      <Pie
                        data={userData.allTime}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="total"
                      >
                        {userData.allTime.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={AllUsersColors[index % AllUsersColors.length]} />
                        ))}
                      </Pie>
                      <Tooltip content={({ active, payload, label }) => {
                        if (active) {
                          return (
                            <div className='p-2' style={{ background: '#fff', border: '1px solid #ccc' }}>
                              <p className='p-0 m-0' style={{ fontSize: '0.85rem', color: '#2c2c2c' }}>{`${payload[0]?.payload?.name}`}</p>
                              <p className='p-0 m-0' style={{ fontSize: '0.75rem', color: '#1e1e1e' }}>{`total : ${payload[0]?.payload?.total}`}</p>
                              <p className='p-0 m-0' style={{ fontSize: '0.75rem', color: UserStatsColors[0] }}>{`pending : ${payload[0]?.payload?.pending}`}</p>
                              <p className='p-0 m-0' style={{ fontSize: '0.75rem', color: UserStatsColors[1] }}>{`active : ${payload[0]?.payload?.active}`}</p>
                              <p className='p-0 m-0' style={{ fontSize: '0.75rem', color: UserStatsColors[2] }}>{`suspended : ${payload[0]?.payload?.suspended}`}</p>
                            </div>
                          )
                        }
                        return null
                      }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Col>
                <Col sm={12} md={12} lg={9} xl={9} className='mt-sm-3 mt-md-3 mt-lg-0 m-0 p-0'>
                  <p className='p-0 m-0 text-center'>User Stats <small className=''>(in last 7 days)</small></p>
                  <ResponsiveContainer width='100%' height={250}>
                    <BarChart data={userData.last14Days} layout='vertical' style={{ fontSize: '0.8rem' }}>
                      <CartesianGrid strokeDasharray='3 3' />
                      <Tooltip />
                      <Legend />
                      <XAxis type='number' tickMargin={4} />
                      <YAxis type='category' dataKey='name' angle={-45} textAnchor='end' tickMargin={8} />
                      {
                        UserStatsKeys.map((key, index) => <Bar dataKey={key} stackId='a' fill={UserStatsColors[index]} />)
                      }
                    </BarChart>
                  </ResponsiveContainer>
                </Col>
              </Row>
            </Container>
          </Container>
      }

      <span className='m-0 p-0 mt-3 d-block'></span>

      <Container style={{ background: '#fff', padding: '1.5rem', borderRadius: '0.5rem' }}>
        <Container className='m-0 p-0'>
          <Row className='g-3'>
            <Col sm={12} md={6} lg={4} xl={3}>
              <Card>
                {
                  isUserDataLoading ? <span className='my-3'><Loading slim /></span> :
                    <Card.Body className='pb-0'>
                      <Card.Title className='m-0 p-0 text-center'>Total Users</Card.Title>
                      <Card.Text className='m-0 p-0'>
                        <span className='fs-2 d-block text-center'>{userData.totalUsers}</span>
                        <ul className='list-unstyled mt-2 border border-bottom-0 border-start-0 border-end-0 border-secondary pt-2 px-1'>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Admins</span>
                            <span className='text-secondary'>{userData.totalAdmin}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Consumers</span>
                            <span className='text-secondary'>{userData.allTime[2].total}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Deras</span>
                            <span className='text-secondary'>{userData.allTime[1].total}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>DVMs</span>
                            <span className='text-secondary'>{userData.allTime[0].total}</span>
                          </li>
                        </ul>
                      </Card.Text>
                    </Card.Body>
                }
              </Card>
            </Col>

            <Col sm={12} md={6} lg={4} xl={3}>
              <Card>
                {
                  isDairyProductDataLoading ? <span className='my-3'><Loading slim /></span> :
                    <Card.Body className='pb-0'>
                      <Card.Title className='m-0 p-0 text-center'>Dairy Products</Card.Title>
                      <Card.Text className='m-0 p-0'>
                        <span className='fs-2 d-block text-center'>{dairyProductData.totalProducts}</span>
                        <ul className='list-unstyled mt-2 border border-bottom-0 border-start-0 border-end-0 border-secondary pt-2 px-1'>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Subscription</span>
                            <span className='text-secondary'>{dairyProductData.products[0].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Single Order</span>
                            <span className='text-secondary'>{dairyProductData.products[1].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Both</span>
                            <span className='text-secondary'>{dairyProductData.products[2].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Avg. Price</span>
                            <span className='text-secondary'>Rs. {Number(dairyProductData.avgPrice).toFixed(0)}</span>
                          </li>
                        </ul>
                      </Card.Text>
                    </Card.Body>
                }
              </Card>
            </Col>

            <Col sm={12} md={6} lg={4} xl={3}>
              <Card>
                {
                  isDairyProductDataLoading ? <span className='my-3'><Loading slim /></span> :
                    <Card.Body className='pb-0'>
                      <Card.Title className='m-0 p-0 text-center'>Dairy Orders</Card.Title>
                      <Card.Text className='m-0 p-0'>
                        <span className='fs-2 d-block text-center'>{dairyProductData.totalOrders}</span>
                        <ul className='list-unstyled mt-2 border border-bottom-0 border-start-0 border-end-0 border-secondary pt-2 px-1'>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Morning Time</span>
                            <span className='text-secondary'>{dairyProductData.totalMorningOrders}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Evening Time</span>
                            <span className='text-secondary'>{dairyProductData.totalEveningOrders}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Subscriptions</span>
                            <span className='text-secondary'>{dairyProductData.totalSubscriptionBasedOrders}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Single Orders</span>
                            <span className='text-secondary'>{dairyProductData.totalSingleOrderBasedOrders}</span>
                          </li>
                        </ul>
                      </Card.Text>
                    </Card.Body>
                }
              </Card>
            </Col>


            <Col sm={12} md={6} lg={4} xl={3}>
              <Card>
                {
                  isLivestockDataLoading ? <span className='my-3'><Loading slim /></span> :
                    <Card.Body className='pb-0'>
                      <Card.Title className='m-0 p-0 text-center'>Livestocks</Card.Title>
                      <Card.Text className='m-0 p-0'>
                        <span className='fs-2 d-block text-center'>{livestockData.totalLivestocks}</span>
                        <ul className='list-unstyled mt-2 border border-bottom-0 border-start-0 border-end-0 border-secondary pt-2 px-1'>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Available</span>
                            <span className='text-secondary'>{livestockData.livestock[0].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Sold-Out</span>
                            <span className='text-secondary'>{livestockData.livestock[1].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Rejected</span>
                            <span className='text-secondary'>{livestockData.livestock[2].value}</span>
                          </li>
                          <li className='d-flex justify-content-between align-items-center'>
                            <span className='text-secondary'>Pending</span>
                            <span className='text-secondary'>{livestockData.livestock[3].value}</span>
                          </li>
                        </ul>
                      </Card.Text>
                    </Card.Body>
                }
              </Card>
            </Col>


            <Col sm={12} md={6} lg={4} xl={3}>
              {
                isDairyProductDataLoading ? <span className='my-3'><Loading slim /></span> :
                  <>
                    <p className='p-0 m-0 text-center'>Dairy Products <small className=''>(order type)</small></p>
                    <ResponsiveContainer width='100%' height={250}>
                      <PieChart>
                        <Pie
                          data={dairyProductData.products}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {dairyProductData.products.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={AllUsersColors[index % AllUsersColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={({ active, payload, label }) => {
                          if (active) {
                            return (
                              <div className='p-2' style={{ background: '#fff', border: '1px solid #ccc' }}>
                                <p className='p-0 m-0' style={{ fontSize: '0.85rem', color: '#2c2c2c' }}>{`${payload[0]?.payload?.name} : ${payload[0]?.payload?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
              }
            </Col>

            <Col sm={12} md={6} lg={4} xl={3}>
              {
                isLivestockDataLoading ? <span className='my-3'><Loading slim /></span> :
                  <>
                    <p className='p-0 m-0 text-center'>Livestocks <small className=''>(status)</small></p>
                    <ResponsiveContainer width='100%' height={250}>
                      <PieChart>
                        <Pie
                          data={livestockData.livestock}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={renderCustomizedLabel}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {livestockData.livestock.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={AllUsersColors[index % AllUsersColors.length]} />
                          ))}
                        </Pie>
                        <Tooltip content={({ active, payload, label }) => {
                          if (active) {
                            return (
                              <div className='p-2' style={{ background: '#fff', border: '1px solid #ccc' }}>
                                <p className='p-0 m-0' style={{ fontSize: '0.85rem', color: '#2c2c2c' }}>{`${payload[0]?.payload?.name} : ${payload[0]?.payload?.value}`}</p>
                              </div>
                            )
                          }
                          return null
                        }} />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </>
              }
            </Col>
          </Row>
        </Container>
      </Container>
    </Container>
  )
}

export default Dashboard