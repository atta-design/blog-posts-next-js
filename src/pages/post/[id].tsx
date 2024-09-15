import { GetServerSideProps } from 'next';
import { useState } from 'react';
import styled from 'styled-components';
import axios from 'axios';
import { Post, Comment } from '../../types';
import Link from 'next/link';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
  background-color: #f4f4f4;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
`;

const Nav = styled.nav`
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const NavLink = styled(Link)`
  text-decoration: none;
  font-weight: bold;
  color: #0070f3;
  &:hover {
    text-decoration: underline;
  }
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
  text-align: center;
`;

const Body = styled.p`
  color: #333;
  line-height: 1.6;
  margin-bottom: 2rem;
  text-align: justify;
`;

const CommentsTitle = styled.h2`
  font-size: 2rem;
  font-weight: bold;
  margin-top: 2rem;
`;

const CommentList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const CommentItem = styled.li`
  background-color: #fff;
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #ddd;
`;

const CommentAuthor = styled.p`
  font-weight: bold;
  margin-bottom: 0.5rem;
`;

const CommentContent = styled.p`
  color: #555;
`;

const Form = styled.form`
  margin-top: 2rem;
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  font-weight: bold;
  margin-bottom: 0.5rem;
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
  margin-top: 1rem;
  &:hover {
    background-color: #005bb5;
  }
`;

const ErrorMessage = styled.div`
  color: red;
  margin-bottom: 1rem;
  text-align: center;
`;

const Message = styled.div`
  color: green;
  margin-bottom: 1rem;
  text-align: center;
`;

const LogoutButton = styled(Button)`
  background-color: #ff4d4d;
  &:hover {
    background-color: #d9534f;
  }
`;

interface PostPageProps {
  post: Post;
}

const PostPage = ({ post }: PostPageProps) => {
  const [comments, setComments] = useState<Comment[]>(post.comments);
  const [commentContent, setCommentContent] = useState<string>('');
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const signOutHandler = () => {
    localStorage.removeItem('token');
    setMessage('Signed out successfully!');
  };

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to log in to post a comment.');
      return;
    }

    if (commentContent.trim() === '') {
      setError('Comment is required');
      return;
    }

    const newComment: Comment = {
      id: Date.now().toString(),
      content: commentContent,
      author: 'Anonymous',
      postId: post.id,
    };

    try {
      const response = await axios.post('http://localhost:3001/comments', newComment);
      if (response.status === 201) {
        setComments([...comments, newComment]);
        setMessage('Comment added successfully!');
        setCommentContent('');
        setError(null);
      } else {
        setError('Failed to add comment.');
      }
    } catch (error) {
      setError('Error adding comment.');
    }
  };

  const deleteComment = async (commentId: string) => {
    try {
      const response = await axios.delete(`http://localhost:3001/comments/${commentId}`);
      if (response.status === 200) {
        setComments(comments.filter(comment => comment.id !== commentId));
        setMessage('Comment deleted successfully!');
      } else {
        setError('Failed to delete comment.');
      }
    } catch (error) {
      setError('Error deleting comment.');
    }
  };

  const deletePostHandler = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('You need to log in to delete a post.');
      return;
    }

    try {
      // Delete all comments associated with the post
      await Promise.all(comments.map(comment => axios.delete(`http://localhost:3001/comments/${comment.id}`)));

      // Then delete the post
      const response = await axios.delete(`http://localhost:3001/posts/${post.id}`);
      if (response.status === 200) {
        setMessage('Post and associated comments deleted successfully.');
        // Redirect to another page or update UI accordingly
        window.location.href = '/'; // Redirect to home or any other page
      } else {
        setError('Failed to delete post.');
      }
    } catch (error) {
      setError('Error deleting post.');
    }
  };

  return (
    <Container>
      <Nav>
        <NavLink href="/sign_up">Sign Up</NavLink>
        <NavLink href="/login">Login</NavLink>
      </Nav>

      <Title>{post.title}</Title>
      <Body>{post.body}</Body>

      <CommentsTitle>Comments</CommentsTitle>
      <CommentList>
        {comments.map((comment) => (
          <CommentItem key={comment.id}>
            <CommentAuthor>{comment.author}</CommentAuthor>
            <CommentContent>{comment.content}</CommentContent>
            <Button onClick={() => deleteComment(comment.id)}>Delete Comment</Button>
          </CommentItem>
        ))}
      </CommentList>

      <Form onSubmit={handleCommentSubmit}>
        <Label htmlFor="content">Add a Comment</Label>
        <Textarea
          value={commentContent}
          onChange={(e) => setCommentContent(e.target.value)}
          rows={4}
        />
        {error && <ErrorMessage>{error}</ErrorMessage>}
        {message && <Message>{message}</Message>}
        <Button type="submit">Add Comment</Button>
      </Form>

      <LogoutButton onClick={signOutHandler}>Sign Out</LogoutButton>
      <Button onClick={deletePostHandler}>Delete Post</Button>
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { id } = context.params!;

  if (!id || Array.isArray(id)) {
    return {
      notFound: true,
    };
  }

  try {
    const postResponse = await axios.get(`http://localhost:3001/posts/${id}`);
    const post = postResponse.data;

    const commentsResponse = await axios.get(`http://localhost:3001/comments?postId=${id}`);
    const comments = commentsResponse.data;

    post.comments = comments;

    return {
      props: {
        post,
      },
    };
  } catch (error) {
    console.error('Error fetching post or comments:', error);
    return {
      notFound: true,
    };
  }
};

export default PostPage;