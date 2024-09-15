import { GetServerSideProps } from 'next';
import { useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import styled from 'styled-components';
import { Post } from '../../types';

// Styled Components
const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
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
`;

const Textarea = styled.textarea`
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  margin-bottom: 1rem;
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

type EditPostPageProps = {
  post: Post;
};

const EditPostPage = ({ post }: EditPostPageProps) => {
  const router = useRouter();
  const [updatedPost, setUpdatedPost] = useState({ title: post.title, body: post.body });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setUpdatedPost((prevPost) => ({ ...prevPost, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Send PUT request to update the post
      await axios.put(`http://localhost:3001/posts/${post.id}`, updatedPost);

      // Navigate back to the home page after updating
      router.push('/');
    } catch (error) {
      console.error('Error updating post:', error);
    }
  };

  return (
    <Container>
      <Title>Edit Post</Title>
      <Form onSubmit={handleSubmit}>
        <Label htmlFor="title">Title</Label>
        <Input
          type="text"
          name="title"
          value={updatedPost.title}
          onChange={handleInputChange}
          required
        />

        <Label htmlFor="body">Body</Label>
        <Textarea
          name="body"
          rows={5}
          value={updatedPost.body}
          onChange={handleInputChange}
          required
        />

        <Button type="submit">Update Post</Button>
      </Form>
    </Container>
  );
};

// Fetch the post data by ID
export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  try {
    const response = await axios.get(`http://localhost:3001/posts/${id}`);
    const post: Post = response.data;

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error('Error fetching post:', error);
    return {
      notFound: true,
    };
  }
};

export default EditPostPage;
