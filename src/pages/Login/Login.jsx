import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { BeatLoader } from 'react-spinners'
import { signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'

import './Login.css'
import { APP_TITLE } from '../../config'
import { Authentication, Firestore } from '../../config/firebase'

const LoginPage = ({ theme }) => {
  const [email, setEmail] = useState('')
  const [emailError, setError] = useState('')
  const [password, setPassword] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const navigate = useNavigate()

  useEffect(() => {
    document.title = `Login | ${APP_TITLE}`

    onAuthStateChanged(Authentication, user => {
      if (user) {
        if (localStorage.getItem("user")) {
          const data = JSON.parse(localStorage.getItem("user"))
          if (data.accountType === "admin") {
            navigate('/Admin', { replace: true })
          }
        }
      } else {
        console.error('User not found!')
      }
    })
  }, [navigate])

  const HandleSubmit = async e => {
    e.preventDefault()

    if (!email) {
      setError('Required')
    } else if (!password) {
      setPasswordError('Required')
    } else if (!email.match(/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/)) {
      setError('Invalid Email!')
    } else if (email.length < 10) {
      setError('Invalid Phone Number!')
    }

    setIsLoading(true)

    try {
      const { user } = await signInWithEmailAndPassword(Authentication, email, password)

      if (user) {
        const userDoc = await getDoc(doc(Firestore, 'users', user.uid))

        if (userDoc.exists()) {
          if (userDoc.data().accountType === 'admin') {
            localStorage.setItem('user', JSON.stringify({
              ...userDoc.data(),
              uid: user.uid,
              email: user.email
            }))

            navigate('/Admin', { replace: true })
          } else {
            setError('You are not an admin!')
          }
        } else {
          setError('User not found!')
        }
      } else {
        setError('User not found!')
      }
    } catch (error) {
      const errorCode = error.code
      if (errorCode === 'auth/user-not-found') {
        setError('User not found!')
      } else if (errorCode === 'auth/wrong-password') {
        setPasswordError('Wrong Password!')
      } else if (errorCode === 'auth/too-many-requests') {
        setError('Too many requests!')
      } else {
        setError(errorCode)
      }
    }

    setIsLoading(false)
  }

  return (
    <div id='login-parent'>
      <div className='login-form'>
        <form onSubmit={HandleSubmit}>
          <h1>DERA</h1>
          <div className='content'>
            <div className='input-field'>
              <p>Email</p>
              <input
                type='email'
                placeholder='Enter Your Email'
                value={email}
                onChange={e => {
                  setError('')
                  setEmail(e.target.value)
                }}
              />
              <small style={{ color: 'red' }}>{emailError}</small>
            </div>
            <div className='input-field'>
              <p>Password</p>
              <input
                type='password'
                placeholder='Enter Your Password'
                value={password}
                onChange={e => {
                  setPasswordError('')
                  setPassword(e.target.value)
                }}
              />
              <small style={{ color: 'red' }}>{passwordError}</small>
            </div>
          </div>
          <button type='submit'>
            {
              isLoading
                ? <BeatLoader color='#fff' size={8} />
                : 'PROCEED'
            }
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage