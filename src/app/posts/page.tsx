"use client";

import React from "react";
import Layout from "../../components/Layout";
import PostList from "../../components/posts/PostList";

export default function PostsPage() {
    return (
        <Layout>
            <div className="w-full">
                <PostList />
            </div>
        </Layout>
    );
}
