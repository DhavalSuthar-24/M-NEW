import { Alert, Button, Label, Spinner, TextInput } from "flowbite-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OAuth from "../Components/OAuth";

const Signup = () => {
  const [formdata, setFormData] = useState({});
  const [Errormsg, setErrormsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

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
