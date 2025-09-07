import React from "react";
import MDAList from "../mdas/MDAList";

const InsideKadunaMDAs = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-kaduna-green to-kaduna-green-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold font-lora">
            Inside Kaduna MDAs
          </h1>
          <p className="mt-4 text-lg max-w-2xl mx-auto text-gray-400">
            Explore the roles and initiatives of Kaduna State's Ministries,
            Departments, and Agencies.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <MDAList />
      </div>
    </div>
  );
};

export default InsideKadunaMDAs;
