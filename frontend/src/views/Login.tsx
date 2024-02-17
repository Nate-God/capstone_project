import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Form, Button } from 'react-bootstrap';
import AuthService from '../services/AuthService';

const Login: React.FC = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const { username, password } = formData;
      await AuthService.login(username, password);
      console.log('Login successful'); 
      window.location.href = '/';
    } catch (error) {
      console.error('Login failed:', error.message);
    }
  };

  return (
    <Container>
      <h2 className="mt-5 mb-4">Login</h2>
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control 
            type="text" 
            placeholder="Enter Username" 
            name="username" 
            value={formData.username} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Form.Group controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control 
            type="password" 
            placeholder="Password" 
            name="password" 
            value={formData.password} 
            onChange={handleChange} 
          />
        </Form.Group>

        <Button variant="primary" type="submit">
          Login
        </Button>

        <Form.Text className="mt-3">
          Don't have an account? <Link to="/register">Register here</Link>.
        </Form.Text>
      </Form>
    </Container>
  );
};

export default Login;