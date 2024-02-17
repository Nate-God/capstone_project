// RegisterPage.tsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import axios from 'axios';
import AuthService from '../services/AuthService';

const Register: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    console.log(e.target.value)
  };

  const checkUsernameExists = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/check-username/${formData.username}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking username:', error);
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      return; 
    }

    
    let usernameExists = await checkUsernameExists();
    console.log (usernameExists)

    if (usernameExists) {
      
      console.error('Username already exists.');
      return;
    }

    try {
      
      const { username, email, password} = formData;
      const user = await AuthService.register(username, email, password);
      console.log(user)

     
      console.log('Registration successful:', user);
      window.location.href = '/';

      
    } catch (error) {
      console.error('Registration failed:', error.message);
    }
  };

  return (
    <Container>
      <h2 className="mt-5 mb-4">Register</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicFirstName">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter your usernmane" name="username" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formBasicEmail">
          <Form.Label>Email address</Form.Label>
          <Form.Control type="email" placeholder="Enter email" name="email" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" name="password" onChange={handleChange} />
        </Form.Group>

        <Form.Group controlId="formBasicPasswordConfirm">
          <Form.Label>Confirm Password</Form.Label>
          <Form.Control type="password" placeholder="Confirm password" name="confirmPassword" onChange={handleChange} />
        </Form.Group>

        <Button variant="primary" type="submit">
          Register
        </Button>

        <Form.Text className="mt-3">
          Already have an account? <Link to="/login">Login here</Link>.
        </Form.Text>
      </Form>
    </Container>
  );
};

export default Register;