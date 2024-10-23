import { useMutation, useQueryClient, useInfiniteQuery } from "react-query";
import axiosInstance from "../api/axiosInstance";

const createPost = async (newPost: { title: string; body: string }) => {
  const response = await axiosInstance.post("/posts", newPost);
  return response.data;
};

const updatePost = async (updatedPost: {
  id?: number;
  title: string;
  body: string;
}) => {
  const response = await axiosInstance.put(
    `/posts/${updatedPost.id}`,
    updatedPost,
  );
  return response.data;
};

const deletePost = async (id: number) => {
  await axiosInstance.delete(`/posts/${id}`);
  return id;
};

export const usePostMutations = () => {
  const queryClient = useQueryClient();

  const createMutation = useMutation(createPost, {
    onSuccess: (newPost) => {
      queryClient.setQueryData<any>("posts", (oldData: any) => ({
        ...oldData,
        pages: [[newPost, ...oldData.pages[0]], ...oldData.pages.slice(1)],
      }));
    },
  });

  const updateMutation = useMutation(updatePost, {
    onSuccess: (updatedPost) => {
      queryClient.setQueryData<any>("posts", (oldData: any) => ({
        ...oldData,
        pages: oldData.pages.map((page: any) =>
          page.map((post: any) =>
            post.id === updatedPost.id ? updatedPost : post,
          ),
        ),
      }));
    },
  });

  const deleteMutation = useMutation(deletePost, {
    onSuccess: (deletedPostId) => {
      queryClient.setQueryData("posts", (oldData: any) => {
        if (!oldData) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) =>
            page.filter((post: any) => post.id !== deletedPostId),
          ),
        };
      });
    },
  });
  return { createMutation, updateMutation, deleteMutation };
};
