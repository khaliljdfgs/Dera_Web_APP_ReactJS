import React, { useState, useEffect, useContext } from 'react'
import {
  Dashboard,
  LocalHospital,
  Menu as MenuIcon,
  Store,
  Logout,
} from '@mui/icons-material'
import { HiUsers, HiTemplate } from 'react-icons/hi'
import { GiMilkCarton } from 'react-icons/gi'
import { IoMdContacts } from 'react-icons/io'
import { HiSpeakerphone } from 'react-icons/hi'
import { MdOutlineMedicalServices, MdNotificationsActive } from 'react-icons/md'
import { Sidebar, Menu, MenuItem, menuClasses, sidebarClasses, useProSidebar } from 'react-pro-sidebar'
import { Link, useNavigate, Outlet } from 'react-router-dom'
import { CustomAlertDialogue } from './index.js'
import { signOut } from 'firebase/auth'

import { Authentication } from '../config/firebase.js'
import { APP_TITLE } from '../config'
import { AuthContext } from '../components'

const CustomMenuItem = ({ path, title, icon }) => {
  const _path = `${path}`.toLowerCase()
  const _pathname = `${window.location.pathname}`.toLowerCase()
  let isActive = _pathname === _path

  if (_path === '/admin/consumers' && _pathname.includes('/consumer')) isActive = true
  else if (_path === '/admin/deras' && _pathname.includes('/dera')) isActive = true
  else if (_path === '/admin/dvms' && _pathname.includes('/dvm')) isActive = true
  else if (_path === '/admin/dairyproducts' && _pathname.includes('/dairyproduct')) isActive = true
  else if (_path === '/admin/livestocks' && _pathname.includes('/livestock')) isActive = true
  else if (_path === '/admin/services' && _pathname.includes('/service') && !_pathname.includes('enrollment')) isActive = true
  else if (_path === '/admin/dairyorders' && _pathname.includes('/dairyorder')) isActive = true
  else if (_path === '/admin/livestockrequests' && _pathname.includes('/livestockrequest')) isActive = true
  else if (_path === '/admin/serviceenrollments' && _pathname.includes('enrollment')) isActive = true
  else if (_path === '/admin/queries' && _pathname.includes('/quer')) isActive = true
  else if (_path === '/admin/promotions' && _pathname.includes('/promotion')) isActive = true
  else if (_path === '/admin/pushnotifications' && _pathname.includes('/pushnotification')) isActive = true

  useEffect(() => {
    document.title = `${APP_TITLE}`
  }, [])

  return (
    <MenuItem
      id={isActive ? '' : 'rps-menu-item'}
      active={isActive}
      component={<Link to={path} />}
      icon={icon}
    >{title}</MenuItem>
  )
}

const SidebarHead = ({ fullname }) => {
  const titleStyles = {
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: 0,
    fontSize: '2rem'
  }

  const userStyles = {
    textAlign: 'center',
    textTransform: 'uppercase',
    margin: 0,
    fontSize: '1.15rem',
    letterSpacing: 1.5
  }

  const emailStyles = {
    textAlign: 'center',
    fontSize: '0.9rem',
  }

  return (
    <div style={{ padding: '2.75rem', backgroundColor: '#0A568888' }}>
      <p style={titleStyles}>DERA</p>
      <p style={userStyles}>Admin Panel</p>
      <p style={emailStyles}>
        <span style={{
          color: '#00ff00',
          fontSize: '0.8rem',
          marginRight: '0.4rem',
          marginLeft: '-0.4rem'
        }}>●</span>
        {fullname}
      </p>
    </div>
  )
}

const SideBarSeparator = ({ title }) => {
  return (
    <p style={{
      margin: 0, padding: '0.25rem 1.25rem', textTransform: 'uppercase',
      fontSize: '0.8rem', letterSpacing: 1.5, background: '#4d4d4d',
      color: '#cfcfcf', lineHeight: '1.25rem'
    }}>{title}</p>
  )
}

const GetTitle = () => {
  const path = window.location.pathname.toLowerCase()
  let title = '', hover_title = ''

  const pathToTitle = {
    '/admin': 'Dashboard',
    '/admin/consumers': 'Consumers',
    '/admin/consumerinfo': 'Consumer Info',
    '/admin/deras': 'Deras',
    '/admin/derainfo': 'Dera Info',
    '/admin/dvms': 'DVMs',
    '/admin/dvminfo': 'DVM Info',
    '/admin/dairyproducts': 'Dairy Products',
    '/admin/dairyproductinfo': 'Dairy Product Info',
    '/admin/livestocks': 'Livestocks',
    '/admin/livestockinfo': 'Livestock Info',
    '/admin/services': 'DVM Services',
    '/admin/serviceinfo': 'DVM Service Info',
    '/admin/dairyorders': 'Dairy Orders',
    '/admin/dairyorderinfo': 'Dairy Orders Info',
    '/admin/livestockrequests': 'Livestock Requests',
    '/admin/livestockrequest': 'Livestock Request Info',
    '/admin/serviceenrollments': 'DVM Service Enrollments',
    '/admin/serviceenrollment': 'DVM Service Enrollment Info',
    '/admin/queries': 'Queries',
    '/admin/queryinfo': 'Query Info',
    '/admin/promotions': 'Promotions',
    '/admin/pushnotifications': 'Push Notifications',
  }

  const matchingEntry = Object.entries(pathToTitle).find(([key]) => key === path)
  if (matchingEntry) {
    title = matchingEntry[1]
    hover_title = matchingEntry[1]

    if (path.includes('dvm')) {
      hover_title = hover_title.replace('DVM', 'Doctor of Veterinary Medicine')
    }

    if (path.includes('dvms')) {
      hover_title = hover_title.replace('DVMs', 'Doctors of Veterinary Medicine')
    }
  } else {
    const patterns = [
      { pattern: 'consumers', title: 'Consumers', hover_title: 'Consumer' },
      { pattern: 'consumerinfo', title: 'Consumer Info', hover_title: 'Consumer' },
      { pattern: 'deras', title: 'Deras', hover_title: 'Dera' },
      { pattern: 'derainfo', title: 'Dera Info', hover_title: 'Dera' },
      { pattern: 'dvms', title: 'DVMs', hover_title: 'Doctors of Veterinary Medicine' },
      { pattern: 'dvminfo', title: 'DVM Info', hover_title: 'Doctor of Veterinary Medicine Info' },
      { pattern: 'dairyproducts', title: 'Dairy Products', hover_title: 'Dairy Product' },
      { pattern: 'dairyproductinfo', title: 'Dairy Product Info', hover_title: 'Dairy Product' },
      { pattern: 'livestocks', title: 'Livestocks', hover_title: 'Livestock' },
      { pattern: 'livestockinfo', title: 'Livestock Info', hover_title: 'Livestock' },
      { pattern: 'services', title: 'DVM Services', hover_title: 'Doctor of Veterinary Medicine Services' },
      { pattern: 'serviceinfo', title: 'DVM Service Info', hover_title: 'Doctor of Veterinary Medicine Service' },
      { pattern: 'dairyorders', title: 'Dairy Orders', hover_title: 'Dairy Order' },
      { pattern: 'dairyorderinfo', title: 'Dairy Order Info', hover_title: 'Dairy Order Info' },
      { pattern: 'livestockrequests', title: 'Livestock Requests', hover_title: 'Livestock Request' },
      { pattern: 'livestockrequest', title: 'Livestock Request Info', hover_title: 'Livestock Request Info' },
      { pattern: 'serviceenrollments', title: 'DVM Service Enrollments', hover_title: 'Doctor of Veterinary Medicine Service Enrollments' },
      { pattern: 'serviceenrollment', title: 'DVM Service Enrollment Info', hover_title: 'Doctor of Veterinary Medicine Service Enrollment Info' },
      { pattern: 'queries', title: 'Queries', hover_title: 'Query' },
      { pattern: 'queryinfo', title: 'Query Info', hover_title: 'Query Info' },
      { pattern: 'promotions', title: 'Promotions', hover_title: 'Promotions' },
      { pattern: 'pushnotifications', title: 'Push Notifications', hover_title: 'Push Notifications' },
    ]

    const matchingPattern = patterns.find(({ pattern }) => path.includes(pattern))
    title = matchingPattern ? matchingPattern.title : 'Error'
    hover_title = matchingPattern ? matchingPattern.hover_title : 'Error'
  }

  return { path, title, hover_title }
}

const Layout = () => {
  const authContext = useContext(AuthContext)

  const SideBarRootStyles = {
    ['.' + sidebarClasses.container]: {
      backgroundColor: '#1f1f1f',
      color: '#fff',
      height: '100%'
    }
  }

  const MenuRootStyles = {
    ['.' + menuClasses.active]: {
      backgroundColor: '#363636',
      color: '#fff',
      '&:hover': { backgroundColor: '#363636', }
    },
    ['.' + menuClasses.button]: {
      height: 42,
    },
    ['.' + menuClasses.icon + ' *']: {
      height: 20,
    },
  }

  const { toggleSidebar } = useProSidebar()
  const navigate = useNavigate()

  const [showClearDialogue, setShowClearDialogue] = useState(false)

  return (
    <div className='row m-0' style={{ height: '100vh' }}>
      <div className='col-auto m-0 p-0'>
        <Sidebar rootStyles={SideBarRootStyles} breakPoint="md">
          <SidebarHead fullname={authContext?.email} />
          <Menu rootStyles={MenuRootStyles}>
            <CustomMenuItem title='Dashboard' path='/Admin' icon={<Dashboard />} />
            <SideBarSeparator title='Users Management' />
            <CustomMenuItem title='Consumers' path='/Admin/Consumers' icon={<HiUsers />} />
            <CustomMenuItem title='Deras' path='/Admin/Deras' icon={<Store />} />
            <CustomMenuItem title='DVMs' path='/Admin/DVMs' icon={<LocalHospital />} />
            <SideBarSeparator title='Listings Management' />
            <CustomMenuItem title='Dairy Products' path='/Admin/DairyProducts' icon={<GiMilkCarton />} />
            <CustomMenuItem title='Livestocks' path='/Admin/Livestocks' icon={<HiTemplate />} />
            <CustomMenuItem title='DVM Services' path='/Admin/Services' icon={<MdOutlineMedicalServices />} />
            <SideBarSeparator title='Transactions' />
            <CustomMenuItem title='Dairy Orders' path='/Admin/DairyOrders' icon={<GiMilkCarton />} />
            <CustomMenuItem title='Livestock Requests' path='/Admin/LivestockRequests' icon={<HiTemplate />} />
            <CustomMenuItem title='DVM Services' path='/Admin/ServiceEnrollments' icon={<MdOutlineMedicalServices />} />
            <SideBarSeparator title='Others' />
            <CustomMenuItem title='Queries' path='/Admin/Queries' icon={<IoMdContacts />} />
            <CustomMenuItem title='Push Notifications' path='/Admin/PushNotifications' icon={<MdNotificationsActive />} />
            <CustomMenuItem title='Promotions' path='/Admin/Promotions' icon={<HiSpeakerphone />} />
            <div style={{ height: '10rem' }}></div>
          </Menu>
        </Sidebar>
      </div>
      <div className='col m-0 p-0 pb-5' style={{ width: '50%' }}>
        <div style={{ display: 'flex', backgroundColor: '#fff', padding: '0.5rem 1rem' }}>
          <button id='menu-toggle-button' onClick={() => toggleSidebar()}>
            <MenuIcon />
          </button>
          <p
            style={{
              margin: 0,
              // textTransform: 'uppercase',
              display: 'inline-block',
              fontSize: '1.3rem',
              fontWeight: 'bold',
              cursor: 'pointer',
            }}
            title={GetTitle().hover_title}
            onClick={() => navigate(GetTitle().path)}>
            {GetTitle().title}
          </p>
          <button
            style={{ marginLeft: 'auto', }}
            id='logout-button'
            onClick={() => setShowClearDialogue(true)}>
            <Logout />
          </button>
        </div>
        {
          showClearDialogue
            ?
            <CustomAlertDialogue
              title='Warning'
              positiveMessage='Yes'
              negativeMessage='No'
              positiveCallback={() => {
                signOut(Authentication).then(() => {
                  navigate('/Admin/Login', {
                    replace: true,
                  })
                  setShowClearDialogue(false)
                })
                // localStorage.clear()
              }}
              negativeCallback={() => setShowClearDialogue(false)}
              show={showClearDialogue}
              handleClose={() => setShowClearDialogue(false)}>
              <p>Are you sure you want to logout?</p>
            </CustomAlertDialogue>
            : ''
        }
        <Outlet />
      </div>
    </div>
  )
}

export default Layout