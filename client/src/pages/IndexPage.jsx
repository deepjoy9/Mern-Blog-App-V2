import React, { useEffect, useState } from "react";
import Post from "../components/Post";
import { POSTS_API } from "../utils/apiConstants";
import ShimmerList from "../components/ShimmerUI";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const response = fetch(POSTS_API).then((response) => {
      response.json().then((posts) => {
        setPosts(posts);
        setLoading(false);
      });
    });
  }, []);

  return (
    <>
      {loading ? (
        <ShimmerList /> // Render shimmer UI if loading, else render posts
      ) : (
        posts.length > 0 &&
        posts.map((post) => <Post key={post._id} {...post} />)
      )}
    </>
  );
};

export default IndexPage;
