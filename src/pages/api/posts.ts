import { NextApiRequest, NextApiResponse } from 'next';
import { Post } from '../../types';

const posts: Post[] = [
  {
    id: 1,
    title: 'First Blog Post',
    body: 'This is the body of the first blog post.',
    comments: [
      { id: 1, postId: 1, author: 'John', content: 'Great post!' },
    ],
  },
  {
    id: 2,
    title: 'Second Blog Post',
    body: 'This is the body of the second blog post.',
    comments: [
      { id: 2, postId: 2, author: 'Jane', content: 'Very informative!' },
    ],
  },
];

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.status(200).json(posts);
}
