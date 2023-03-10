import React from 'react'
import {useState} from 'react';
import {useCookies} from 'react-cookie';

export default function Auth() {
  // set up cookies with useCookies hook
  const [cookies, setCookie, removeCookie] = useCookies(null);

  // change state of log in
  const [isLogIn, setIsLogIn] = useState(true);

  //set up email and password data
  const [authInfo, setAuthInfo] = useState({
    email: "",
    username: "",
    password: "",
    confirmedPassword: ""
  });

  const [error, setError] = useState(null);

  console.log(cookies);

  //function to toggle between login and sign up screens
  const viewLogIn = (status) => {
    setError(null);
    setIsLogIn(status);
  };

  //when submit
  //- if on sign up page and passwords dont match do nothing
  //- post the email and password to endpoint
  const postData = async (e, endpoint) => {
    e.preventDefault();

    if (!isLogIn && authInfo.password !== authInfo.confirmedPassword) {
      setError('Passwords do not match.');
      return;
    }

    const response =
        await fetch(`${process.env.REACT_APP_SERVER}/${endpoint}`, {
          method: 'POST',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify(authInfo)
    });

    // otherwise, set cookies to capture the email username and authentication token
      const data = await response.json();
      if (data.detail) {
        setError(data.detail);

      } else {
        setCookie('Email', data.email);
        setCookie('AuthToken', data.token);
        setCookie('Username', data.username);

      // refresh page
      window.location.reload();
    }
  };

  const handleChange = (e) => {
    const {name, value} = e.target;


    const newAuthInfo = {...authInfo};
    newAuthInfo[name] = value;
    setAuthInfo(newAuthInfo);
  }


return (
  <div className='auth-container'>

    <div className = "logo">
      
      <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24"><path d="M19.029 13h2.971l-.266 1h-2.992l.287-1zm.863-3h2.812l.296-1h-2.821l-.287 1zm-.576 2h4.387l.297-1h-4.396l-.288 1zm2.684-9l-.743 2h-1.929l-3.474 12h-11.239l-4.615-11h14.812l-.564 2h-11.24l2.938 7h8.428l3.432-12h4.194zm-14.5 15c-.828 0-1.5.672-1.5 1.5 0 .829.672 1.5 1.5 1.5s1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5zm5.9-7-.9 7c-.828 0-1.5.671-1.5 1.5s.672 1.5 1.5 1.5 1.5-.671 1.5-1.5c0-.828-.672-1.5-1.5-1.5z"/></svg>

      <span>KoolGrocery</span>

    </div>

    <div className='auth-container-box'>
      {/* login and sign up form */}
      <form className="auth-form">
        {/* login header */}
        <h2>{isLogIn ? 'Please Log In' : 'Please Sign Up'}</h2>

        {/* input for email */}
        <input required className = "email-input" id="email-input" name="email" type="email" placeholder="email" onChange={handleChange}></input>

        {/* IF ON SIGN-UP PAGE input for username */}
        {!isLogIn && <input required maxLength={50} className = "username-input" id="username-input" name="username" type="text" placeholder="username" onChange={handleChange}></input>}

        {/* input for password */}
        <input required className="password-input" id="password-input" name="password" type='password' placeholder='password' onChange={handleChange}></input>

        {/* IF ON SIGN-UP PAGE input for confirm password */}
        {!isLogIn && <input required className = "confirmed-password-input" id="confirmed-password-input" name="confirmedPassword" type="password" placeholder="confirm password" onChange={handleChange}></input>}

        {/* submit button */}
        <input type = 'submit' className ='auth-submit' onClick = {(e) => postData(e, isLogIn ? 'login' : 'signup')}></input>

        {/* if there is an error display it */}
        {error && <p>{error}</p>}
      </form>


      {/* Choose between login and sign up screen */}
      <div className="auth-options">
        {/* button to show sign up page */}
        <button className="viewsignup-button" onClick={() => viewLogIn(false)}>Sign Up</button>

        {/* button to show login page */}
        <button className="viewlogin-button" onClick={() => viewLogIn(true)}>Login</button>
      </div>


    </div>
  </div>);
}
