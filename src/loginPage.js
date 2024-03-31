import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import ListenHome from './listenHome'; // New Import

const Login = (props) => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()

  const onButtonClick = () => {
    // Set initial error values to empty
    setEmailError('')
    setPasswordError('')

    // Check if the user has entered both fields correctly
    if ('' === email) {
      setEmailError('Please enter your email')
      return
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError('Please enter a valid email')
      return
    }

    if ('' === password) {
      setPasswordError('Please enter a password')
      return
    }

    if (password.length < 7) {
      setPasswordError('The password must be 8 characters or longer')
      return
    }


    // Authentication calls will be made here...
    checkAccountExists((accountExists) => {
      // If yes, log in
      if (accountExists) logIn()
      // Else, ask user if they want to create a new account and if yes, then log in
      else if (
        window.confirm(
          'An account does not exist with this email address: ' + email + '. Do you want to create a new account?',
        )
      ) {
        logIn()
      }
    })



  }

  const checkAccountExists = (callback) => {
    fetch('http://localhost:3000/check-account', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    })
      .then((r) => r.json())
      .then((r) => {
        callback(r?.userExists)
      })
  }

  const logIn = () => {
    fetch('http://localhost:3000/auth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }), // Only send email and password
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data) => {
        // Check if the response contains a token
        if (data && data.token) {
          const { email, user_id, user_type, username } = data.token;
          localStorage.setItem('user', JSON.stringify({ email, user_id, user_type, username }));
          props.setLoggedIn(true);
          props.setEmail(email);
          navigate('/listenHome', { state: { email, user_id, user_type, username } });
        } else {
          window.alert('Wrong email or password ☹️');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        window.alert('An error occurred while logging in. Please try again.');
      });
  }






  return (
    <div className={'mainContainer'}>
      <div className={'titleContainer'}>
        <div>Login</div>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={email}
          placeholder="Enter your email here"
          onChange={(ev) => setEmail(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{emailError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input
          value={password}
          placeholder="Enter your password here"
          onChange={(ev) => setPassword(ev.target.value)}
          className={'inputBox'}
        />
        <label className="errorLabel">{passwordError}</label>
      </div>
      <br />
      <div className={'inputContainer'}>
        <input className={'inputButton'} type="button" onClick={onButtonClick} value={'Log in'} />
      </div>
    </div>
  )
}

export default Login