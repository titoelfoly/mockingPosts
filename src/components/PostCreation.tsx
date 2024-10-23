import { useEffect, useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as Yup from "yup";

interface Post {
  title: string;
  body: string;
  id?: number;
}

interface PostCreationDialogProps {
  onSubmit: (post: Post) => void;
  post?: Post;
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required("Title is required")
    .min(3, "Title must be at least 3 characters"),
  body: Yup.string()
    .required("Body is required")
    .min(10, "Body must be at least 10 characters"),
});

const PostCreationDialog = ({ onSubmit, post }: PostCreationDialogProps) => {
  const { control, handleSubmit, reset } = useForm<Post>({
    resolver: yupResolver(validationSchema),
    defaultValues: post || { title: "", body: "" },
  });
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (post) {
      reset(post);
    }
  }, [post, reset]);

  const handleFormSubmit = (data: Post) => {
    onSubmit(data);
    setIsOpen(false);
    reset();
  };

  return (
    <Dialog.Root open={isOpen} onOpenChange={setIsOpen}>
      <Dialog.Trigger asChild>
        {post ? (
          <button className="w-full px-2 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition duration-200">
            Edit
          </button>
        ) : (
          <button className="w-full px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-500 text-left cursor-pointer focus:outline-none hover:border-purple-500 transition duration-200">
            <span className="text-gray-400">Create a new post...</span>
          </button>
        )}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
        <Dialog.Content className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white rounded-lg p-6 w-96 shadow-lg">
          <Dialog.Title className="text-xl font-bold mb-4">
            {post ? "Edit Post" : "Create New Post"}
          </Dialog.Title>
          <form onSubmit={handleSubmit(handleFormSubmit)}>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <Controller
                name="title"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <input
                      id="title"
                      type="text"
                      {...field}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="body"
              >
                Body
              </label>
              <Controller
                name="body"
                control={control}
                render={({ field, fieldState }) => (
                  <>
                    <textarea
                      id="body"
                      {...field}
                      className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 ${
                        fieldState.invalid ? "border-red-500" : ""
                      }`}
                      rows={4}
                    />
                    {fieldState.error && (
                      <p className="text-red-500 text-xs mt-1">
                        {fieldState.error.message}
                      </p>
                    )}
                  </>
                )}
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Dialog.Close asChild>
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </Dialog.Close>
              <Dialog.Close asChild>
                <button
                  type="submit"
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-md hover:opacity-90 transition duration-200"
                  onClick={handleSubmit((data) => {
                    handleFormSubmit(data);
                  })}
                >
                  {post ? "Update" : "Submit"}
                </button>
              </Dialog.Close>
            </div>
          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default PostCreationDialog;
