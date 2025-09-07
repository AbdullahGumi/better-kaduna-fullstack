// prisma/seed.js - Seed database with meaningful Kaduna-related content
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcrypt");

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seeding...");

  // Create users with different roles
  const users = [
    {
      id: "user-admin-001",
      name: "Abdul Gumi",
      email: "abdulgumi77@gmail.com",
      password: "admin123",
      role: "admin",
    },
    {
      id: "user-editor-001",
      name: "Sarah Johnson",
      email: "sarah.johnson@kadunanews.com",
      password: "editor123",
      role: "editor",
    },
    {
      id: "user-editor-002",
      name: "Ibrahim Musa",
      email: "ibrahim.musa@kadunanews.com",
      password: "editor123",
      role: "editor",
    },
    {
      id: "user-registered-001",
      name: "Amina Hassan",
      email: "amina.hassan@gmail.com",
      password: "user123",
      role: "registered",
    },
    {
      id: "user-registered-002",
      name: "Emmanuel Okon",
      email: "emmanuel.okon@yahoo.com",
      password: "user123",
      role: "registered",
    },
    {
      id: "user-registered-003",
      name: "Fatima Abubakar",
      email: "fatima.abubakar@outlook.com",
      password: "user123",
      role: "registered",
    },
  ];

  console.log("👥 Creating users...");
  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);
    await prisma.user.upsert({
      where: { id: user.id },
      update: {},
      create: {
        id: user.id,
        name: user.name,
        email: user.email,
        password: hashedPassword,
        role: user.role,
        createdAt: new Date(),
      },
    });
  }

  // Create posts about Kaduna
  const posts = [
    {
      id: "post-kaduna-history-001",
      title:
        "The Rich History of Kaduna: From Colonial Capital to Modern Metropolis",
      content: `<p>Kaduna State, located in the heart of Nigeria, has a fascinating history that spans centuries. Established in 1967 as one of Nigeria's original 12 states, Kaduna has served as a pivotal center for administration, commerce, and culture.</p>

<p><strong>The Colonial Era</strong></p>
<p>During the British colonial period, Kaduna was chosen as the capital of the Northern Region due to its strategic location and cooler climate compared to Lagos. The city became a hub for railway transportation, connecting the north with the coastal regions and facilitating trade in agricultural products like groundnuts, cotton, and hides.</p>

<img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop" alt="Kaduna Railway Station - Historical colonial architecture" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Post-Independence Development</strong></p>
<p>After Nigeria's independence in 1960, Kaduna continued to play a crucial role in the nation's development. The city became known as Nigeria's "Center of Learning" due to its numerous educational institutions, including Ahmadu Bello University, one of Nigeria's premier universities.</p>

<img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop" alt="Ahmadu Bello University - Nigeria's premier educational institution" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Modern Kaduna</strong></p>
<p>Today, Kaduna State is a vibrant economic powerhouse, home to diverse ethnic groups including Hausa, Fulani, Yoruba, and Igbo communities. The state boasts a rich cultural heritage, modern infrastructure, and a growing technology sector.</p>

<img src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop" alt="Modern Kaduna skyline showcasing urban development" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>Kaduna's transformation from a colonial administrative center to a modern, multicultural metropolis reflects Nigeria's journey toward unity and progress. The city's blend of traditional values with contemporary development makes it a fascinating case study in urban evolution.</p>`,
      author: "Sarah Johnson",
      date: new Date("2025-01-15"),
      thumbnail:
        "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop",
    },
    {
      id: "post-kaduna-economy-002",
      title: "Kaduna's Economic Renaissance: From Agriculture to Technology",
      content: `<p>Kaduna State is experiencing a remarkable economic transformation, evolving from an agriculture-dependent economy to a diversified powerhouse that embraces both traditional and modern industries.</p>

<p><strong>Agricultural Heritage</strong></p>
<p>The state's fertile lands have long supported agriculture, with crops like maize, rice, sorghum, and vegetables thriving in the region. Kaduna remains one of Nigeria's most important agricultural states, contributing significantly to the nation's food security.</p>

<img src="https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?w=800&h=400&fit=crop" alt="Kaduna farmlands showcasing agricultural productivity" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Manufacturing Excellence</strong></p>
<p>Kaduna is home to several industrial estates and manufacturing companies, including the renowned Peugeot Automobile Nigeria plant. The state has become a manufacturing hub, producing everything from textiles and pharmaceuticals to building materials.</p>

<img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop" alt="Modern manufacturing facilities in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Technology and Innovation</strong></p>
<p>In recent years, Kaduna has emerged as a technology center, with initiatives like the Kaduna Innovation Hub fostering entrepreneurship and digital innovation. The state's young population and growing number of universities are driving a new wave of tech startups and digital services.</p>

<img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop" alt="Kaduna Innovation Hub - Technology and startup ecosystem" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Infrastructure Development</strong></p>
<p>Major infrastructure projects, including the ongoing Kaduna-Kano Expressway modernization and new industrial parks, are positioning Kaduna as a gateway for trade between northern and southern Nigeria.</p>

<img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800&h=400&fit=crop" alt="Modern infrastructure and transportation in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>This economic evolution demonstrates Kaduna's adaptability and forward-thinking approach to development, making it a model for other Nigerian states.</p>`,
      author: "Ibrahim Musa",
      date: new Date("2025-01-20"),
      thumbnail:
        "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800&h=400&fit=crop",
    },
    {
      id: "post-kaduna-culture-003",
      title:
        "Celebrating Kaduna's Cultural Diversity: A Tapestry of Traditions",
      content: `<p>Kaduna State is a living museum of Nigeria's cultural diversity, where different ethnic groups, languages, and traditions coexist in harmonious celebration.</p>

<p><strong>Ethnic Mosaic</strong></p>
<p>The state is home to over 60 ethnic groups, with the Hausa-Fulani, Yoruba, Igbo, and Gbagyi communities being the most prominent. This diversity creates a rich cultural landscape where festivals, ceremonies, and traditions blend seamlessly.</p>

<img src="https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop" alt="Kaduna's diverse ethnic communities celebrating together" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Festivals and Celebrations</strong></p>
<p>Kaduna hosts numerous cultural festivals throughout the year. The Durbar Festival, with its colorful horse parades and traditional drumming, showcases the martial heritage of the northern emirates. The Igbo New Yam Festival and various Islamic celebrations add to the cultural calendar.</p>

<img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop" alt="Traditional Durbar Festival with horse parades in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Culinary Heritage</strong></p>
<p>The state's cuisine reflects its diversity, from the spicy northern delicacies like suya and masa to the sophisticated Yoruba dishes and the hearty Igbo soups. Kaduna's food scene is a delicious journey through Nigeria's culinary traditions.</p>

<img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop" alt="Traditional Kaduna cuisine and local food market" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Arts and Crafts</strong></p>
<p>Traditional crafts thrive in Kaduna, with skilled artisans producing intricate leatherwork, pottery, and textiles. The state's museums and cultural centers preserve and showcase this artistic heritage.</p>

<img src="https://images.unsplash.com/photo-1452860606245-08befc0ff44b?w=800&h=400&fit=crop" alt="Traditional crafts and artisans in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Modern Cultural Fusion</strong></p>
<p>Today's Kaduna blends traditional values with contemporary expressions. Music, fashion, and art scenes reflect both local traditions and global influences, creating a unique cultural identity that continues to evolve.</p>

<img src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=400&fit=crop" alt="Modern cultural fusion in Kaduna's contemporary art scene" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>This cultural richness makes Kaduna not just a geographical location, but a living testament to Nigeria's unity in diversity.</p>`,
      author: "Sarah Johnson",
      date: new Date("2025-01-25"),
      thumbnail:
        "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop",
    },
    {
      id: "post-kaduna-tourism-004",
      title: "Exploring Kaduna's Hidden Gems: Tourism Beyond the Ordinary",
      content: `<p>Beyond its urban bustle, Kaduna State offers visitors a wealth of natural attractions, historical sites, and cultural experiences that make it a compelling tourist destination.</p>

<p><strong>Historical Landmarks</strong></p>
<p>The Lord Lugard House, former residence of Nigeria's first Governor-General, stands as a testament to the colonial era. The Nigerian Railway Museum chronicles the history of rail transportation in West Africa, while the Museum of Traditional Nigerian Architecture showcases the region's building heritage.</p>

<img src="https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop" alt="Lord Lugard House - Historical colonial residence in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Natural Wonders</strong></p>
<p>Kaduna's landscape features the scenic Zaria Gorge and the picturesque Kajuru Castle, built on a massive rock outcrop. The Shiroro Dam and its hydroelectric plant offer stunning views and recreational opportunities.</p>

<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" alt="Zaria Gorge - Natural wonder in Kaduna State" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Cultural Sites</strong></p>
<p>The Emir's Palace in Zaria, with its intricate architecture and historical significance, provides insight into traditional northern Nigerian royalty. The National Museum in Kaduna houses artifacts that tell the story of Nigeria's diverse cultural heritage.</p>

<img src="https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800&h=400&fit=crop" alt="Emir's Palace in Zaria showcasing traditional architecture" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Adventure and Recreation</strong></p>
<p>For adventure seekers, the Gurara Falls and the scenic hills around Kaduna offer hiking and nature exploration. The state's game reserves provide opportunities for wildlife viewing and photography.</p>

<img src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=400&fit=crop" alt="Gurara Falls - Adventure destination in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Culinary Tourism</strong></p>
<p>Kaduna's food scene is a major draw, with local restaurants offering authentic northern Nigerian cuisine. The famous Kaduna suya and local spice markets provide unforgettable culinary experiences.</p>

<img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=400&fit=crop" alt="Kaduna's famous suya and local cuisine" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>Whether you're interested in history, nature, culture, or simply good food, Kaduna offers a rich tapestry of experiences that will leave lasting memories.</p>`,
      author: "Ibrahim Musa",
      date: new Date("2025-01-30"),
      thumbnail:
        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&h=400&fit=crop",
    },
    {
      id: "post-kaduna-education-005",
      title: "Kaduna: Nigeria's Educational Capital and Innovation Hub",
      content: `<p>Kaduna State has earned its reputation as Nigeria's "Center of Learning" through a remarkable concentration of educational institutions and research centers that drive academic excellence and innovation.</p>

<p><strong>Academic Excellence</strong></p>
<p>The state is home to Ahmadu Bello University (ABU), one of Nigeria's most prestigious universities, known for its research in agriculture, medicine, and engineering. Kaduna Polytechnic and numerous colleges of education contribute to a comprehensive educational ecosystem.</p>

<img src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop" alt="Ahmadu Bello University campus in Zaria" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Research and Innovation</strong></p>
<p>The National Research Institute for Chemical Technology (NARICT) and other research institutions drive scientific advancement. The Kaduna Innovation Hub, supported by the Tony Elumelu Foundation, nurtures entrepreneurship and technological innovation among young people.</p>

<img src="https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&h=400&fit=crop" alt="Kaduna Innovation Hub - Fostering entrepreneurship and tech innovation" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Technical Education</strong></p>
<p>Kaduna's technical colleges and vocational training centers prepare students for careers in manufacturing, construction, and technology. The Nigerian College of Aviation Technology trains aviation professionals for the growing aerospace industry.</p>

<img src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800&h=400&fit=crop" alt="Technical education and vocational training in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Digital Transformation</strong></p>
<p>The state's universities are at the forefront of digital education, with online learning platforms and partnerships with international institutions. Kaduna is becoming a hub for coding bootcamps, tech meetups, and digital skills training.</p>

<img src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&h=400&fit=crop" alt="Digital education and coding bootcamps in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Future Leaders</strong></p>
<p>Kaduna's educational institutions are producing the next generation of Nigerian leaders in business, politics, science, and the arts. The state's commitment to education ensures that its human capital remains one of its greatest assets.</p>

<img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=400&fit=crop" alt="Young leaders and innovators from Kaduna's educational institutions" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>As Nigeria's educational capital, Kaduna continues to shape the future of the nation through knowledge, innovation, and human development.</p>`,
      author: "Sarah Johnson",
      date: new Date("2025-02-05"),
      thumbnail:
        "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&h=400&fit=crop",
    },
    {
      id: "post-kaduna-healthcare-006",
      title:
        "Healthcare Excellence in Kaduna: Advancing Medical Care and Research",
      content: `<p>Kaduna State is making significant strides in healthcare delivery, combining modern medical facilities with community health initiatives to serve its growing population.</p>

<p><strong>Medical Infrastructure</strong></p>
<p>The state boasts several modern hospitals and medical centers, including the prestigious Ahmadu Bello University Teaching Hospital. These facilities provide comprehensive healthcare services ranging from primary care to specialized treatments.</p>

<img src="https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=400&fit=crop" alt="Ahmadu Bello University Teaching Hospital - Premier medical facility" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Medical Research</strong></p>
<p>Kaduna's medical institutions are actively involved in research on tropical diseases, maternal health, and community medicine. Partnerships with international organizations contribute to advancements in healthcare delivery and medical education.</p>

<img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800&h=400&fit=crop" alt="Medical research and laboratory facilities in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Community Health Programs</strong></p>
<p>The state's Primary Healthcare Development Agency runs extensive community health programs, focusing on immunization, maternal care, and disease prevention. Mobile health clinics bring essential services to rural communities.</p>

<img src="https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=800&h=400&fit=crop" alt="Community health programs and mobile clinics in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Specialized Care</strong></p>
<p>Kaduna offers specialized medical services in cardiology, oncology, orthopedics, and pediatrics. The state's eye care centers and dental clinics provide essential specialized treatments.</p>

<img src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?w=800&h=400&fit=crop" alt="Specialized medical care facilities in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p><strong>Healthcare Workforce</strong></p>
<p>The concentration of medical training institutions ensures a steady supply of qualified healthcare professionals. Kaduna's doctors, nurses, and medical technicians serve both local and national healthcare needs.</p>

<img src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=800&h=400&fit=crop" alt="Healthcare professionals and medical training in Kaduna" style="width: 100%; height: auto; margin: 20px 0; border-radius: 8px;">

<p>Through these comprehensive healthcare initiatives, Kaduna is setting standards for medical excellence and community health in Nigeria.</p>`,
      author: "Ibrahim Musa",
      date: new Date("2025-02-10"),
      thumbnail:
        "https://images.unsplash.com/photo-1551190822-a9333d879b1f?w=800&h=400&fit=crop",
    },
  ];

  console.log("📝 Creating posts...");
  for (const post of posts) {
    await prisma.post.upsert({
      where: { id: post.id },
      update: {},
      create: {
        id: post.id,
        title: post.title,
        content: post.content,
        author: post.author,
        date: post.date,
        thumbnail: post.thumbnail,
      },
    });
  }

  // Create events
  const events = [
    {
      id: "event-durbar-001",
      title: "Kaduna Durbar Festival 2025",
      description:
        "Experience the spectacular Durbar Festival featuring traditional horse parades, martial displays, and cultural performances. This annual celebration showcases the rich heritage of northern Nigeria's emirates with colorful processions, traditional drumming, and displays of horsemanship.",
      date: new Date("2025-03-15"),
      location: "Kaduna City Center",
    },
    {
      id: "event-innovation-002",
      title: "Kaduna Innovation Summit 2025",
      description:
        "Join entrepreneurs, investors, and innovators at the Kaduna Innovation Summit. This premier event brings together tech startups, established businesses, and industry leaders to explore opportunities in Nigeria's growing innovation ecosystem.",
      date: new Date("2025-04-20"),
      location: "Kaduna Innovation Hub",
    },
    {
      id: "event-agric-003",
      title: "Northern Nigeria Agricultural Expo",
      description:
        "Discover the latest in agricultural technology and practices at the Northern Nigeria Agricultural Expo. Featuring exhibitions of modern farming equipment, organic farming techniques, and opportunities for farmers to connect with suppliers and buyers.",
      date: new Date("2025-05-10"),
      location: "Kaduna International Trade Fair Complex",
    },
    {
      id: "event-culture-004",
      title: "Kaduna Cultural Heritage Festival",
      description:
        "Celebrate Kaduna's diverse cultural heritage with music, dance, art exhibitions, and culinary experiences from different ethnic groups. This festival promotes cultural understanding and showcases the artistic talents of Kaduna's communities.",
      date: new Date("2025-06-08"),
      location: "Sir Kashim Ibrahim House, Kaduna",
    },
    {
      id: "event-education-005",
      title: "Kaduna Education Excellence Awards",
      description:
        "Honoring outstanding achievements in education at the Kaduna Education Excellence Awards. This prestigious event recognizes teachers, students, and educational institutions making significant contributions to learning and development in Kaduna State.",
      date: new Date("2025-07-15"),
      location: "Ahmadu Bello University, Zaria",
    },
  ];

  console.log("📅 Creating events...");
  for (const event of events) {
    await prisma.event.upsert({
      where: { id: event.id },
      update: {},
      create: {
        id: event.id,
        title: event.title,
        description: event.description,
        date: event.date,
        location: event.location,
      },
    });
  }

  // Create comments on posts
  const comments = [
    {
      id: "comment-history-001",
      content:
        "Excellent article! As someone born and raised in Kaduna, I appreciate how you've captured the essence of our city's transformation. The railway museum is indeed a hidden gem that many visitors overlook.",
      userId: "user-registered-001",
      userName: "Amina Hassan",
      postId: "post-kaduna-history-001",
      eventId: null,
      parentId: null,
      createdAt: new Date("2025-01-16"),
    },
    {
      id: "comment-history-002",
      content:
        "I completely agree with Amina. The history section about the colonial era is particularly well-researched. Kaduna's role in Nigeria's development cannot be overstated.",
      userId: "user-registered-002",
      userName: "Emmanuel Okon",
      postId: "post-kaduna-history-001",
      eventId: null,
      parentId: "comment-history-001",
      createdAt: new Date("2025-01-17"),
    },
    {
      id: "comment-economy-001",
      content:
        "The economic transformation described here is inspiring. Kaduna's shift from traditional agriculture to a tech hub is exactly what Nigeria needs more of. The innovation initiatives are particularly promising.",
      userId: "user-registered-003",
      userName: "Fatima Abubakar",
      postId: "post-kaduna-economy-002",
      eventId: null,
      parentId: null,
      createdAt: new Date("2025-01-22"),
    },
    {
      id: "comment-culture-001",
      content:
        "Beautifully written piece on Kaduna's cultural diversity! The description of the Durbar Festival brings back wonderful memories. Kaduna truly represents Nigeria's unity in diversity.",
      userId: "user-registered-001",
      userName: "Amina Hassan",
      postId: "post-kaduna-culture-003",
      eventId: null,
      parentId: null,
      createdAt: new Date("2025-01-27"),
    },
    {
      id: "comment-tourism-001",
      content:
        "Great guide for tourists! I recently visited the Zaria Gorge and it was absolutely breathtaking. The Kajuru Castle is another must-see. Kaduna has so much to offer beyond what meets the eye.",
      userId: "user-registered-002",
      userName: "Emmanuel Okon",
      postId: "post-kaduna-tourism-004",
      eventId: null,
      parentId: null,
      createdAt: new Date("2025-02-02"),
    },
    {
      id: "comment-education-001",
      content:
        "As an educator, I'm proud of Kaduna's reputation as Nigeria's educational capital. ABU has produced some of Nigeria's finest minds. The innovation hub initiatives are exactly what young people need.",
      userId: "user-registered-003",
      userName: "Fatima Abubakar",
      postId: "post-kaduna-education-005",
      eventId: null,
      parentId: null,
      createdAt: new Date("2025-02-07"),
    },
  ];

  console.log("💬 Creating comments...");
  for (const comment of comments) {
    await prisma.comment.upsert({
      where: { id: comment.id },
      update: {},
      create: {
        id: comment.id,
        content: comment.content,
        userId: comment.userId,
        userName: comment.userName,
        postId: comment.postId,
        eventId: comment.eventId,
        parentId: comment.parentId,
        createdAt: comment.createdAt,
      },
    });
  }

  // Create contact messages
  const contacts = [
    {
      id: "contact-general-001",
      name: "John Smith",
      email: "john.smith@tourism-ng.com",
      message:
        "Hello! I'm planning a visit to Kaduna next month and would like more information about the Durbar Festival and recommended hotels. Could you please provide details about transportation from Abuja?",
      createdAt: new Date("2025-01-18"),
    },
    {
      id: "contact-business-002",
      name: "Grace Okafor",
      email: "grace@startupkaduna.com",
      message:
        "I'm interested in the Kaduna Innovation Hub programs. Could you provide information about incubation programs, mentorship opportunities, and how to apply for funding? We're developing an edtech startup focused on rural education.",
      createdAt: new Date("2025-01-25"),
    },
    {
      id: "contact-feedback-003",
      name: "Ahmed Ibrahim",
      email: "ahmed.ibrahim@kano.gov.ng",
      message:
        "Thank you for the excellent coverage of Kaduna's economic development. As someone working in inter-state commerce, I found the article about the Kaduna-Kano Expressway particularly insightful. Keep up the great work!",
      createdAt: new Date("2025-02-01"),
    },
  ];

  console.log("📧 Creating contact messages...");
  for (const contact of contacts) {
    await prisma.contact.upsert({
      where: { id: contact.id },
      update: {},
      create: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
        message: contact.message,
        createdAt: contact.createdAt,
      },
    });
  }

  console.log("✅ Database seeding completed successfully!");
  console.log("📊 Summary:");
  console.log(`   👥 ${users.length} users created`);
  console.log(`   📝 ${posts.length} posts created`);
  console.log(`   📅 ${events.length} events created`);
  console.log(`   💬 ${comments.length} comments created`);
  console.log(`   📧 ${contacts.length} contact messages created`);
}

main()
  .catch((e) => {
    console.error("❌ Error during seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
