import React from 'react'
import {GoogleLogin} from 'react-google-login'


export default function Login() {
  const clientId="70226555386-ial2ofdeca9qh4qehc5ilmkq2hkvmr5j.apps.googleusercontent.com";

  return (
    <div>
        <GoogleLogin
            clientId={clientId}
            buttonText='login'
            cookiePolicy='single_host_origin'
            onSuccess={result => console.log('login success', result)}
            onFailure={error=> console.log('login failure', error)}
            isSignedIn={false}
        />
    </div>
  )
}
