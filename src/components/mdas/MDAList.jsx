"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import apiService from "../../services/apiService";

const MDAList = () => {
  const [mdas, setMdas] = useState([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const loaderRef = useRef(null);

  // Function to strip HTML tags and get plain text
  const stripHtml = (html) => {
    const tmp = document.createElement("DIV");
    tmp.innerHTML = html;
    return tmp.textContent || tmp.innerText || "";
  };

  // Function to get preview text from HTML content
  const getPreviewText = (htmlContent, maxLength = 200) => {
    if (!htmlContent) return "Read the full story...";

    const plainText = stripHtml(htmlContent);
    if (plainText.length <= maxLength) return plainText;

    return plainText.substring(0, maxLength).trim() + "...";
  };

  const resetMdas = () => {
    setMdas([]);
    setPage(1);
    setHasMore(true);
  };

  const fetchMdas = useCallback(
    async (reset = false) => {
      if (isLoading || (!hasMore && !reset)) return;

      setIsLoading(true);
      try {
        const newMdas = await apiService.getMDAs(reset ? 1 : page);

        if (reset) {
          setMdas(newMdas);
          setPage(2);
        } else {
          setMdas((prevMdas) => {
            // Filter out mdas that already exist to prevent duplicates
            const existingIds = new Set(prevMdas.map((mda) => mda.id));
            const uniqueNewMdas = newMdas.filter(
              (mda) => !existingIds.has(mda.id)
            );
            return [...prevMdas, ...uniqueNewMdas];
          });
          setPage((prevPage) => prevPage + 1);
        }

        setHasMore(newMdas.length === 10);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    },
    [isLoading, hasMore, page]
  );

  useEffect(() => {
    // Reset mdas when component mounts
    resetMdas();
    fetchMdas(true);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          fetchMdas();
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
  }, [hasMore, isLoading, fetchMdas]);

  return (
    <div>
      {/* Mobile: Vertical column layout for MDAs */}
      <div className="block md:hidden mb-6">
        <h2 className="text-xl font-bold text-kaduna-gray mb-4 px-4">
          Latest MDAs
        </h2>
        <div className="space-y-4 px-4">
          {mdas.slice(0, 3).map((mda) => (
            <div
              key={mda.id}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300"
            >
              {mda.thumbnail && (
                <div
                  className="h-32 bg-gray-200"
                  style={{
                    backgroundImage: `url(${mda.thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
              )}
              <div className="p-4">
                <div className="flex items-center text-xs text-gray-500 mb-2">
                  <span>{new Date(mda.date).toLocaleDateString()}</span>
                </div>
                <h3 className="text-lg font-semibold text-kaduna-gray mb-2 line-clamp-2">
                  <Link
                    href={`/mdas/${mda.id}`}
                    className="text-kaduna-green hover:text-kaduna-green-dark transition-colors"
                  >
                    {mda.name}
                  </Link>
                </h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-3 line-clamp-2">
                  {getPreviewText(mda.content, 100)}
                </p>
                <Link
                  href={`/mdas/${mda.id}`}
                  className="text-kaduna-green hover:text-kaduna-green-dark font-semibold text-sm transition-colors cursor-pointer"
                >
                  Read More →
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop: Featured MDA (First MDA) */}
      {mdas.length > 0 && (
        <div className="hidden md:block mb-12">
          <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
            {mdas[0].thumbnail && (
              <div className="relative">
                <div
                  className="h-96 bg-gray-200"
                  style={{
                    backgroundImage: `url(${mdas[0].thumbnail})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                  }}
                ></div>
                <div className="absolute top-4 left-4">
                  <span className="bg-kaduna-green text-white px-3 py-1 rounded-full text-sm font-semibold">
                    Featured MDA
                  </span>
                </div>
              </div>
            )}
            <div className="p-8">
              <div className="flex items-center text-sm text-gray-500 mb-3">
                <span>By {mdas[0].author || "Kaduna State"}</span>
                <span className="mx-2">•</span>
                <span>{new Date(mdas[0].date).toLocaleDateString()}</span>
              </div>
              <h2 className="text-3xl font-bold text-kaduna-gray mb-4">
                <Link
                  href={`/mdas/${mdas[0].id}`}
                  className="text-kaduna-green hover:text-kaduna-green-dark transition-colors"
                >
                  {mdas[0].name}
                </Link>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed mb-6">
                {getPreviewText(mdas[0].content, 200)}
              </p>
              <Link
                href={`/mdas/${mdas[0].id}`}
                className="inline-flex items-center bg-kaduna-green text-white px-6 py-3 rounded-lg hover:bg-kaduna-green-dark transition-colors font-semibold cursor-pointer"
              >
                Read More
                <svg
                  className="ml-2 w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 5l7 7-7 7"
                  ></path>
                </svg>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Desktop: Regular MDAs Grid */}
      {mdas.length > 1 && (
        <div className="hidden md:block mb-12">
          <h2 className="text-2xl font-bold text-kaduna-gray mb-6">All MDAs</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {mdas.slice(1).map((mda) => (
              <div
                key={mda.id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
              >
                {mda.thumbnail && (
                  <div
                    className="h-48 bg-gray-200"
                    style={{
                      backgroundImage: `url(${mda.thumbnail})`,
                      backgroundSize: "cover",
                      backgroundPosition: "center",
                    }}
                  ></div>
                )}
                <div className="p-6">
                  <div className="flex items-center text-sm text-gray-500 mb-2">
                    <span>By {mda.author || "Kaduna State"}</span>
                    <span className="mx-2">•</span>
                    <span>{new Date(mda.date).toLocaleDateString()}</span>
                  </div>
                  <h3 className="text-xl font-semibold text-kaduna-gray mb-3">
                    <Link
                      href={`/mdas/${mda.id}`}
                      className="text-kaduna-green hover:text-kaduna-green-dark transition-colors"
                    >
                      {mda.name}
                    </Link>
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed mb-4">
                    {getPreviewText(mda.content, 120)}
                  </p>
                  <Link
                    href={`/mdas/${mda.id}`}
                    className="text-kaduna-green hover:text-kaduna-green-dark font-semibold text-sm transition-colors cursor-pointer"
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Single MDA Message */}
      {mdas.length === 1 && (
        <div className="text-center py-8">
          <p className="text-gray-500 text-lg">
            This is our latest MDA information. Check back soon for more
            updates!
          </p>
        </div>
      )}

      {/* Loading States */}
      <div ref={loaderRef} className="h-20 flex items-center justify-center">
        {isLoading && (
          <div className="flex items-center space-x-2 text-kaduna-gray">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-kaduna-green"></div>
            <span>Loading more MDAs...</span>
          </div>
        )}
      </div>

      {!hasMore && !isLoading && mdas.length > 0 && (
        <div className="text-center py-12">
          <div className="bg-gray-100 rounded-full p-4 inline-block mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              ></path>
            </svg>
          </div>
          <p className="text-gray-500 text-lg">
            You've reached the end of our MDAs
          </p>
          <p className="text-gray-400 text-sm mt-2">
            Check back later for more updates!
          </p>
        </div>
      )}

      {/* Empty State */}
      {!isLoading && mdas.length === 0 && (
        <div className="text-center py-20">
          <div className="bg-gray-100 rounded-full p-6 inline-block mb-6">
            <svg
              className="w-12 h-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
              ></path>
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No MDAs available
          </h3>
          <p className="text-gray-500">
            Check back soon for MDA information and updates!
          </p>
        </div>
      )}
    </div>
  );
};

export default MDAList;
