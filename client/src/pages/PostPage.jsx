import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { formatISO9075 } from "date-fns";
import { Link } from "react-router-dom";
import { UserContext } from "../contexts/UserContext";
import { POSTS_API } from "../utils/apiConstants";
import Icons from "../components/Icons";

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
      <h1>{postInfo?.title ?? "Unknown"}</h1>
      <time>{formatISO9075(new Date(postInfo?.createdAt ?? "Unknown"))}</time>
      <div className="author">by @{postInfo.author?.username ?? "Unknown"}</div>
      {userInfo?.id === postInfo?.author?._id && (
        <div className="edit-delete-container">
          <div className="edit-delete-row">
            <Link className="edit-btn" to={`/edit/${postInfo._id}`}>
              <Icons.EditIcon />
              Edit this post
            </Link>
            <button
              className="delete-btn"
              onClick={() => setDeleteConfirmation(true)}
            >
              <Icons.DeleteIcon />
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
        <img src={postInfo?.cover} alt={postInfo.title} />
      </div>

      <div
        className="content"
        dangerouslySetInnerHTML={{
          __html: postInfo?.content ?? "Not available",
        }}
      />
    </div>
  );
};

export default PostPage;
