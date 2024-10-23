import { Post } from "../types";
import PostCreationDialog from "./PostCreation";

export const PostCard = ({ title, body, onEdit, id, onDelete }: Post) => {
  return (
    <div className="mt-4 rounded-lg overflow-hidden shadow-lg transform transition duration-300 ease-in-out bg-white border border-gray-200">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4 flex justify-between items-center ">
        <h2 className="text-xl md:text-2xl font-bold text-white truncate w-full md:w-auto">
          {id}: {title}
        </h2>
        <div className="w-14 flex-shrink-0">
          <div className="w-full">
            <PostCreationDialog onSubmit={onEdit} post={{ title, body, id }} />
          </div>
          <button
            className="h-full mt-2 px-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-200"
            onClick={() => onDelete(id)}
          >
            Delete
          </button>
        </div>
      </div>
      <div className="p-6">
        <p className="text-gray-700 text-base">{body}</p>
      </div>
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 h-1 w-full"></div>
    </div>
  );
};
