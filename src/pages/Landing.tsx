import { useEffect, useMemo, useRef, useState } from "react";
import { PostCard } from "../components/Posts";
import PostCreationDialog from "../components/PostCreation";
import axiosInstance from "../api/axiosInstance";
import { useInfiniteQuery } from "react-query";
import { usePostMutations } from "./landing.mutations";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";

const POSTS_PER_PAGE = 10;

export const Landing = () => {
  const { createMutation, updateMutation, deleteMutation } = usePostMutations();
  const [searchWord, setSearchWord] = useState("");
  const observer = useRef<IntersectionObserver | null>(null);
  const lastPostElementRef = useRef<HTMLDivElement | null>(null);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    refetch,
  } = useInfiniteQuery(
    "posts",
    async ({ pageParam = 0 }) => {
      const response = await axiosInstance.get("/posts", {
        params: {
          _limit: POSTS_PER_PAGE,
          _start: pageParam,
        },
      });
      return response.data;
    },
    {
      getNextPageParam: (lastPage, allPages) => {
        if (lastPage.length < POSTS_PER_PAGE) {
          return undefined;
        }
        const totalFetchedPosts = allPages.flat().length;
        return totalFetchedPosts;
      },
    },
  );

  const addPost = async (newPost: { title: string; body: string }) => {
    await createMutation.mutateAsync(newPost);
  };

  const onEditPost = async (editPost: {
    title: string;
    body: string;
    id?: number;
  }) => {
    await updateMutation.mutateAsync(editPost);
  };
  const onDelete = async (id: number) => {
    await deleteMutation.mutateAsync(id);
  };

  useEffect(() => {
    if (isFetchingNextPage) return;
    if (lastPostElementRef.current) {
      const observerCallback: IntersectionObserverCallback = (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage) {
          fetchNextPage();
        }
      };

      observer.current = new IntersectionObserver(observerCallback, {
        root: null,
        threshold: 1.0,
      });
      observer.current.observe(lastPostElementRef.current);
    }

    return () => {
      if (observer.current && lastPostElementRef.current) {
        observer.current.unobserve(lastPostElementRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);
  const flatData = useMemo(() => {
    console.log(
      data?.pages.flatMap((item) => item),
      "flating",
    );
    return data ? data?.pages.flatMap((item) => item) : [];
  }, [data]);
  const filteredPosts = useMemo(() => {
    if (!searchWord) return flatData;
    return flatData.filter((post) =>
      post.title.toLowerCase().includes(searchWord.toLowerCase()),
    );
  }, [flatData, searchWord]);

  useEffect(() => {
    if (searchWord) {
      refetch();
    }
  }, [searchWord, refetch]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      refetch();
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error fetching posts.</div>;

  return (
    <div className="p-6 flex flex-col justify-center items-center">
      <div className="flex justify-center mb-4 md:w-[60%] sm:w-[100%] gap-2">
        <PostCreationDialog onSubmit={addPost} />
        <div className="relative w-full">
          <input
            type="text"
            value={searchWord}
            onChange={(e) => setSearchWord(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search posts..."
            className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-500 placeholder-gray-400 focus:outline-none hover:border-purple-500 transition duration-200"
          />

          <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500">
            <MagnifyingGlassIcon />
          </button>
        </div>
      </div>
      <div className="grid gap-4 grid-cols-1 md:w-[60%] sm:w-[100%]">
        {filteredPosts?.map(
          (post: { title: string; body: string; id: number }, pageIndex) => {
            return (
              <div
                key={pageIndex}
                ref={
                  flatData.length === pageIndex + 1 ? lastPostElementRef : null
                }
              >
                <PostCard
                  title={post.title}
                  body={post.body}
                  onEdit={onEditPost}
                  onDelete={onDelete}
                  id={post.id}
                />
              </div>
            );
          },
        )}
        {isFetchingNextPage && <div>Loading more posts...</div>}
      </div>
    </div>
  );
};
