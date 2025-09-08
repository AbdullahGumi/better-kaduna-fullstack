"use client";

import Link from "next/link";
import Layout from "../../../components/Layout";
import SocialShareButtons from "../../../components/common/SocialShareButtons";
import { MDA } from "../../../types";

export default function MDADetailClient({ mda }: { mda: MDA }) {
  return (
    <Layout>
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
            <h1 className="text-4xl font-bold font-lora">{mda.name}</h1>
            <p className="mt-4 text-lg text-gray-400">
              Kaduna State MDA | {new Date(mda.date).toLocaleString()}
            </p>
          </div>
        </div>
        {mda.thumbnail && (
          <img
            src={mda.thumbnail}
            alt={mda.name}
            className="w-full mx-auto h-96 object-cover rounded-lg mb-6 shadow-2xl"
          />
        )}
        <div
          className="prose max-w-none text-kaduna-gray mb-8"
          dangerouslySetInnerHTML={{ __html: mda.content }}
        />
        <SocialShareButtons
          url={`${
            typeof window !== "undefined" ? window.location.origin : ""
          }/mdas/${mda.id}`}
          title={mda.name}
          label="Share this MDA:"
        />
        <Link
          href="/mdas"
          className="text-kaduna-green hover:text-kaduna-green-dark mt-6 inline-block"
        >
          Back to MDAs
        </Link>
      </div>
    </Layout>
  );
}
