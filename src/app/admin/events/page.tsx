"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/useAuth";
import apiService from "@/services/apiService";
import Layout from "@/components/Layout";
import { Plus, Edit, Trash2, Search, AlertCircle, Eye } from "lucide-react";

interface Event {
  id: string | number;
  title: string;
  location: string;
  date: string;
  content?: string;
}

interface User {
  id: string | number;
  name: string;
  email: string;
  role: string;
}

export default function AdminEventsPage() {
  const { user } = useAuth() as { user: User | null };
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const eventsData = await apiService.getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === "admin") {
      fetchEvents();
    }
  }, [user]);

  const handleDelete = async (eventId: string | number) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      await apiService.deleteEvent(eventId);
      setEvents(events.filter((event) => event.id !== eventId));
    } catch (error) {
      console.log(error);
    }
  };

  const filteredEvents = events.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (!user || user.role !== "admin") {
    return (
      <Layout>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Access Denied
            </h1>
            <p className="text-gray-600 mb-4">
              Please log in as an admin to access this page.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
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
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Loading events...</p>
                </div>
              ) : (
                <div className="divide-y divide-gray-200">
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="p-6 hover:bg-gray-50">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <h3 className="text-lg font-medium text-gray-900">
                            {event.title}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {event.location}
                          </p>
                          <p className="text-sm text-gray-500">
                            {new Date(event.date).toLocaleDateString()}
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Link
                            href={`/events/${event.id}`}
                            className="text-green-600 hover:text-green-700 p-2 rounded-md hover:bg-green-50"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/admin/event/${event.id}`}
                            className="text-blue-600 hover:text-blue-800 p-2 rounded-md hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(event.id)}
                            className="text-red-600 hover:text-red-800 p-2 rounded-md hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                  {filteredEvents.length === 0 && (
                    <div className="p-8 text-center text-gray-500">
                      {searchTerm
                        ? "No events found matching your search."
                        : "No events found."}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
