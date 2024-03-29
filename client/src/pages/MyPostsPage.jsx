import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { POSTS_API } from "../utils/apiConstants";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  useEffect(() => {
    const response = fetch("http://localhost:4000/api/posts/myposts").then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
      });
    });
  }, []);
  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
};

export default IndexPage;
