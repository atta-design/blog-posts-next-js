import { GetStaticProps } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import axios from 'axios';
import { Post } from '../types';

// Styled Components
const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  font-weight: bold;
  text-align: center;
  margin-bottom: 2rem;
`;

const PostList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const PostItem = styled.li`
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
  margin-bottom: 1.5rem;
  transition: transform 0.2s ease;
  position: relative;

  &:hover {
    transform: translateY(-5px);
  }
`;

const PostLink = styled.a`
  font-size: 1.2rem;
  font-weight: bold;
  color: #0070f3;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
`;

const PostExcerpt = styled.p`
  color: #555;
  margin: 1rem 0;
`;

const ViewDetailsLink = styled.a`
  display: inline-block;
  background-color: #0070f3;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  font-weight: bold;
  text-decoration: none;

  &:hover {
    background-color: #005bb5;
  }
`;



const UpdateButton = styled.button`
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  padding: 0.5rem 1rem;
  background-color: orange;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background-color: darkorange;
  }
`;

const AddButton = styled.button`
  display: block;
  margin: 2rem auto;
  padding: 0.75rem 1.5rem;
  background-color: green;
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: darkgreen;
  }
`;

type HomeProps = {
  posts: Post[];
};

const DateText = styled.p`
  color: #777;
  font-size: 0.9rem;
  margin: 0;
`;

const Home = ({ posts }: HomeProps) => {

  return (
    <Container>
      <Title>Blog Posts</Title>

      <PostList>
        {posts.map((post) => (
          <PostItem key={post.id}>
            {/* Post Title */}
            <PostLink href={`/post/${post.id}`}>{post.title}</PostLink>

            {/* Post Date */}
            <DateText>{new Date(post.date).toLocaleDateString()}</DateText>

            {/* Post Summary */}
            <PostExcerpt>{post.body.substring(0, 100)}...</PostExcerpt>

            {/* Link to Full Post */}
            <ViewDetailsLink href={`/post/${post.id}`}>View Details</ViewDetailsLink>

            {/* Update Post Button */}
            <Link href={`/edit-post/${post.id}`}>
              <UpdateButton>Update Post</UpdateButton>
            </Link>
          </PostItem>
        ))}
      </PostList>

      {/* Add Post Button */}
      <Link href="/new-post">
        <AddButton>Add New Post</AddButton>
      </Link>
    </Container>
  );
};

// Fetch posts during build time
export const getStaticProps: GetStaticProps = async () => {
  try {
    const response = await axios.get('http://localhost:3001/posts');
    const posts: Post[] = response.data;

    return {
      props: {
        posts,
      },
      revalidate: 10,  // Regenerate every 10 seconds
    };
  } catch (error) {
    console.error('Error fetching posts:', error);
    return {
      props: {
        posts: [],
      },
    };
  }
};

export default Home;