import "./App.css";
import Layout from "./components/Layout";
import { Route, Routes } from "react-router-dom";
import IndexPage from "./pages/IndexPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import { UserContextProvider } from "./contexts/UserContext";
import CreatePost from "./pages/CreatePost";
import PostPage from "./pages/PostPage";
import EditPost from "./pages/EditPost";
import ErrorPage from "./pages/ErrorPage";
import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/create" element={<ProtectedRoute Component={CreatePost}/>} />
          <Route path="/post/:id" element={<PostPage />} />
          <Route path="/edit/:id" element={<ProtectedRoute Component={EditPost }/>} />
          <Route path="/error" element={<ErrorPage />} />
          <Route path="*" element={<ErrorPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
