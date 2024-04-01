import React, { useContext, useEffect, useState } from "react";
import Post from "../components/Post";
import { POSTS_API } from "../utils/apiConstants";
import { UserContext } from "../contexts/UserContext";

const MyPostsPage = () => {
  const { userInfo } = useContext(UserContext);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    if (userInfo && userInfo.id) {
      fetchPosts(userInfo.id);
    }
  }, [userInfo]);

  const fetchPosts = async (userId) => {
    try {
      const response = await fetch(`${POSTS_API}/myposts/${userId}`);
      if (response.ok) {
        const posts = await response.json();
        setPosts(posts);
      } else {
        console.error("Failed to fetch posts:", response.statusText);
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  return (
    <>
      {posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)}
    </>
  );
};

export default MyPostsPage;
