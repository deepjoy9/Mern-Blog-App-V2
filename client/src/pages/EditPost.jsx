import React, { useEffect, useState } from "react";
import { Navigate, useParams } from "react-router-dom";
import Editor from "../components/Editor";
import { POSTS_API } from "../utils/apiConstants";
import { toast } from "react-toastify";

const EditPost = () => {
  const { id } = useParams();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPostData = async () => {
      try {
        const response = await fetch(`${POSTS_API}/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch post. Please try again later.");
        }
        const postData = await response.json();
        setTitle(postData.title);
        setContent(postData.content);
        setSummary(postData.summary);
      } catch (error) {
        console.error("Error fetching post:", error.message);
        toast.error(
          error.message ||
            "An unexpected error occurred. Please try again later."
        );
      }
    };
    fetchPostData();
  }, []);

  const updatePost = async (event) => {
    event.preventDefault();
    try {
      setLoading(true);
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("id", id);
      if (files?.[0]) {
        data.set("file", files[0]);
      }
      const response = await fetch(POSTS_API, {
        method: "PUT",
        body: data,
        credentials: "include",
      });
      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Failed to update post. Please try again later."
        );
      }
      // Post updated successfully
      setRedirect(true);
      toast.success("Post updated successfully!");
    } catch (error) {
      console.error("Error updating post:", error.message);
      toast.error(
        error.message || "An unexpected error occurred. Please try again later."
      );
    } finally {
      setLoading(false);
    }
  };

  if (redirect) {
    return <Navigate to={"/"} />;
  }

  return (
    <form onSubmit={updatePost}>
      <input
        type="text"
        placeholder={"Title"}
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <input
        type="text"
        placeholder={"Summary"}
        value={summary}
        onChange={(ev) => setSummary(ev.target.value)}
      />
      <input
        type="file"
        accept="image/*"
        onChange={(ev) => setFiles(ev.target.files)}
      />
      <Editor onChange={setContent} value={content} />
      <button style={{ marginTop: "5px" }} disabled={loading}>
        {loading ? "Loading..." : "Update post"}
      </button>
    </form>
  );
};

export default EditPost;
