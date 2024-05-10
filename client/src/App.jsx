import "./App.css";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import { UserContextProvider } from "./contexts/UserContext";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import { Suspense, lazy } from "react";

// Lazy loaded components
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const CreatePost = lazy(() => import("./pages/CreatePost"));
const PostPage = lazy(() => import("./pages/PostPage"));
const EditPost = lazy(() => import("./pages/EditPost"));
const MyPostsPage = lazy(() => import("./pages/MyPostsPage"));

function App() {
  return (
    <UserContextProvider>
      <Suspense>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<ProtectedRoute Component={CreatePost}/>} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<ProtectedRoute Component={EditPost }/>} />
          <Route path="/myposts" element={<ProtectedRoute Component={MyPostsPage }/>} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
      </Suspense>
    </UserContextProvider>
  );
}

export default App;
