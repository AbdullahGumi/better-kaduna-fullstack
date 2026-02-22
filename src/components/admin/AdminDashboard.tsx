"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "../../lib/auth";
import apiService from "../../services/apiService";
import { Post, Event, MDA, User } from "../../types";
import {
  FileText,
  Calendar,
  Users,
  TrendingUp,
  Plus,
  Edit,
  Trash2,
  BarChart3,
  CheckCircle,
  AlertCircle,
  Activity,
  Settings,
  Search,
} from "lucide-react";

const AdminDashboard = () => {
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [mdas, setMdas] = useState<MDA[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [postsData, eventsData, mdasData, usersData] = await Promise.all([
          apiService.getPosts(),
          apiService.getEvents(),
          apiService.getMDAs(),
          apiService.getUsers(),
        ]);
        setPosts(postsData);
        setEvents(eventsData);
        setMdas(mdasData);
        setUsers(usersData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (user && user.role === "admin") {
      fetchData();
    }
  }, [user]);

  const handleDelete = async (type: string, id: string) => {
    if (!window.confirm(`Are you sure you want to delete this ${type}?`))
      return;
    try {
      if (type === "post") {
        await apiService.deletePost(id);
        setPosts(posts.filter((post) => post.id !== id));
      } else if (type === "event") {
        await apiService.deleteEvent(id);
        setEvents(events.filter((event) => event.id !== id));
      } else if (type === "mda") {
        await apiService.deleteMDA(id);
        setMdas(mdas.filter((mda) => mda.id !== id));
      }
    } catch (error) {
      console.log(error);
    }
  };

  // Filter content based on search
  const filteredPosts = posts.filter(
    (post) =>
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredMdas = mdas.filter(
    (mda) =>
      mda.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      mda.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Statistics
  const stats = {
    totalPosts: posts.length,
    totalEvents: events.length,
    totalUsers: users.length,
    recentPosts: posts.filter((post) => {
      const postDate = new Date(post.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return postDate > weekAgo;
    }).length,
    recentEvents: events.filter((event) => {
      const eventDate = new Date(event.date);
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);
      return eventDate > weekAgo;
    }).length,
  };

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white p-8 rounded-lg shadow-md text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">
            Access Denied
          </h1>
          <p className="text-gray-600 mb-4">
            Please log in as an admin to access the dashboard.
          </p>
          <Link
            href="/"
            className="btn-green px-6 py-2 rounded-md inline-block"
          >
            Return to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex flex-col sm:justify-between sm:items-center sm:flex-row gap-2">
            <div className="flex items-center space-x-4">
              <BarChart3 className="w-8 h-8 text-kaduna-green flex-shrink-0" />
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-800">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-600">
                  Welcome back, {user.name}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Navigation Tabs */}
        <div className="mb-8 overflow-x-auto scrollbar-hide">
          <nav className="flex space-x-1 bg-white p-1 rounded-lg shadow-sm min-w-max sm:min-w-0">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "posts", label: "Posts", icon: FileText },
              { id: "events", label: "Events", icon: Calendar },
              { id: "mdas", label: "MDAs", icon: BarChart3 },
              { id: "users", label: "Users", icon: Users },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center px-4 py-3 sm:py-2 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${activeTab === tab.id
                  ? "bg-green-900 text-white"
                  : "text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                  }`}
              >
                <tab.icon className="w-4 h-4 mr-2" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="space-y-8">
            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Posts</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalPosts}
                    </p>
                  </div>
                  <FileText className="w-8 h-8 text-blue-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    +{stats.recentPosts} this week
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Events</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalEvents}
                    </p>
                  </div>
                  <Calendar className="w-8 h-8 text-purple-500" />
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-600">
                    +{stats.recentEvents} this week
                  </span>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {stats.totalUsers}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">System Status</p>
                    <p className="text-lg font-bold text-green-600">Healthy</p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Actions
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Link
                  href="/admin/post"
                  className="flex items-center p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                >
                  <Plus className="w-6 h-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-blue-900">Create Post</p>
                    <p className="text-sm text-blue-700">
                      Write a new blog post
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/event"
                  className="flex items-center p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
                >
                  <Plus className="w-6 h-6 text-purple-600 mr-3" />
                  <div>
                    <p className="font-medium text-purple-900">Create Event</p>
                    <p className="text-sm text-purple-700">
                      Schedule a new event
                    </p>
                  </div>
                </Link>

                <Link
                  href="/admin/users"
                  className="flex items-center p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors"
                >
                  <Settings className="w-6 h-6 text-green-600 mr-3" />
                  <div>
                    <p className="font-medium text-green-900">Manage Users</p>
                    <p className="text-sm text-green-700">
                      User administration
                    </p>
                  </div>
                </Link>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Activity
              </h2>
              <div className="space-y-4">
                {[...posts.slice(0, 3), ...events.slice(0, 3)]
                  .sort(
                    (a, b) =>
                      new Date(b.date).getTime() - new Date(a.date).getTime()
                  )
                  .slice(0, 5)
                  .map((item) => (
                    <div
                      key={`${item.id}-${item.title}`}
                      className="flex items-center space-x-3"
                    >
                      <div className="flex-shrink-0">
                        {"author" in item ? (
                          <FileText className="w-5 h-5 text-blue-500" />
                        ) : (
                          <Calendar className="w-5 h-5 text-purple-500" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {item.title}
                        </p>
                        <p className="text-sm text-gray-500">
                          {"author" in item
                            ? `Post by ${item.author}`
                            : `Event at ${item.location}`}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-sm text-gray-500">
                        {new Date(item.date).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* Posts Tab */}
        {activeTab === "posts" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manage Posts</h2>
              <Link
                href="/admin/post"
                className="btn-green px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Post
              </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Posts List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaduna-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading posts...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredPosts.map((post) => (
                    <div key={post.id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 leading-tight">
                            {post.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            By {post.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(post.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 sm:space-x-2 border-t sm:border-t-0 pt-4 sm:pt-0 justify-end">
                          <Link
                            href={`/admin/post/${post.id}`}
                            className="text-blue-600 hover:text-blue-800 p-3 sm:p-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete("post", post.id)}
                            className="text-red-600 hover:text-red-800 p-3 sm:p-2 rounded-md hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredPosts.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No posts found matching your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Events Tab */}
        {activeTab === "events" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">
                Manage Events
              </h2>
              <Link
                href="/admin/event"
                className="btn-green px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Event
              </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* Events List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaduna-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading events...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 leading-tight">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            {event.location}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 sm:space-x-2 border-t sm:border-t-0 pt-4 sm:pt-0 justify-end">
                          <Link
                            href={`/admin/event/${event.id}`}
                            className="text-blue-600 hover:text-blue-800 p-3 sm:p-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete("event", event.id)}
                            className="text-red-600 hover:text-red-800 p-3 sm:p-2 rounded-md hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No events found matching your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MDAs Tab */}
        {activeTab === "mdas" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manage MDAs</h2>
              <Link
                href="/admin/mda"
                className="btn-green px-4 py-2 rounded-md flex items-center"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create MDA
              </Link>
            </div>

            {/* Search */}
            <div className="bg-white p-4 rounded-lg shadow-sm border">
              <div className="flex items-center space-x-4">
                <Search className="w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search MDAs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-gray-900 placeholder-gray-500"
                />
              </div>
            </div>

            {/* MDAs List */}
            <div className="bg-white rounded-lg shadow-sm border">
              {loading ? (
                <div className="p-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-kaduna-green mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading MDAs...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredMdas.map((mda) => (
                    <div key={mda.id} className="p-6 hover:bg-gray-50">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900 leading-tight">
                            {mda.name}
                          </h3>
                          <p className="text-sm text-gray-600 mt-1">
                            By {mda.author}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(mda.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-4 sm:space-x-2 border-t sm:border-t-0 pt-4 sm:pt-0 justify-end">
                          <Link
                            href={`/admin/mda/${mda.id}`}
                            className="text-blue-600 hover:text-blue-800 p-3 sm:p-2 rounded-md hover:bg-blue-50 flex items-center gap-2"
                          >
                            <Edit className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Edit</span>
                          </Link>
                          <button
                            onClick={() => handleDelete("mda", mda.id)}
                            className="text-red-600 hover:text-red-800 p-3 sm:p-2 rounded-md hover:bg-red-50 flex items-center gap-2"
                          >
                            <Trash2 className="w-5 h-5 sm:w-4 sm:h-4" />
                            <span className="sm:hidden text-sm uppercase font-bold">Delete</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredMdas.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      No MDAs found matching your search.
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === "users" && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-800">Manage Users</h2>
              <Link
                href="/admin/users"
                className="btn-green px-4 py-2 rounded-md flex items-center"
              >
                <Settings className="w-4 h-4 mr-2" />
                User Management
              </Link>
            </div>

            {/* Users Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {users.length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-blue-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Admin Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {users.filter((u) => u.role === "admin").length}
                    </p>
                  </div>
                  <Settings className="w-8 h-8 text-purple-500" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Regular Users</p>
                    <p className="text-2xl font-bold text-gray-800">
                      {users.filter((u) => u.role === "registered").length}
                    </p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>
            </div>

            {/* Recent Users */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Recent Users
              </h3>
              <div className="space-y-4">
                {users
                  .sort(
                    (a, b) =>
                      new Date(b.createdAt).getTime() -
                      new Date(a.createdAt).getTime()
                  )
                  .slice(0, 5)
                  .map((user) => (
                    <div
                      key={user.id}
                      className="flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <span className="text-sm font-medium text-gray-600">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {user.name}
                          </p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${user.role === "admin"
                            ? "bg-purple-100 text-purple-800"
                            : "bg-green-100 text-green-800"
                            }`}
                        >
                          {user.role}
                        </span>
                        <span className="text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
