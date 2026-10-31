const User = require('../models/User');
const Category = require('../models/Category');
const Position = require('../models/Position');
const News = require('../models/News');

const initialCategories = [
  { name: 'National', nameHindi: 'राष्ट्रीय', slug: 'national', order: 1, description: 'देशभर की प्रमुख खबरें' },
  { name: 'State (Bihar)', nameHindi: 'बिहार', slug: 'bihar', order: 2, description: 'बिहार राज्य की ताजा घटनाएं' },
  { name: 'Seemanchal Special', nameHindi: 'सीमांचल विशेष', slug: 'seemanchal-special', order: 3, description: 'किशनगंज, पूर्णिया, अररिया, कटिहार की प्रमुख खबरें' },
  { name: 'Politics', nameHindi: 'राजनीति', slug: 'politics', order: 4, description: 'राजनीतिक हलचल और विश्लेषण' },
  { name: 'Crime', nameHindi: 'अपराध', slug: 'crime', order: 5, description: 'कानून व्यवस्था और पुलिस प्रशासन' },
  { name: 'Education', nameHindi: 'शिक्षा व करियर', slug: 'education', order: 6, description: 'स्कूल, कॉलेज, नौकरियां और प्रतियोगिताएं' },
  { name: 'Sports', nameHindi: 'खेल', slug: 'sports', order: 7, description: 'क्रिकेट, फुटबॉल और स्थानीय खेल' },
  { name: 'Business', nameHindi: 'कारोबार', slug: 'business', order: 8, description: 'व्यापार, बाजार और अर्थव्यवस्था' },
  { name: 'Health & Lifestyle', nameHindi: 'स्वास्थ्य व समाज', slug: 'health', order: 9, description: 'जनस्वास्थ्य, समाज और कल्याण' },
];

const initialPositions = [
  // A. National Executive Committee
  { title: 'National President', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 1 },
  { title: 'National Vice Presidents', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '2', order: 2 },
  { title: 'National General Secretary', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 3 },
  { title: 'National Joint Secretaries', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '2', order: 4 },
  { title: 'National Organization Secretary', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 5 },
  { title: 'National Treasurer', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 6 },
  { title: 'National Program Coordinator', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 7 },
  { title: 'National Membership Coordinator', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 8 },
  { title: 'National Media & Communication Coordinator', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 9 },
  { title: 'National Women’s Coordinator', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 10 },
  { title: 'National Youth Coordinator', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '1', order: 11 },
  { title: 'National Executive Members', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: '5–11', order: 12 },
  { title: 'Advisory Board Member', committeeLevel: 'National', committeeName: 'A. National Executive Committee', maxSeats: 'As needed', order: 13 },

  // B. State Executive Committee
  { title: 'State President', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 14 },
  { title: 'State Vice President', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1–2', order: 15 },
  { title: 'State General Secretary', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 16 },
  { title: 'State Joint Secretary', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1–2', order: 17 },
  { title: 'State Organization Secretary', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 18 },
  { title: 'State Treasurer', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 19 },
  { title: 'State Program Coordinator', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 20 },
  { title: 'State Membership Coordinator', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 21 },
  { title: 'State Women’s Coordinator', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 22 },
  { title: 'State Youth Coordinator', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 23 },
  { title: 'State Media Coordinator', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '1', order: 24 },
  { title: 'State Executive Members', committeeLevel: 'State', committeeName: 'B. State Executive Committee', maxSeats: '5–9', order: 25 },

  // C. District Executive Committee
  { title: 'District President', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 26 },
  { title: 'District Vice President', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 27 },
  { title: 'District General Secretary', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 28 },
  { title: 'District Joint Secretary', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 29 },
  { title: 'District Organization Secretary', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 30 },
  { title: 'District Treasurer', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 31 },
  { title: 'District Program Coordinator', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 32 },
  { title: 'District Membership Coordinator', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 33 },
  { title: 'District Women’s Coordinator', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 34 },
  { title: 'District Youth Coordinator', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '1', order: 35 },
  { title: 'District Executive Members', committeeLevel: 'District', committeeName: 'C. District Executive Committee', maxSeats: '3–7', order: 36 },

  // D. Block / Taluka Committee
  { title: 'Block President', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 37 },
  { title: 'Block Vice President', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 38 },
  { title: 'Block Secretary', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 39 },
  { title: 'Block Joint Secretary', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 40 },
  { title: 'Block Treasurer', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 41 },
  { title: 'Block Organization Coordinator', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 42 },
  { title: 'Block Program Coordinator', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 43 },
  { title: 'Block Membership Coordinator', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 44 },
  { title: 'Block Women’s Coordinator', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 45 },
  { title: 'Block Youth Coordinator', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '1', order: 46 },
  { title: 'Block Executive Members', committeeLevel: 'Block', committeeName: 'D. Block / Taluka Committee', maxSeats: '3–5', order: 47 },

  // E. Gram Panchayat Committee
  { title: 'Panchayat President / Coordinator', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 48 },
  { title: 'Deputy Coordinator', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 49 },
  { title: 'Panchayat Secretary', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 50 },
  { title: 'Assistant Secretary', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 51 },
  { title: 'Treasurer', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 52 },
  { title: 'Education & Health Coordinator', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 53 },
  { title: 'Women’s Coordinator', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 54 },
  { title: 'Youth Coordinator', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '1', order: 55 },
  { title: 'Executive Members', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: '3–5', order: 56 },
  { title: 'Volunteers', committeeLevel: 'Panchayat', committeeName: 'E. Gram Panchayat Committee', maxSeats: 'As required', order: 57 },

  // F. Ward Committee
  { title: 'Ward In-charge / President', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: '1', order: 58 },
  { title: 'Ward Secretary', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: '1', order: 59 },
  { title: 'Assistant Secretary', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: '1', order: 60 },
  { title: 'Membership Coordinator', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: '1', order: 61 },
  { title: 'Women’s / Youth Coordinator', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: 'As needed', order: 62 },
  { title: 'Ward Executive Members', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: '2–5', order: 63 },
  { title: 'Ward Volunteers', committeeLevel: 'Ward', committeeName: 'F. Ward Committee', maxSeats: 'As required', order: 64 },

  // Reporters & Press
  { title: 'Chief Bureau / Senior Reporter', committeeLevel: 'Press', committeeName: 'Editorial & Field Reporting Team', maxSeats: 'Open', order: 65 },
  { title: 'District Bureau Chief', committeeLevel: 'Press', committeeName: 'Editorial & Field Reporting Team', maxSeats: 'Open', order: 66 },
  { title: 'Special Correspondent', committeeLevel: 'Press', committeeName: 'Editorial & Field Reporting Team', maxSeats: 'Open', order: 67 },
  { title: 'Reporter / Correspondent', committeeLevel: 'Press', committeeName: 'Editorial & Field Reporting Team', maxSeats: 'Open', order: 68 },
];

const seedDatabase = async () => {
  try {
    // 1. Seed Categories
    const categoryCount = await Category.countDocuments();
    if (categoryCount === 0) {
      await Category.insertMany(initialCategories);
      console.log('Categories seeded successfully.');
    }

    // 2. Seed Positions
    const positionCount = await Position.countDocuments();
    if (positionCount === 0) {
      await Position.insertMany(initialPositions);
      console.log('Positions hierarchy seeded successfully.');
    }

    // 3. Seed Admin
    const adminExists = await User.findOne({ email: 'admin@seemanchalexpress.in' });
    let adminUser = adminExists;
    if (!adminExists) {
      adminUser = await User.create({
        name: 'Seemanchal Express Admin',
        email: 'admin@seemanchalexpress.in',
        phone: '9871023184',
        password: 'Admin@123456',
        role: 'admin',
        status: 'approved',
        committeeLevel: 'National',
        assignedDesignation: 'Chief Editor & Administrator',
        assignedLocation: 'New Delhi HQ',
        idCardNumber: 'SE-ADM-001',
        showOnTeamPage: true,
        address: {
          street: 'F 65, Shaheen Bagh, Okhla',
          state: 'New Delhi',
          pincode: '110025',
        },
      });
      console.log('Default Admin user created (admin@seemanchalexpress.in / Admin@123456).');
    }

    // 4. Seed sample approved team members if none exist
    const approvedCount = await User.countDocuments({ showOnTeamPage: true, role: 'member' });
    if (approvedCount === 0) {
      await User.create([
        {
          name: 'Janab Md. Tariq Anwer',
          email: 'tariq.anwer@seemanchalexpress.in',
          phone: '9871023180',
          password: 'Member@123456',
          role: 'member',
          status: 'approved',
          committeeLevel: 'National',
          assignedDesignation: 'National President',
          assignedLocation: 'National HQ, New Delhi',
          idCardNumber: 'SE-MEM-2026-001',
          showOnTeamPage: true,
          photo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
          bio: 'Senior social worker and community advocate with 25+ years in public service.',
          address: { street: 'Shaheen Bagh', district: 'South East Delhi', state: 'Delhi', pincode: '110025' },
        },
        {
          name: 'Er. Rajesh Kumar Sharma',
          email: 'rajesh.sharma@seemanchalexpress.in',
          phone: '9871023181',
          password: 'Member@123456',
          role: 'member',
          status: 'approved',
          committeeLevel: 'National',
          assignedDesignation: 'National General Secretary',
          assignedLocation: 'National HQ, New Delhi',
          idCardNumber: 'SE-MEM-2026-002',
          showOnTeamPage: true,
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
          bio: 'Dedicated public coordinator and policy researcher working across North India.',
          address: { street: 'Okhla', district: 'South East Delhi', state: 'Delhi', pincode: '110025' },
        },
        {
          name: 'Smt. Fatima Zohra',
          email: 'fatima.zohra@seemanchalexpress.in',
          phone: '9871023182',
          password: 'Member@123456',
          role: 'member',
          status: 'approved',
          committeeLevel: 'State',
          assignedDesignation: 'State President',
          assignedLocation: 'Patna, Bihar',
          idCardNumber: 'SE-MEM-2026-003',
          showOnTeamPage: true,
          photo: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&auto=format&fit=crop&q=80',
          bio: 'Educationist and social reform activist leading grassroots empowerment in Bihar.',
          address: { street: 'Fraser Road', district: 'Patna', state: 'Bihar', pincode: '800001' },
        },
        {
          name: 'Advocate Akhtar Hussain',
          email: 'akhtar.kishanganj@seemanchalexpress.in',
          phone: '9871023183',
          password: 'Member@123456',
          role: 'member',
          status: 'approved',
          committeeLevel: 'District',
          assignedDesignation: 'District President',
          assignedLocation: 'Kishanganj, Bihar',
          idCardNumber: 'SE-MEM-2026-004',
          showOnTeamPage: true,
          photo: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&auto=format&fit=crop&q=80',
          bio: 'Legal activist championing rights and civic infrastructure in Kishanganj.',
          address: { street: 'Court Road', district: 'Kishanganj', state: 'Bihar', pincode: '855107' },
        },
      ]);
      console.log('Sample committee leaders seeded.');
    }

    // 5. Seed sample news
    const newsCount = await News.countDocuments();
    if (newsCount === 0) {
      const seemanchalCat = await Category.findOne({ slug: 'seemanchal-special' });
      const biharCat = await Category.findOne({ slug: 'bihar' });
      const nationalCat = await Category.findOne({ slug: 'national' });
      const educationCat = await Category.findOne({ slug: 'education' });

      await News.create([
        {
          title: 'Demand Surges for Comprehensive Flood Control & Modern Infrastructure Package Across Seemanchal',
          slug: 'seemanchal-flood-control-infrastructure-special-package-demand',
          subtitle: 'Community leaders and stakeholders in Kishanganj, Purnea, Katihar, and Araria call for sustainable river basin revitalization.',
          category: seemanchalCat ? seemanchalCat._id : null,
          categoryName: 'Seemanchal Special',
          content: `<p>Social leaders, public intellectuals, and representatives across the Seemanchal region—comprising Kishanganj, Araria, Purnea, and Katihar—have jointly petitioned the Central and State Governments for a dedicated economic and flood mitigation infrastructure package.</p>
          <p>Each monsoon season, swelling waters from the Mahananda, Kankai, Mechi, Parman, and Bakra river systems impact thousands of rural families, submerging fertile agricultural acreage and causing soil erosion. Regional representatives emphasized that modern dredging, reinforced embankments, and climate-resilient waterways are paramount to securing long-term regional development.</p>
          <p>In addition, public forums highlighted the imperative for advanced healthcare centers, modernized diagnostic facilities, and vocational academic institutions to empower local youth.</p>`,
          thumbnail: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1000&auto=format&fit=crop&q=80',
          tags: ['Seemanchal', 'Flood Control', 'Kishanganj', 'Purnea', 'Araria', 'Development'],
          author: adminUser._id,
          authorName: 'Seemanchal Express Bureau',
          location: 'Kishanganj, Bihar',
          status: 'published',
          isBreaking: true,
          isFeatured: true,
          views: 1420,
        },
        {
          title: 'Commercial Flight Operations to Commence Soon at Purnea Airport as Civil Aviation Ministry Finalizes Preparations',
          slug: 'purnea-airport-commercial-flights-updates',
          subtitle: 'Over 20 million residents across Seemanchal and Kosi to benefit from direct air connectivity to New Delhi and Kolkata.',
          category: biharCat ? biharCat._id : null,
          categoryName: 'State (Bihar)',
          content: `<p>Residents across northeastern Bihar received milestone news as planning for scheduled commercial flights at Purnea Airport reached its advanced deployment phase. Civil aviation authorities confirmed that land handovers and perimeter security guidelines for the interim civil enclave are nearing completion.</p>
          <p>With terminal construction and passenger amenities progressing on expedited schedules, direct passenger connections connecting Purnea to Delhi, Kolkata, and Patna are slated to open within the upcoming financial quarter, significantly lowering travel times for trade, healthcare, and higher education.</p>`,
          thumbnail: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1000&auto=format&fit=crop&q=80',
          tags: ['Purnea Airport', 'Aviation', 'Seemanchal', 'Connectivity', 'Infrastructure'],
          author: adminUser._id,
          authorName: 'Seemanchal Express Correspondent',
          location: 'Purnea, Bihar',
          status: 'published',
          isBreaking: true,
          isFeatured: true,
          views: 980,
        },
        {
          title: 'New Digital Learning Hubs Launched Across Rural Schools Under National Education Framework',
          slug: 'digital-learning-centers-launched-in-schools',
          subtitle: 'Equipping young minds with computer literacy, coding bootcamps, and national competitive test prep facilities.',
          category: educationCat ? educationCat._id : null,
          categoryName: 'Education',
          content: `<p>A series of modern digital learning centers equipped with high-speed internet, computerized workstations, and interactive e-learning modules have officially launched across rural clusters in eastern Bihar and adjoining border districts.</p>
          <p>The program aims to bridge the digital divide by offering underprivileged students access to foundational STEM education, coding workshops, and curated test preparation for national engineering, medical, and civil services entrance examinations.</p>`,
          thumbnail: 'https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=1000&auto=format&fit=crop&q=80',
          tags: ['Education', 'Digital India', 'Students', 'Skill Development'],
          author: adminUser._id,
          authorName: 'Seemanchal Express Education Desk',
          location: 'New Delhi',
          status: 'published',
          isBreaking: false,
          isFeatured: false,
          views: 650,
        },
        {
          title: 'Seemanchal Express Announces Grassroots Journalism Initiative and Press Accreditations',
          slug: 'grassroots-journalism-initiative-correspondents',
          subtitle: 'Empowering local correspondents and citizen reporters across blocks and panchayats with certified press credentials.',
          category: nationalCat ? nationalCat._id : null,
          categoryName: 'National',
          content: `<p>In a groundbreaking move to elevate hyper-local news coverage, Seemanchal Express has officially opened its citizen journalism accreditation drive. Individuals dedicated to objective investigative reporting, village development advocacy, and social welfare can now submit their credentials for official press identification and digital editorial publishing rights.</p>`,
          thumbnail: 'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=1000&auto=format&fit=crop&q=80',
          tags: ['Press', 'Journalism', 'Seemanchal Express', 'Citizen Media'],
          author: adminUser._id,
          authorName: 'Central Editorial Board',
          location: 'New Delhi HQ',
          status: 'published',
          isBreaking: true,
          isFeatured: false,
          views: 820,
        },
      ]);
      console.log('Sample news published.');
    }
  } catch (err) {
    console.error('Error during database seed:', err.message);
  }
};

module.exports = { seedDatabase, initialCategories, initialPositions };
