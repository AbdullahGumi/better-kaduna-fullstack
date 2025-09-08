"use client";

import React, { useState } from "react";
import Link from "next/link";
import Layout from "../../../components/Layout";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../lib/auth";
import SocialShareButtons from "../../../components/common/SocialShareButtons";
import { Event, Comment } from "../../../types";

type CommentWithReplies = Comment & { replies: CommentWithReplies[] };

export default function EventDetailClient({
  event,
  initialComments,
}: {
  event: Event;
  initialComments: Comment[];
}) {
  const { user } = useAuth();
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>(initialComments);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);
  const [deletingCommentId, setDeletingCommentId] = useState<string | null>(
    null
  );

  const id = event.id;

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !comment.trim()) {
      return;
    }

    setIsSubmittingComment(true);
    try {
      const newComment = await apiService.createComment({
        content: comment,
        userId: user.id,
        userName: user.name,
        eventId: id,
        parentId: null,
      });
      setComments([...comments, newComment]);
      setComment("");
    } catch (error) {
      console.log(error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user || !replyContent.trim()) {
      return;
    }

    setIsSubmittingReply(true);
    try {
      const newReply = await apiService.createComment({
        content: replyContent.trim(),
        userId: user.id,
        userName: user.name,
        eventId: id,
        parentId,
      });
      setComments([...comments, newReply]);
      setReplyContent("");
      setReplyingTo(null);
    } catch (error) {
      console.log("Reply submission error:", error);
    } finally {
      setIsSubmittingReply(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    setDeletingCommentId(commentId);
    try {
      await apiService.deleteComment(commentId);
      setComments(comments.filter((c: Comment) => c.id !== commentId));
    } catch (error) {
      console.log(error);
    } finally {
      setDeletingCommentId(null);
    }
  };

  const buildCommentTree = (comments: Comment[]): CommentWithReplies[] => {
    const commentMap: Record<string, CommentWithReplies> = {};
    const tree: CommentWithReplies[] = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        replies: [] as CommentWithReplies[],
      };
    });

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

  const renderComments = (comments: CommentWithReplies[], depth = 0) => {
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
                rows={3}
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 font-sans">
        <div className="relative bg-gradient-to-r from-kaduna-green to-kaduna-green-dark text-white py-16 rounded-lg mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-lora">{event.title}</h1>
            <p className="mt-4 text-lg text-gray-400">
              {new Date(event.date).toLocaleString()} | {event.location}
            </p>
          </div>
        </div>
        <div
          className="prose max-w-none text-kaduna-gray mb-8"
          dangerouslySetInnerHTML={{ __html: event.description }}
        />
        <SocialShareButtons
          url={`${
            typeof window !== "undefined" ? window.location.origin : ""
          }/events/${event.id}`}
          title={event.title}
          label="Share this event:"
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
                rows={4}
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
                href="/login"
                className="text-kaduna-green hover:text-kaduna-green-dark"
              >
                log in
              </Link>{" "}
              or{" "}
              <Link
                href="/register"
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
          href="/"
          className="text-kaduna-green hover:text-kaduna-green-dark mt-6 inline-block"
        >
          Back to Home
        </Link>
      </div>
    </Layout>
  );
}
