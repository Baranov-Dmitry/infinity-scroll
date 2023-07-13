import axios from "axios";
import { IPost } from "../UI/Post/Post";

export const api = axios.create({
  // https://jsonplaceholder.typicode.com/posts?_page=3&_limit=10
  baseURL: "https://jsonplaceholder.typicode.com",
});

export const getPostsPage = async (pageNumber = 1, config = {}) => {
  const response = await api.get<IPost[]>(
    `/posts?_page=${pageNumber}&_limit=10`,
    config
  );
  return response.data;
};
