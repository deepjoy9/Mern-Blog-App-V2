import { useEffect, useMemo, useState } from "react";
import Post from "../components/Post";
import { POSTS_API } from "../utils/apiConstants";
import ShimmerList from "../components/ShimmerUI";

const IndexPage = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(POSTS_API);
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const posts = await response.json();
        setPosts(posts);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const memoizedPosts = useMemo(() => posts, [posts]);

  return (
    <>
      {loading ? (
        <ShimmerList />
      ) : error ? (
        <div>Error: {error}</div>
      ) : (
        memoizedPosts.length > 0 &&
        memoizedPosts.map((post) => <Post key={post._id} {...post} />)
      )}
    </>
  );
};

export default IndexPage;
