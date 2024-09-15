import { useState } from 'react';
import { useRouter } from 'next/router';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';

interface SignupValues {
  username: string;
  password: string;
}

const Container = styled.div`
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Title = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled(Field)`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s ease;

  &:focus {
    border-color: #0070f3;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 0.75rem;
  background-color: #0070f3;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessageStyled = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const SuccessMessage = styled.div`
  color: green;
  margin-bottom: 1rem;
  text-align: center;
`;

const SignupPage = () => {
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const validationSchema = Yup.object({
    username: Yup.string().required('Username is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSignup = (values: SignupValues) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.find((user: SignupValues) => user.username === values.username)) {
      setError('User already exists');
      return;
    }

    users.push(values);
    localStorage.setItem('users', JSON.stringify(users));
    setMessage('Signup successful! You can now log in.');
    setError(null);
    setTimeout(() => router.push('/login'), 1000); // Redirect to login after success
  };

  return (
    <Container>
      <Title>Sign Up</Title>
      <Formik
        initialValues={{ username: '', password: '' }}
        validationSchema={validationSchema}
        onSubmit={handleSignup}
      >
        {({ isSubmitting }) => (
          <Form>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input type="text" name="username" />
              <ErrorMessage name="username" component={ErrorMessageStyled} />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input type="password" name="password" />
              <ErrorMessage name="password" component={ErrorMessageStyled} />
            </div>

            {error && <ErrorMessageStyled>{error}</ErrorMessageStyled>}
            {message && <SuccessMessage>{message}</SuccessMessage>}

            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Signing Up...' : 'Sign Up'}
            </Button>
          </Form>
        )}
      </Formik>
    </Container>
  );
};

export default SignupPage;
