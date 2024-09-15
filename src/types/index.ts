export interface Comment {
  id: string; // Ensure the 'id' type is a string here
  content: string;
  author: string;
  postId: number;
  }
  
  export interface Post {
    id: number;
    title: string;
    body: string;
    comments: Comment[];
    date: string; 
  }
  