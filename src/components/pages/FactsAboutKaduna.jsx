import React from "react";

const FactsAboutKaduna = () => {
  const facts = [
    {
      id: 1,
      icon: "🎓",
      title: "Centre of Learning",
      text: "Kaduna State is located in the northern part of Nigeria and is known as the 'Centre of Learning' due to its numerous educational institutions.",
    },
    {
      id: 2,
      icon: "🏛️",
      title: "Ahmadu Bello University",
      text: "The state is home to the prestigious Ahmadu Bello University, one of the largest universities in Africa.",
    },
    {
      id: 3,
      icon: "🌍",
      title: "Cultural Diversity",
      text: "Kaduna State is rich in cultural diversity, with over 50 different ethnic groups residing within its borders, including Hausa, Fulani, Gbagyi, and many more.",
    },
    {
      id: 4,
      icon: "🎭",
      title: "Vibrant Festivals",
      text: "The state is known for its vibrant festivals, such as the Kaduna State Festival of Arts and Culture, which showcases the region's traditional music, dance, and crafts.",
    },
    {
      id: 5,
      icon: "🏞️",
      title: "Natural Attractions",
      text: "Kaduna State is blessed with natural attractions, including the popular Kagoro Hills, Kamuku National Park, Kajuru Castle, Gamji Resort, and the Matsirga Waterfalls.",
    },
    {
      id: 6,
      icon: "🏰",
      title: "Rich History",
      text: "The city of Kaduna, the state capital, has a rich colonial history and is home to historical landmarks such as the Lord Lugard Hall and the Kaduna Railway Station.",
    },
    {
      id: 7,
      icon: "✈️",
      title: "Transportation Hub",
      text: "Kaduna State is a major transportation hub, with the Kaduna International Airport serving as a gateway to the region.",
    },
    {
      id: 8,
      icon: "🌾",
      title: "Agricultural Prowess",
      text: "The state is also known for its agricultural prowess, producing crops such as maize, sorghum, millet, yam, and tomatoes.",
    },
    {
      id: 9,
      icon: "🌱",
      title: "Distinctive Red Soil",
      text: "Kaduna is known for its distinctive red soil. The terrain in and around Kaduna is characterized by its unique red color, resulting from the high iron oxide content in the soil.",
    },
    {
      id: 10,
      icon: "⚽",
      title: "Sporting Culture",
      text: "Kaduna State has a strong sporting culture and has produced notable athletes who have represented Nigeria in various international competitions.",
    },
    {
      id: 11,
      icon: "🤝",
      title: "Peace and Unity",
      text: "The state is committed to promoting peace and unity, hosting the annual Kaduna State Peace Marathon, which brings together athletes from different backgrounds to foster harmony.",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Structured Data for Facts Page */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Facts About Kaduna State",
          description:
            "Discover unique facts and attributes that make Kaduna State a vibrant region in Nigeria",
          url: "https://betterkaduna.com/facts",
          publisher: {
            "@type": "Organization",
            name: "Better Kaduna",
            url: "https://betterkaduna.com",
          },
          mainEntity: {
            "@type": "Place",
            name: "Kaduna State",
            description:
              "Kaduna State is located in northern Nigeria and is known as the Centre of Learning",
            address: {
              "@type": "PostalAddress",
              addressRegion: "Kaduna",
              addressCountry: "NG",
            },
          },
        })}
      </script>

      {/* Hero Section */}
      <div className="relative bg-[#1A5D1A] text-white py-24 overflow-hidden">
        {/* Creative background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 border-2 border-white rounded-full"></div>
          <div className="absolute top-20 right-20 w-24 h-24 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-20 left-20 w-20 h-20 border-2 border-white rounded-full"></div>
          <div className="absolute bottom-10 right-10 w-16 h-16 border-2 border-white rounded-full"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 border-2 border-white rounded-full"></div>
        </div>
        <div className="relative container mx-auto px-4 text-center">
          <p className="text-6xl text-white md:text-7xl font-bold font-lora mb-6 animate-fade-in">
            Facts About Kaduna State
          </p>
          <p className="mt-8 text-2xl max-w-4xl mx-auto leading-relaxed animate-fade-in-delay font-light">
            Discover the unique attributes that make Kaduna State a vibrant and
            dynamic region in Nigeria, blending rich history, diverse culture,
            and natural beauty.
          </p>
          <div className="mt-12 flex justify-center space-x-6">
            <div className="w-20 h-1 bg-white rounded-full"></div>
            <div className="w-20 h-1 bg-white bg-opacity-60 rounded-full"></div>
            <div className="w-20 h-1 bg-white bg-opacity-30 rounded-full"></div>
          </div>
        </div>
      </div>

      {/* Facts Grid */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {facts.map((fact, index) => (
            <div
              key={fact.id}
              className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-500 border border-gray-100 group animate-fade-in-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center mb-4">
                <div className="text-4xl mr-4 group-hover:scale-110 transition-transform duration-300">
                  {fact.icon}
                </div>
                <div>
                  <h3 className="text-xl font-bold text-kaduna-gray group-hover:text-kaduna-green transition-colors duration-300">
                    {fact.title}
                  </h3>
                  <div className="w-12 h-1 bg-kaduna-green rounded-full mt-1"></div>
                </div>
              </div>
              <p className="text-gray-600 leading-relaxed">{fact.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FactsAboutKaduna;
