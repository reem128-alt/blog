import React from 'react'
import {useLocation, Navigate} from 'react-router-dom'
import Loading from './loading'
import { languages } from '../i18n'
import { useQuery } from '@tanstack/react-query'

export default function ProtectRoute({children}:{children:React.ReactNode}) {
    const location=useLocation()
    const {data:session,isLoading}=useQuery({
        queryKey:["session"],
        queryFn:()=>{
            const saved=localStorage.getItem("user-session")
            if (!saved) return null;
            return JSON.parse(saved);
        }
    })

    if (isLoading){
        return <Loading />
    }
    if (!session && location.pathname !== "/signin" && location.pathname !== "/signup"){
        return <Navigate to={`/${languages[0]}/signin`} state={{from:location}} replace={true} />
    }
    
    return <>{children}</>
}
