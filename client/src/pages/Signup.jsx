import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

const Signup = () => {
  const [formdata, setFormData] = useState({});
  const [Errormsg, setErrormsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const getPasswordSuggestion = (password) => {
    if (!password) return "Password is required";
  
   
    if (/^\d+$/.test(password)) return "Password should contain letters and special characters.";
  
    // Check if the password contains only lowercase letters
    if (/^[a-z]+$/.test(password)) return "Password should contain uppercase letters and special characters.";
  
    // Check if the password contains only uppercase letters
    if (/^[A-Z]+$/.test(password)) return "Password should contain lowercase letters and special characters.";
  
    // Check if the password contains at least one lowercase and one uppercase letter, and one special character
    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      return "Password should contain both uppercase and lowercase letters, and at least one special character.";
    }
  
    // Check if the password length is less than 8 characters
    if (password.length < 8) return "Password should be at least 8 characters long.";
  
    return null; // Password meets all conditions
  };
  
  

  const handleChange = (e) => {
    setFormData({ ...formdata, [e.target.id]: e.target.value.trim() });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formdata.username || !formdata.email || !formdata.password) {
      return setErrormsg("Please fill out all fields.");
    }

    try {
      setLoading(true);
      setErrormsg(null);

      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formdata),
      });

      const data = await res.json();

      if (data.success === false) {
        setErrormsg(data.message);
      } else {
        navigate("/sign-in");
      }
    } catch (e) {
      setErrormsg(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen mt-20">
      <div className="flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-5">
        {/* left */}
        <div className="flex-1">
          <Link to="/" className="font-bold dark:text-white text-4xl">
            <span className="px-2 py-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg text-white">Dk's</span>Blog
          </Link>
          <p className="text-sm mt-5">
            This is a demo page ................... project not page............ auth with google
          </p>
        </div>
        {/* right */}
        <div className="flex-1">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <Label value="Username"/>
              <TextInput type="text" placeholder="Enter your username" id="username" onChange={handleChange}/>
            </div>
            <div>
              <Label value="Email"/>
              <TextInput type="email" placeholder="Enter your email" id="email" onChange={handleChange}/>
            </div>
            <div>
              <Label value="Password"/>
              <TextInput type="password" placeholder="Enter Your password" id="password" onChange={handleChange}/>
              {Errormsg && (
                <Alert className="mt-2" color="failure">
                  {Errormsg}
                </Alert>
              )}
              {formdata.password && getPasswordSuggestion(formdata.password) && (
                <div className="text-sm text-gray-500 mt-1">{getPasswordSuggestion(formdata.password)}</div>
              )}
            </div>
            <Button gradientDuoTone="purpleToPink" type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span className="pl-3">loading...</span>
                </>
              ) : (
                "Sign Up"
              )}
            </Button>
            <OAuth/>
          </form>
          <div className="flex gap-2 text-sm mt-5">
            <span>Have an account</span>
            <Link to="/signin" className="text-blue-500">Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
