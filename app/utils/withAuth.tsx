"use client";

import React, { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '@/utils/firebase/initializeApp'
import { useRouter } from 'next/navigation';

const withAuth = (WrappedComponent: React.ComponentType) => {
  return (props: any) => {
    const router = useRouter()
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null) // Track auth state

    useEffect(() => {
      const unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true) // User is signed in
        } else {
          setIsAuthenticated(false) // User is signed out
          router.replace('/login') // Redirect to login
        }
      })

      return () => unsubscribe() // Cleanup the listener on unmount
    }, [auth, router])

    if (isAuthenticated === null) {
      return <div>Loading...</div> // Render a loading message while checking auth state
    }

    return <WrappedComponent {...props} />
  }
}

export default withAuth
