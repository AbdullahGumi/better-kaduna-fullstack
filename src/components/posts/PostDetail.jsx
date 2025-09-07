// src/components/posts/PostDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, Link } from "react-router-dom";
import apiService from "../../services/apiService";
import { AuthContext } from "../../App";
import { toast } from "react-toastify";
import SocialShareButtons from "../common/SocialShareButtons";

const PostDetail = () => {
  const { id } = useParams();
  const { user } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getPost(id);
        setPost(data);
        const postComments = await apiService.getComments({ postId: id });
        setComments(postComments);
      } catch (error) {
        console.log(error);
        toast.error("Failed to load post", { autoClose: 3000 });
      } finally {
        setIsLoading(false);
      }
    };
    fetchPost();
  }, [id]);

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to comment", { autoClose: 3000 });
      return;
    }
    if (!comment.trim()) {
      toast.error("Comment cannot be empty", { autoClose: 3000 });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newComment = await apiService.createComment({
        content: comment,
        userId: user.id,
        userName: user.name,
        postId: id,
        parentId: null,
        createdAt: new Date().toISOString(),
      });
      setComments([...comments, newComment]);
      setComment("");
      toast.success("Comment submitted", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to submit comment", { autoClose: 3000 });
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (e, parentId) => {
    e.preventDefault();
    if (!user) {
      toast.error("Please log in to reply", { autoClose: 3000 });
      return;
    }
    if (!replyContent.trim()) {
      toast.error("Reply cannot be empty", { autoClose: 3000 });
      return;
    }

    console.log("Submitting reply with user:", user);
    console.log("Reply data:", {
      content: replyContent.trim(),
      userId: user.id,
      userName: user.name,
      postId: id,
      parentId,
    });

    setIsSubmittingReply(true);
    try {
      const newReply = await apiService.createComment({
        content: replyContent.trim(),
        userId: user.id,
        userName: user.name,
        postId: id,
        parentId,
        createdAt: new Date().toISOString(),
      });
      setComments([...comments, newReply]);
      setReplyContent("");
      setReplyingTo(null);
      toast.success("Reply submitted", { autoClose: 2000 });
    } catch (error) {
      console.log("Reply submission error:", error);
      console.log("Error response:", error.response?.data);
      toast.error(error.response?.data?.error || "Failed to submit reply", {
        autoClose: 3000,
      });
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;

    setDeletingCommentId(commentId);
    try {
      await apiService.deleteComment(commentId);
      setComments(comments.filter((c) => c.id !== commentId));
      toast.success("Comment deleted successfully", { autoClose: 2000 });
    } catch (error) {
      console.log(error);
      toast.error("Failed to delete comment", { autoClose: 3000 });
    } finally {
      setDeletingCommentId(null);
    }
  };

  // Function to build comment tree
  const buildCommentTree = (comments) => {
    const commentMap = {};
    const tree = [];

    // Create a map of comments by ID
    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
    });

    // Build the tree structure
    comments.forEach((comment) => {
      if (comment.parentId) {
        if (commentMap[comment.parentId]) {
          commentMap[comment.parentId].replies.push(commentMap[comment.id]);
        }
      } else {
        tree.push(commentMap[comment.id]);
      }
    });

    return tree;
  };

  const renderComments = (comments, depth = 0) => {
    return comments.map((c) => (
      <div
        key={c.id}
        className={`border-b border-gray-200 pb-4 flex justify-between items-start ${
          depth > 0 ? "ml-8" : ""
        }`}
      >
        <div>
          <p className="text-kaduna-gray font-medium">{c.userName}</p>
          <p className="text-sm text-kaduna-gray">
            {new Date(c.createdAt).toLocaleString()}
          </p>
          <p className="text-kaduna-gray mt-2">{c.content}</p>
          {user && (
            <button
              onClick={() => setReplyingTo(c.id)}
              className="text-kaduna-green hover:text-kaduna-green-dark text-sm mt-2 cursor-pointer transition-colors"
            >
              Reply
            </button>
          )}
          {replyingTo === c.id && (
            <div className="mt-4">
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
                placeholder="Write your reply..."
                rows="3"
                aria-label="Reply input"
              />
              <div className="flex space-x-2 mt-2">
                <button
                  onClick={(e) => handleReplySubmit(e, c.id)}
                  className="btn-green px-4 py-2 rounded-md hover:shadow-sm transition transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={!replyContent.trim() || isSubmittingReply}
                >
                  {isSubmittingReply ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Submitting...
                    </div>
                  ) : (
                    "Submit Reply"
                  )}
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-kaduna-gray hover:text-kaduna-green-dark px-4 py-2 rounded-md cursor-pointer transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
          {c.replies && c.replies.length > 0 && (
            <div className="mt-4">{renderComments(c.replies, depth + 1)}</div>
          )}
        </div>
        {user && user.role === "admin" && (
          <button
            onClick={() => handleDeleteComment(c.id)}
            className="text-red-600 hover:text-red-800 text-sm cursor-pointer transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={deletingCommentId === c.id}
          >
            {deletingCommentId === c.id ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-red-600 mr-1"></div>
                Deleting...
              </div>
            ) : (
              "Delete"
            )}
          </button>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-kaduna-gray font-sans">
        Loading...
      </div>
    );
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 font-sans">
        <h1 className="text-4xl font-bold text-kaduna-gray mb-6">
          Post Not Found
        </h1>
        <Link to="/" className="text-kaduna-green hover:text-kaduna-green-dark">
          Return to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 font-sans">
      <style>
        {`
          /* Enhanced Typography */
          .prose h1, .prose h2, .prose h3 {
            color: #1f2937;
            font-weight: 700;
            margin-top: 2rem;
            margin-bottom: 1rem;
          }

          .prose h1 {
            font-size: 2.5rem;
            border-bottom: 3px solid #22c55e;
            padding-bottom: 0.5rem;
          }

          .prose h2 {
            font-size: 2rem;
            border-bottom: 2px solid #22c55e;
            padding-bottom: 0.25rem;
          }

          .prose h3 {
            font-size: 1.5rem;
            color: #059669;
          }

          .prose p {
            margin-bottom: 1.5rem;
            line-height: 1.7;
          }

          .prose img {
            width: 60% !important;
            height: auto;
            margin-left: auto !important;
            margin-right: auto !important;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          /* Responsive widths for images */
          @media (max-width: 768px) {
            .prose img {
              width: 100% !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .prose img {
              width: 80% !important;
            }
          }

          .prose {
            text-align: center;
          }

          .prose p, .prose h1, .prose h2, .prose h3, .prose ul, .prose ol, .prose blockquote {
            text-align: left;
          }

          .prose .image-container {
            text-align: center;
            margin: 1.5rem 0;
          }

          .prose .image-container img {
            max-width: 60%;
            height: auto;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
            transition: transform 0.3s ease;
          }

          .prose .image-container img:hover {
            transform: scale(1.02);
          }

          .prose img:hover {
            transform: scale(1.02);
          }

          .prose blockquote {
            border-left: 4px solid #22c55e;
            padding-left: 1rem;
            margin: 2rem 0;
            font-style: italic;
            background: #f0fdf4;
            padding: 1rem 1.5rem;
            border-radius: 0 8px 8px 0;
          }

          .prose ul, .prose ol {
            padding-left: 1.5rem;
            margin: 1.5rem 0;
          }

          .prose li {
            margin-bottom: 0.5rem;
          }

          /* Video Styles */
          .prose video {
            width: 60% !important;
            height: auto;
            margin-left: auto !important;
            margin-right: auto !important;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          /* Responsive widths for videos */
          @media (max-width: 768px) {
            .prose video {
              width: 100% !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .prose video {
              width: 80% !important;
            }
          }

          /* YouTube Embed Styles */
          .prose iframe {
            width: 60% !important;
            height: 400px;
            margin-left: auto !important;
            margin-right: auto !important;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          }

          /* Responsive widths for iframes */
          @media (max-width: 768px) {
            .prose iframe {
              width: 100% !important;
            }
          }

          @media (min-width: 769px) and (max-width: 1024px) {
            .prose iframe {
              width: 80% !important;
            }
          }

          /* Code Block Styles */
          .prose pre {
            background: #1f2937;
            color: #e5e7eb;
            padding: 1rem;
            border-radius: 8px;
            overflow-x: auto;
            margin: 1.5rem 0;
          }

          .prose code {
            background: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 4px;
            font-family: 'Monaco', 'Menlo', monospace;
          }

          /* Link Styles */
          .prose a {
            color: #059669;
            text-decoration: none;
            transition: color 0.3s ease;
          }

          .prose a:hover {
            color: #047857;
            text-decoration: underline;
          }
        `}
      </style>
      <div className="relative bg-gradient-to-r from-kaduna-green to-kaduna-green-dark text-white py-16 rounded-lg mb-8">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold font-lora">{post.title}</h1>
          <p className="mt-4 text-lg text-gray-400">
            By {post.author} | {new Date(post.date).toLocaleString()}
          </p>
        </div>
      </div>
      {post.thumbnail && (
        <img
          src={post.thumbnail}
          alt={post.title}
          className="w-full mx-auto h-96 object-cover rounded-lg mb-6 shadow-2xl"
        />
      )}
      <div
        className="prose max-w-none text-kaduna-gray mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
      <SocialShareButtons
        url={`${window.location.origin}/posts/${post.id}`}
        title={post.title}
        label="Share this post:"
      />
      <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow max-w-4xl mx-auto">
        <h2 className="text-2xl font-semibold text-kaduna-gray mb-4">
          Comments
        </h2>
        {user ? (
          <div className="mb-6">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kaduna-green"
              placeholder="Write your comment..."
              rows="4"
              aria-label="Comment input"
            />
            <button
              onClick={handleCommentSubmit}
              className="btn-green px-4 py-2 rounded-md mt-2 hover:shadow-sm transition transform hover:scale-105 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!comment.trim() || isSubmittingComment}
            >
              {isSubmittingComment ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Submitting...
                </div>
              ) : (
                "Submit Comment"
              )}
            </button>
          </div>
        ) : (
          <p className="text-kaduna-gray mb-4">
            Please{" "}
            <Link
              to="/login"
              className="text-kaduna-green hover:text-kaduna-green-dark"
            >
              log in
            </Link>{" "}
            or{" "}
            <Link
              to="/register"
              className="text-kaduna-green hover:text-kaduna-green-dark"
            >
              register
            </Link>{" "}
            to comment.
          </p>
        )}
        {comments.length > 0 ? (
          <div className="space-y-4">
            {renderComments(buildCommentTree(comments))}
          </div>
        ) : (
          <p className="text-kaduna-gray">No comments yet.</p>
        )}
      </div>
      <Link
        to="/"
        className="text-kaduna-green hover:text-kaduna-green-dark mt-6 inline-block"
      >
        Back to News
      </Link>
    </div>
  );
};

export default PostDetail;
