import { useEffect, useState } from "react";
import { IPost } from "../../UI/Post/Post";
import { getPostsPage } from "../../api/axios";

export const usePost = (pageNum = 1) => {
  const [result, setResult] = useState<IPost[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState("");
  const [hasNextPage, setHasNextPage] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    setIsError(false);
    setError("");

    const controller = new AbortController();
    const { signal } = controller;

    (async () => {
      try {
        const data = await getPostsPage(pageNum, { signal });
        setIsLoading(false);
        setResult((prev) => [...prev, ...data]);
        setHasNextPage(Boolean(data.length));
      } catch (error) {
        setIsLoading(false);

        if (signal.aborted) {
          console.log("aborted");
          return;
        }

        let message: string;
        if (error instanceof Error) message = error.message;
        else message = String(error);

        setIsError(true);
        setError(message);
      }
    })();

    return () => controller.abort();
  }, [pageNum]);

  return {
    result,
    isLoading,
    isError,
    error,
    hasNextPage,
  };
};

export default usePost;
