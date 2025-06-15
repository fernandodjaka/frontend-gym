import {
  Card,
  Input,
  Checkbox,
  Button,
  Typography,
} from "@material-tailwind/react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

export function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('http://localhost:8000/api/register', formData, {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        }
      });

      if (response.status === 201 || response.data.access_token) {
        // Jika token disediakan, simpan ke localStorage
        if (response.data.access_token) {
          localStorage.setItem('access_token', response.data.access_token);
        }

        // Arahkan ke halaman isi data diri
        navigate('/auth/isi-data-diri');
      } else {
        setError('Registrasi gagal. Silakan coba lagi.');
      }
    } catch (err) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err.response?.data?.errors) {
        const firstError = Object.values(err.response.data.errors)[0][0];
        setError(firstError);
      } else {
        setError(err.message || 'Gagal melakukan pendaftaran.');
      }
    }
  };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Sign Up</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Enter your email and password to Sign Up.
          </Typography>
        </div>

        {error && (
          <Typography className="text-red-600 text-center mt-4 text-sm">
            {error}
          </Typography>
        )}

        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <div>
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Your Email
              </Typography>
              <Input
                size="lg"
                placeholder="name@mail.com"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                required
              />
            </div>

            <div>
              <Typography variant="small" color="blue-gray" className="-mb-3 font-medium">
                Password
              </Typography>
              <Input
                type="password"
                size="lg"
                placeholder="********"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className=" !border-t-blue-gray-200 focus:!border-t-gray-900"
                labelProps={{ className: "before:content-none after:content-none" }}
                required
                minLength={6}
              />
            </div>
          </div>

          <Checkbox
            required
            label={
              <Typography variant="small" color="gray" className="flex items-center justify-start font-medium">
                I agree to the&nbsp;
                <a href="#" className="font-normal text-black transition-colors hover:text-gray-900 underline">
                  Terms and Conditions
                </a>
              </Typography>
            }
            containerProps={{ className: "-ml-2.5" }}
          />

          <Button type="submit" className="mt-6" fullWidth>
            Sign Up
          </Button>

          {/* Jika tidak ada fitur forgot password, bisa hapus bagian ini */}
          {/* <div className="flex items-center justify-between gap-2 mt-6">
            <Typography variant="small" className="font-medium text-gray-900">
              <a href="#">Forgot Password</a>
            </Typography>
          </div> */}

          <Typography variant="paragraph" className="text-center text-blue-gray-500 font-medium mt-4">
            Already have an account?
            <Link to="/auth/sign-in" className="text-gray-900 ml-1">Login</Link>
          </Typography>
        </form>
      </div>

      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/img/pattern.png"
          className="h-full w-full object-cover rounded-3xl"
          alt="Sign up visual"
        />
      </div>
    </section>
  );
}

export default Register;
