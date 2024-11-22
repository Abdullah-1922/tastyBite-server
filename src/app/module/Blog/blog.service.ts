import { QueryBuilder } from "../../builder/QueryBuilder";
import AppError from "../../errors/AppError";
import { User } from "../User/user.model";
import { TBlog } from "./blog.interface";
import { Blog } from "./blog.model";

const createBlog = async (payload: Partial<TBlog>) => {
  const user = await User.findOne({ clerkId: payload.clerkId });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  payload.user = user._id;
  const res = await Blog.create(payload);
  return res;
};
const getAllBlog = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(Blog.find().populate("user"), query)
    .search(["BlogCategory", "title", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
  return { result, meta };
};
const getAllSearchBlog = async (query: Record<string, unknown>) => {
  const blogQuery = new QueryBuilder(
    Blog.find().select(["image", "title", "createdAt"]),
    query
  )
    .search(["BlogCategory", "title", "description"])
    .filter()
    .sort()
    .paginate()
    .fields();

  const result = await blogQuery.modelQuery;
  const meta = await blogQuery.countTotal();
  return { result, meta };
};

const deleteSingleBlog = async (id: string) => {
  const result = await Blog.findByIdAndDelete(id);

  return result;
};
const getSingleBlog = async (id: string) => {
  const result = await Blog.findById(id).populate("user");

  return result;
};
const updateBlog = async (id: string, payload: Partial<TBlog>) => {
  const blog = await Blog.findById(id);
  if (!blog) {
    throw new AppError(404, "Blog id Invalid");
  }
  const result = await Blog.findByIdAndUpdate(id, payload, { new: true });

  return result;
};

export const BlogServices = {
  createBlog,
  getAllBlog,
  deleteSingleBlog,
  getSingleBlog,
  updateBlog,
  getAllSearchBlog
};
