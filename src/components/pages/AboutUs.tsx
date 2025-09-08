/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import { Users, Target, Globe } from "lucide-react";

const AboutUs = () => {
  const stats = [
    { number: "50+", label: "Ethnic Groups", icon: "🌍" },
    { number: "23", label: "Local Governments", icon: "🏛️" },
    { number: "8M+", label: "Population", icon: "👥" },
    { number: "1967", label: "Established", icon: "📅" },
  ];

  const values = [
    {
      icon: "🛡️",
      title: "Integrity",
      description:
        "We uphold the highest standards of journalistic integrity and ethical reporting.",
    },
    {
      icon: "❤️",
      title: "Community",
      description:
        "We believe in the power of community and collective progress for Kaduna State.",
    },
    {
      icon: "📚",
      title: "Education",
      description:
        "We champion education as the foundation for sustainable development.",
    },
    {
      icon: "🏆",
      title: "Excellence",
      description:
        "We strive for excellence in everything we do, from reporting to community engagement.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100">
      {/* Structured Data for About Page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "AboutPage",
          name: "About Better Kaduna",
          description:
            "Learn about Better Kaduna's mission to provide credible news, community engagement, and cultural insights for Kaduna State",
          url: "https://betterkaduna.com/about",
          publisher: {
            "@type": "Organization",
            name: "Better Kaduna",
            logo: "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png",
            url: "https://betterkaduna.com",
          },
          mainEntity: {
            "@type": "Organization",
            name: "Better Kaduna",
            description: "News, Events & Community Platform for Kaduna State",
            foundingDate: "2025",
            url: "https://betterkaduna.com",
            logo: "https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png",
            address: {
              "@type": "PostalAddress",
              addressRegion: "Kaduna",
              addressCountry: "NG",
            },
          },
        })}
      </script>

      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-kaduna-green to-kaduna-green-dark text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="mb-8 animate-fade-in">
            <img
              src="https://res.cloudinary.com/dob19lapx/image/upload/v1756322927/logo_pvnwq1.png"
              alt="Better Kaduna - News, Events & Community Platform for Kaduna State"
              className="h-20 mx-auto mb-6 transform hover:scale-110 transition-transform duration-500 drop-shadow-lg"
            />
          </div>
          <h1 className="text-6xl md:text-7xl font-bold font-lora mb-6 animate-fade-in">
            About Better Kaduna
          </h1>
          <p className="mt-8 text-black text-xl max-w-4xl mx-auto leading-relaxed animate-fade-in-delay">
            Your trusted source for credible news, insights, and community
            engagement in Kaduna State. We are more than a media outlet – we are
            the voice of progress, unity, and prosperity for our beloved state.
          </p>
          <div className="mt-12 flex justify-center space-x-6">
            <div className="w-20 h-1 bg-white rounded-full"></div>
            <div className="w-20 h-1 bg-white bg-opacity-60 rounded-full"></div>
            <div className="w-20 h-1 bg-white bg-opacity-30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-white py-16 shadow-inner">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="text-center group animate-fade-in-up"
                style={{ animationDelay: `${index * 0.2}s` }}
              >
                <div className="text-4xl mb-2 group-hover:scale-125 transition-transform duration-300">
                  {stat.icon}
                </div>
                <div className="text-3xl font-bold text-kaduna-green mb-1">
                  {stat.number}
                </div>
                <div className="text-gray-600 font-medium">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-20">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-kaduna-gray mb-4 font-lora">
            Our Story & Purpose
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Better Kaduna is more than just a platform – it&apos;s a movement
            dedicated to transforming our state through truth, transparency, and
            community engagement.
          </p>
        </div>

        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-3 mb-20">
          {/* Who We Are */}
          <div className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group animate-fade-in-up">
            <div className="flex items-center mb-6">
              <div className="p-3 bg-kaduna-green bg-opacity-10 rounded-full mr-4 group-hover:bg-kaduna-green group-hover:bg-opacity-20 transition-all duration-300">
                <Users className="w-8 h-8 text-kaduna-green" />
              </div>
              <h3 className="text-2xl font-bold text-kaduna-gray font-lora">
                Who We Are
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              We are an independent media outlet dedicated to promoting good
              governance, democratic values, and the prosperity of Kaduna State
              and Nigeria. Our team is committed to delivering accurate and
              impactful stories that matter to our community.
            </p>
          </div>

          {/* Our Mission */}
          <div
            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group animate-fade-in-up"
            style={{ animationDelay: "0.2s" }}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-kaduna-green bg-opacity-10 rounded-full mr-4 group-hover:bg-kaduna-green group-hover:bg-opacity-20 transition-all duration-300">
                <Target className="w-8 h-8 text-kaduna-green" />
              </div>
              <h3 className="text-2xl font-bold text-kaduna-gray font-lora">
                Our Mission
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To serve as a gateway platform for exploring Kaduna State through
              credible news, social networking, democratic discourse, and the
              promotion of culture, heritage, and unity across all communities.
            </p>
          </div>

          {/* Our Vision */}
          <div
            className="bg-white p-10 rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 border border-gray-100 group animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="flex items-center mb-6">
              <div className="p-3 bg-kaduna-green bg-opacity-10 rounded-full mr-4 group-hover:bg-kaduna-green group-hover:bg-opacity-20 transition-all duration-300">
                <Globe className="w-8 h-8 text-kaduna-green" />
              </div>
              <h3 className="text-2xl font-bold text-kaduna-gray font-lora">
                Our Vision
              </h3>
            </div>
            <p className="text-gray-600 leading-relaxed">
              To foster an informed and united Kaduna community by amplifying
              diverse voices, celebrating cultural heritage, and driving
              positive change through transparent journalism and civic
              engagement.
            </p>
          </div>
        </div>

        {/* Our Values */}
        <div className="mb-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-kaduna-gray mb-4 font-lora">
              Our Core Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              These principles guide everything we do and shape our commitment
              to Kaduna State.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-500 text-center group animate-fade-in-up border border-gray-100"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="flex justify-center mb-6">
                  <div className="p-4 bg-gradient-to-br from-kaduna-green to-kaduna-green-dark rounded-full text-white group-hover:scale-110 transition-transform duration-300">
                    <span className="text-5xl">{value.icon}</span>
                  </div>
                </div>
                <h3 className="text-xl font-bold text-kaduna-gray mb-3 font-lora">
                  {value.title}
                </h3>
                <p className="text-gray-600 leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Kaduna At A Glance */}
        <div className="bg-white p-12 rounded-3xl shadow-2xl animate-fade-in-up border border-gray-100">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-kaduna-gray font-lora mb-4">
              Kaduna At A Glance
            </h2>
            <div className="w-16 h-1 bg-kaduna-green rounded-full mx-auto mb-4"></div>
          </div>
          <div className="grid gap-8 md:grid-cols-2">
            <div>
              <p className="text-gray-700 text-lg leading-relaxed mb-4">
                Known as the &quot;Centre of Learning&quot; Kaduna State was
                established in 1967 as the capital of the former North Central
                State. It has a rich history as the administrative hub of the
                Old Northern Region.
              </p>
              <p className="text-gray-700 text-lg leading-relaxed">
                Kaduna is a vibrant confluence of diverse ethnic and religious
                communities, creating a unique cultural tapestry that shapes its
                identity and drives its progress.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">🌟</div>
                <p className="text-xl font-semibold text-kaduna-gray">
                  A State of Endless Possibilities
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
