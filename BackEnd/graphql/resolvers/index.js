const bcrypt = require('bcryptjs');
const BlogModel = require('../../models/blog');
const UserModel = require('../../models/user');

//functions to drill down on query searching users{ createblogs { author { etc...}}}
const user = async (userId) => {
  const user = await UserModel.findById(userId);
  return { ...user._doc, createdBlogs: blogs.bind(this, user._doc.createdBlogs) };
}
const blogs = async (blogIds) => {
  const allBlogs = await BlogModel.find({ _id: { $in: blogIds } });
  const blogs = await allBlogs.map(blog => {
    return { ...blog._doc, author: user.bind(this, blog.author) }
  })
  return blogs;
}

module.exports = {
  blogs: async () => {
    try {
      const allBlogs = await BlogModel.find({});
      const blogs = await allBlogs.map(blog => {
        return { ...blog._doc, author: user.bind(this, blog._doc.author), createdAt: blog._doc.createdAt.toISOString() }
      })
      return blogs;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  users: async () => {
    try {
      const allUsers = await UserModel.find({}).populate('createdBlogs');
      const users = await allUsers.map(user => {
        return { ...user._doc, createdBlogs: blogs.bind(this, user._doc.createdBlogs) }
      })
      return users;
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createBlog: async (args) => {
    const { title, description, category, image } = args.blogInput;
    //._doc is a property of mongoose, that just gives the data without all the extra meta data.
    try {
      const blog = await new BlogModel({
        title: title,
        description: description,
        image: image,
        category: category,
        author: '5c96c4bd3f567f2a8c3826db'
      });
      const blogSaved = await blog.save()
      const gettingUser = await UserModel.findById('5c96c4bd3f567f2a8c3826db');
      if (!gettingUser) {
        throw new Error('User not found.');
      }
      const updateUser = await gettingUser.createdBlogs.push(blog);
      const updatedUser = await gettingUser.save();
      return { ...blogSaved._doc, createdAt: blog._doc.createdAt.toISOString(), author: user.bind(this, blogSaved._doc.author) };
    } catch (err) {
      console.log(err);
      throw err;
    }
  },
  createUser: async (args) => {
    try {
      const { name, email, password } = args.userInput;
      const userExist = await UserModel.findOne({ email: email.toLowerCase() });
      if (userExist) {
        throw new Error('User with that email already exist');
      }
      const hashedPwd = await bcrypt.hash(password, 12);
      const user = await new UserModel({
        name: name,
        email: email.toLowerCase(),
        password: hashedPwd
      });
      const newUser = await user.save();
      return { ...newUser._doc, password: null }
    } catch (err) {
      console.log(err);
      throw err;
    }
  }
};

module.exports = user;
module.exports = blogs;