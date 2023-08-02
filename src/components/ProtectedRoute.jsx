// I have used useContext to save the user data and JWT token.
// And to make it accessible across the Dashboard
// # Global Context

import React, { useEffect, useState, createContext } from "react"
import { useNavigate } from "react-router-dom"
import { onAuthStateChanged, signOut } from "firebase/auth"

import { Authentication } from "../config/firebase"

export const AuthContext = createContext()

export const ProtectedRoute = (props) => {
  const navigate = useNavigate()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userData, setUserData] = useState({})

  useEffect(() => {
    onAuthStateChanged(Authentication, (user) => {
      if (user) {
        if (localStorage.getItem("user")) {
          const data = JSON.parse(localStorage.getItem("user"))
          if (data.accountType === "admin") {
            setIsLoggedIn(true)
            setUserData(data)
            // navigate("/Admin", {replace: true})
          }
        }
      } else {
        signOut(Authentication).then(() => {
          setIsLoggedIn(false)
          setUserData({})
          navigate("/Admin/Login", { replace: true })
        })
      }
    })
  }, [isLoggedIn, navigate])

  return (
    <AuthContext.Provider value={userData}>
      {isLoggedIn ? props.children : null}
    </AuthContext.Provider>)
}
