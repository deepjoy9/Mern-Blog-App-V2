import React, { useState } from "react";
import "react-quill/dist/quill.snow.css";
import { Navigate } from "react-router-dom";
import Editor from "../components/Editor";
import { POSTS_API } from "../utils/apiConstants";
import { toast } from "react-toastify";

const CreatePost = () => {
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState("");
  const [redirect, setRedirect] = useState(false);
  const [loading, setLoading] = useState(false);

  const createNewPost = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.set("title", title);
      data.set("summary", summary);
      data.set("content", content);
      data.set("file", files[0]);

      const response = await fetch(POSTS_API, {
        method: "POST",
        body: data,
        credentials: "include",
      });

      if (!response.ok) {
        const errorMessage = await response.json();
        throw new Error(
          errorMessage.error || "Failed to create post. Please try again later."
        );
      }

      // Post created successfully
      setRedirect(true);
      toast.success("Post created successfully!");
    } catch (error) {
      console.error("Error creating post:", error.message);
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
    <form onSubmit={createNewPost}>
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
      <Editor value={content} onChange={setContent} />
      <button style={{ marginTop: "5px" }} disabled={loading}>
        {loading ? "Loading..." : "Create Post"}
      </button>
    </form>
  );
};

export default CreatePost;
