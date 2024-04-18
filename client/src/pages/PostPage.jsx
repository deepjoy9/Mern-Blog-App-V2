import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { POSTS_API } from "../utils/apiConstants";

const PostPage = () => {
  const [postInfo, setPostInfo] = useState(null);
  const { userInfo } = useContext(UserContext);
  const [deleteConfirmation, setDeleteConfirmation] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${POSTS_API}/${id}`);
        if (!response.ok) {
          navigate("/error");
          return;
        }
        const data = await response.json();
        setPostInfo(data);
      } catch (error) {
        console.error("Error fetching post data:", error);
      }
    };
    fetchPostData();
  }, [id]);

  const handleDelete = async () => {
    try {
      const response = await fetch(`${POSTS_API}/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      if (response.ok) {
        navigate("/");
      } else {
        console.error("Failed to delete post");
      }
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  if (!postInfo) return null;

  return (
    <div className="post-page">
      <h1>{postInfo.title}</h1>
      <time>{formatISO9075(new Date(postInfo.createdAt))}</time>
      <div className="author">
        by @{postInfo.author ? postInfo.author.username : "Unknown"}
      </div>
      {userInfo && postInfo.author && userInfo.id === postInfo.author._id && (
        <div className="edit-delete-container">
          <div className="edit-delete-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Edit this post
            </Link>
            <button
              className="delete-btn"
              onClick={() => setDeleteConfirmation(true)}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
              Delete this post
            </button>
          </div>
          {deleteConfirmation && (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete this post?</p>
              <button className="delete-btn" onClick={handleDelete}>
                Yes, delete
              </button>
              <button
                className="delete-btn"
                onClick={() => setDeleteConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          )}
        </div>
      )}
      <div className="image">
        <img src={postInfo.cover} alt="" />
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{ __html: postInfo.content }}
      />
    </div>
  );
};

export default PostPage;
