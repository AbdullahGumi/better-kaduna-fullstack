"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import apiService from "../../services/apiService";

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  const fetchEvents = useCallback(async () => {
    if (isLoading || !hasMore) return;
    setIsLoading(true);
    try {
      const newEvents = await apiService.getEvents(page);
      setEvents((prevEvents) => {
        // Filter out events that already exist to prevent duplicates
        const existingIds = new Set(prevEvents.map((event) => event.id));
        const uniqueNewEvents = newEvents.filter(
          (event) => !existingIds.has(event.id)
        );
        return [...prevEvents, ...uniqueNewEvents];
      });
      setHasMore(newEvents.length === 10);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.log(error);
      // Error handling is managed by apiService
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, hasMore, page]);

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchEvents();
        }
      },
      { threshold: 1.0 }
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) {
        observer.unobserve(loaderRef.current);
      }
    };
  }, [hasMore, isLoading, fetchEvents]);

  return (
    <div className="bg-white rounded-lg shadow-md font-sans overflow-hidden">
      {/* Desktop Header */}
      <div className="hidden md:block p-4 border-b border-gray-100">
        <h2 className="text-2xl font-bold text-kaduna-gray">Upcoming Events</h2>
      </div>

      {/* Mobile: Vertical column layout for events */}
      <div className="md:hidden">
        <div className="p-4 border-b border-gray-100">
          <h2 className="text-xl font-bold text-kaduna-gray">
            Upcoming Events
          </h2>
        </div>

        <div className="p-4">
          <div className="space-y-3">
            {events.slice(0, 3).map((event) => (
              <div
                key={event.id}
                className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:border-kaduna-green transition-colors"
              >
                <h3 className="text-base font-semibold text-kaduna-gray mb-2 line-clamp-2">
                  <Link
                    href={`/events/${event.id}`}
                    className="text-kaduna-green hover:text-kaduna-green-dark cursor-pointer transition-colors"
                  >
                    {event.title}
                  </Link>
                </h3>
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span className="mr-3">
                    📅 {new Date(event.date).toLocaleDateString()}
                  </span>
                  <span>📍 {event.location}</span>
                </div>
                <p className="text-sm text-gray-600 line-clamp-2">
                  {event.description}
                </p>
              </div>
            ))}
          </div>
          {events.length > 3 && (
            <div className="text-center mt-4">
              <Link
                href="#"
                className="text-kaduna-green hover:text-kaduna-green-dark font-semibold text-sm cursor-pointer"
              >
                View All Events →
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Desktop: Full event list */}
      <div className="hidden md:block p-4">
        <div className="space-y-4">
          {events.map((event) => (
            <div
              key={event.id}
              className="border-b border-gray-200 pb-4 last:border-b-0 hover:bg-gray-50 p-3 rounded-lg transition-colors"
            >
              <h3 className="text-lg font-semibold text-kaduna-gray mb-2">
                <Link
                  href={`/events/${event.id}`}
                  className="text-kaduna-green hover:text-kaduna-green-dark cursor-pointer transition-colors"
                >
                  {event.title}
                </Link>
              </h3>
              <div className="flex items-center text-sm text-gray-500 mb-2">
                <span className="mr-4">
                  📅 {new Date(event.date).toLocaleDateString()}
                </span>
                <span>📍 {event.location}</span>
              </div>
              <p className="text-sm text-gray-600 line-clamp-2">
                {event.description}
              </p>
            </div>
          ))}
        </div>
        <div ref={loaderRef} className="h-10"></div>
        {isLoading && (
          <p className="text-center text-kaduna-gray text-sm">Loading...</p>
        )}
        {!hasMore && !isLoading && (
          <p className="text-center text-kaduna-gray text-sm">
            No more events to load.
          </p>
        )}
      </div>
    </div>
  );
};

export default EventList;
