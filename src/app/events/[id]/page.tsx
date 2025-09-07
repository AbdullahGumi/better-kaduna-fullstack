"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Layout from "../../../components/Layout";
import apiService from "../../../services/apiService";
import { useAuth } from "../../../lib/auth";
import SocialShareButtons from "../../../components/common/SocialShareButtons";

export default function EventDetail() {
  const params = useParams();
  const id = params.id;
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<any[]>([]);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      setIsLoading(true);
      try {
        const data = await apiService.getEvent(id);
        setEvent(data);
        const eventComments = await apiService.getComments({ eventId: id });
        setComments(eventComments);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    if (id) {
      fetchEvent();
    }
  }, [id]);

  const handleCommentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    if (!comment.trim()) {
      return;
    }
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
    }
  };

  const handleReplySubmit = async (e: React.FormEvent, parentId: string) => {
    e.preventDefault();
    if (!user) {
      return;
    }
    if (!replyContent.trim()) {
      return;
    }
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
      console.log(error);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!window.confirm("Are you sure you want to delete this comment?"))
      return;
    try {
      await apiService.deleteComment(commentId);
      setComments(comments.filter((c: any) => c.id !== commentId));
    } catch (error) {
      console.log(error);
    }
  };

  const buildCommentTree = (comments: any[]) => {
    const commentMap: any = {};
    const tree: any[] = [];

    comments.forEach((comment) => {
      commentMap[comment.id] = { ...comment, replies: [] };
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

  const renderComments = (comments: any[], depth = 0) => {
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
              className="text-kaduna-green hover:text-kaduna-green-dark text-sm mt-2"
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
                  className="btn-green px-4 py-2 rounded-md hover:shadow-sm transition transform hover:scale-105"
                  disabled={!replyContent.trim()}
                >
                  Submit Reply
                </button>
                <button
                  onClick={() => setReplyingTo(null)}
                  className="text-kaduna-gray hover:text-kaduna-green-dark px-4 py-2 rounded-md"
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
            className="text-red-600 hover:text-red-800 text-sm"
          >
            Delete
          </button>
        )}
      </div>
    ));
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-kaduna-gray font-sans">
          Loading...
        </div>
      </Layout>
    );
  }

  if (!event) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 font-sans">
          <h1 className="text-4xl font-bold text-kaduna-gray mb-6">
            Event Not Found
          </h1>
          <Link
            href="/"
            className="text-kaduna-green hover:text-kaduna-green-dark"
          >
            Return to Home
          </Link>
        </div>
      </Layout>
    );
  }

  const eventData = event as any;

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 font-sans">
        <div className="relative bg-gradient-to-r from-kaduna-green to-kaduna-green-dark text-white py-16 rounded-lg mb-8">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl font-bold font-lora">{eventData.title}</h1>
            <p className="mt-4 text-lg text-gray-400">
              {new Date(eventData.date).toLocaleString()} | {eventData.location}
            </p>
          </div>
        </div>
        <div
          className="prose max-w-none text-kaduna-gray mb-8"
          dangerouslySetInnerHTML={{ __html: eventData.description }}
        />
        <SocialShareButtons
          url={`${
            typeof window !== "undefined" ? window.location.origin : ""
          }/events/${eventData.id}`}
          title={eventData.title}
          label="Share this event:"
        />
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
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
                className="btn-green px-4 py-2 rounded-md mt-2 hover:shadow-sm transition transform hover:scale-105"
                disabled={!comment.trim()}
              >
                Submit Comment
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
