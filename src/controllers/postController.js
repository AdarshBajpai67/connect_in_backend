const Post = require("../models/postModel");

//create a new post
exports.createPost = async (req, res) => {
  try {
    // Check if user is authenticated
    // console.log("UserId:", userId);

    // if (!req.user) {
    //   return res
    //     .status(401)
    //     .json({ message: "Unauthorized: User not logged in" });
    // }

    // console.log("Request : ", req);
    const { content } = req.body;
    const imageUrls = req.files ? req.files.map(file => file.path) : [];

    //get user id from request
    const userID = req.user;
    // console.log("UserId:", userID);

    if (!userID) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const newPost = new Post({
      user: userID,
      content: content,
      imageUrl: imageUrls,
    });

    const savedPost = await newPost.save();
    res.status(201).json(savedPost); //{ message: "Post created successfully", savedPost }
  } catch (err) {
    console.error("Error creating post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get all post
exports.getAllPosts = async (req, res) => {
  try {
    // console.log("Request user: ", req.user);
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }
    const posts = await Post.find({ user: req.user });
    res.status(200).json(posts);
  } catch (err) {
    console.error("Error fetching post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//get specific post by ID
exports.getPostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check if user is authorized to view post
    if (post.user.toString() !== req.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authorized to view post" });
    }

    return res.status(200).json(post);
  } catch (err) {
    console.error("Error fetching post by ID: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//update specific post by ID
exports.updatePostById = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content} = req.body;
    const imageUrl = req.files ? req.files.map(file => file.path) : [];

    //find post by id
    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check if user is authorized to update post
    if (post.user.toString() !== req.user) {
      // console.log("Post User: ", post.user.toString());
      // console.log("Req User: ", req.user);
      // console.log(post.user.toString() === req.user);

      return res
        .status(401)
        .json({ message: "Unauthorized: User not authorized to update post" });
    }

    //update post
    // const updatedPost = await Post.findByIdAndUpdate(
    //   postId,
    //   { content, imageUrl },
    //   { new: true }
    // );
    post.content = content || post.content; //update content if provided
    post.imageUrl = imageUrl.length > 0 ? imageUrl : post.imageUrl; //update image if provided

    //save updated post
    const updatedPost = await post.save();

    return res.status(200).json(updatedPost);
  } catch (err) {
    console.error("Error updating post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete specific post by ID
exports.deletePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    //find post by id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    //check if user is authorized to delete post
    if (post.user.toString() != req.user) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not authorized to delete post" });
    }

    //delete post
    await Post.findByIdAndDelete(postId);
    return res.status(200).json({ message: "Post deleted successfully" });
  } catch (err) {
    console.error("Error deleting post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//like a post
exports.likePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    //find post by ID
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check if user has already liked the post
    const alreadyLikedByUser = post.likes.includes(req.user);
    if (alreadyLikedByUser) {
      return res.status(400).json({ message: "Post already liked by user" });
    }

    //like the post
    post.likes.push(req.user);
    await post.save();

    res.status(200).json({ message: "Post liked successfully" });
  } catch (err) {
    console.error("Error liking post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//dislike the post
exports.dislikePost = async (req, res) => {
  try {
    const postId = req.params.postId;

    //find post by Id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check if the user has previosly liked the post
    const alreadyLiked = post.likes.includes(req.user);
    if (!alreadyLiked) {
      return res.status(400).json({ message: "You have not liked this post" });
    }

    //dislike the post
    const index = post.likes.findIndex(
      (userId) => userId.toString() === req.user
    );
    if (index !== -1) {
      post.likes.splice(index, 1);
    }
    await post.save();

    res.status(200).json({ message: "Post disliked successfully" });
  } catch (err) {
    console.error("Error disliking post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//create a new comment
exports.createComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const { content } = req.body;

    //find post by Id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //get user id from request
    // const userID = req.user;
    // console.log("UserId:", userID);

    const newComment = {
      user: req.user,
      content: content,
    };

    post.comments.push(newComment);
    await post.save();

    res.status(201).json({ message: "Comment added successfully" });
  } catch (err) {
    console.error("Error creating post: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//delete a comment
exports.deleteComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    //find post by Id
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //find comment by ID
    const comment = post.comments.find((comment) => comment.id == commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    //check if user is authorized to delete comment
    if (comment.user.toString() !== req.user) {
      return res.status(401).json({
        message: "Unauthorized: User not authorized to delete comment",
      });
    }

    //delete comment
    post.comments = post.comments.filter((comment) => comment.id != commentId);
    await post.save();

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (err) {
    console.error("Error deleting comment: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//add a nested comment to a specific post by its id and parent comment id
exports.addNestedComment = async (req, res) => {
  try {
    const postId = req.params.postId;
    const parentId = req.params.parentId;
    const content = req.body.content;

    //find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //check if parent comment exists
    const parentComment = await Post.find(
      (comment) => comment._id.toString() === parentId
    );
    if (!parentComment) {
      return res.status(404).json({ message: "Parent comment not found" });
    }

    //add nested comment to replies array of parent comment
    parentComment.replies.push({
      user: req.user,
      content: content,
    });

    await post.save();
    res
      .status(201)
      .json({ message: "Nested comment added successfully", post });
  } catch (err) {
    console.error("Error adding nested comment: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//retrieve nested comments within a specific post by its id
exports.getRepliesForComments = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;

    //find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    //find top level comment by id within post
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    //check if comment has replies and return them
    const replies = comment.replies;
    if (replies.length === 0) {
      return res.status(200).json({ message: "No replies for comment" });
    }

    res.status(200).json({ replies });
  } catch (err) {
    console.error("Error fetching replies: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//like a comment
exports.likeCommentOrReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const replyId = req.params.replyId; //assuming replyId is provided in request if it is a nested comment
    const isTopComment = !replyId; //if repltId is not provided, it is a top level comment

    //find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let comment;
    if (isTopComment) {
      //find top level comment by id within post
      comment = post.comments.id(commentId);
    } else {
      //if replyId is provided, find top level comment by id within post
      const parentComment = post.comments.id(commentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      comment = parentComment.replies.id(commentId);
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    //check if user has already liked the reply
    const alreadyLikedByUser = comment.likes.includes(req.user);
    if (alreadyLikedByUser) {
      return res.status(400).json({ message: "Comment already liked by user" });
    }

    //like the reply
    comment.likes.push(req.user);
    await post.save();

    res.status(200).json({ message: "Comment liked successfully" });
  } catch (err) {
    console.error("Error liking comment or reply: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

//dislike a comment or nested comment
exports.dislikeCommentOrReply = async (req, res) => {
  try {
    const postId = req.params.postId;
    const commentId = req.params.commentId;
    const replyId = req.params.replyId; //assuming replyId is provided in request if it is a nested comment
    const isTopComment = !replyId; //if repltId is not provided, it is a top level comment

    //find post
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    let comment;
    if (isTopComment) {
      //find top level comment by id within post
      comment = post.comments.id(commentId);
    } else {
      //if replyId is provided, find top level comment by id within post
      const parentComment = post.comments.id(commentId);
      if (!parentComment) {
        return res.status(404).json({ message: "Comment not found" });
      }
      comment = parentComment.replies.id(commentId);
    }

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }
    //check if user has already liked the reply
    const alreadyLikedByUser = comment.likes.includes(req.user);
    if (!alreadyLikedByUser) {
      return res
        .status(400)
        .json({ message: "You have not liked this comment" });
    }

    // Dislike the comment or nested comment
    const index = comment.likes.findIndex(
      (userId) => userId.toString() === req.user
    );
    if (index !== -1) {
      comment.likes.splice(index, 1);
    }

    await post.save();

    res.status(200).json({ message: "Comment disliked successfully" });
  } catch (err) {
    console.error("Error disliking comment or reply: ", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
