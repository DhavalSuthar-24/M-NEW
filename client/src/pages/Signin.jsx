import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, Button, Label, Spinner, TextInput } from 'flowbite-react';
import { useSelector, useDispatch } from 'react-redux';
import { signInFailure, signInSuccess, signInStart } from '../redux/user/user.slice';
import OAuth from '../Components/OAuth'; 
const Signin = () => {
  const [formdata, setFormData] = useState({});
  const { loading, error: errorMsg } = useSelector(state => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = e => {
    setFormData({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async e => {
    e.preventDefault();

    if (!formdata.email || !formdata.password) {
      return dispatch(signInFailure('Please fill all the fields.'));
    }

    try {
      dispatch(signInStart());

      const res = await fetch('/api/auth/signin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (!res.ok) {
        dispatch(signInFailure(data.message));
      }

      if (res.ok) {
        dispatch(signInSuccess(data));
        navigate('/dashboard');
      }
    } catch (error) {
      dispatch(signInFailure(error.message));
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* Left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Dk's</span>Blog
          </Link>
          {/* <p className="text-sm mt-5">
            This is a demo page. This is not a project page. Auth with Google.
          </p> */}
        </div>
        {/* Right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Email" />
              <TextInput type="email" placeholder="Enter your email" id="email" onChange={handleChange} />
            </div>
            <div>
              <Label value="Password" />
              <TextInput type="password" placeholder="Enter your password" id="password" onChange={handleChange} />
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">Loading...</span>
                </>
              ) : (
                'Sign In'
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Don't have an account?</span>
            <Link to="/sign-up" className="text-blue-500">
              Sign Up
            </Link>
            {errorMsg && <Alert className="mt-5" color="failure">{errorMsg}</Alert>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signin;
