import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'

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
  //
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
      body: JSON.stringify({ email, password }),
    })
      .then((r) => r.json())
      .then((r) => {
        if (r) {
          const { user_id, user_type, username, alphaNumID, token } = r.token;
          localStorage.setItem('user', JSON.stringify({ email, user_id, user_type, username, token }));
          props.setLoggedIn(true);
          props.setEmail(email);
          if (user_type == "listener") {
            navigate('/listenHome', {
              state: {
                email: email,
                user_id: user_id,
                user_type: user_type,
                username: username,
                alphaNumID: alphaNumID,
              }
            }); // Pass user data to the ListenHome component
          } else if (user_type == "artist") {
            navigate('/artistHome', {
              state: {
                email: email,
                user_id: user_id,
                user_type: user_type,
                username: username,
                alphaNumID: alphaNumID,
              }
            });
          }
          else {
            navigate('/adminHome', {
              state: {
                email: email,
                user_id: user_id,
                user_type: user_type,
                username: username,
                alphaNumID: alphaNumID,
              }
            });

          }
        } else {
          window.alert('Wrong email or password ☹️');
        }
      })
      .catch((error) => {
        console.error('Error logging in:', error);
        window.alert('An error occurred while logging in. Please try again.');
      });
  };



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