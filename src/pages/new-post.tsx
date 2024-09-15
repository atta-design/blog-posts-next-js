import { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  margin-bottom: 1rem;
  font-size: 1rem;
  outline: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: #0070f3;
  }
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  outline: none;
  resize: none;
  transition: border 0.2s ease;

  &:focus {
    border-color: #0070f3;
  }
`;

const Button = styled.button`
  padding: 0.75rem 1.5rem;
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

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
`;

const NewPostPage = () => {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [date, setDate] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set the current date in YYYY-MM-DD format
    const today = new Date().toISOString().split('T')[0];
    setDate(today);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    if (!title || !body || !date) {
      setError('All fields are required');
      return;
    }

    setError(null);

    const newPost = {
      title,
      body,
      date,
      id: Date.now().toString(), // Generate a unique ID for the post
    };

    try {
      // Replace with your actual API URL
      await axios.post('http://localhost:3001/posts', newPost);
      alert('Post added successfully!');
      // Optionally, redirect to another page or clear the form
      setTitle('');
      setBody('');
    } catch (error) {
      console.error('Error adding post:', error);
      alert('Error adding post. Please try again.');
    }
  };

  return (
    <Container>
      <Title>Create New Post</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          id="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <Label htmlFor="body">Content</Label>
        <Textarea
          id="body"
          rows={6}
          value={body}
          onChange={(e) => setBody(e.target.value)}
          required
        />

        <Label htmlFor="date">Date</Label>
        <Input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        {error && <ErrorMessage>{error}</ErrorMessage>}

        <Button type="submit">Add Post</Button>
      </Form>
    </Container>
  );
};

export default NewPostPage;
