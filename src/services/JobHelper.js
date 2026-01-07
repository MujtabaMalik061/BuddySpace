export const StatesCounts = {
  TotalJobs: 10,
  OpenJobs: 4,
  InProgress: 3,
  Completed: 3,
};

export const jobs = [
  {
    id: 1,
    title: "Kitchen Renovation",
    status: "Open",
    statusType: "open",
    description:
      "Complete kitchen remodel including cabinets, countertops, and appliances",
    customer: "Sarah Johnson",
    location: "Los Angeles, CA",
    budget: "$15,000",
    posted: "15/01/2024",
    category: "Home Improvement",
  },
  {
    id: 2,
    title: "Plumbing Repair",
    status: "In Progress",
    statusType: "progress",
    description: "Fix leaking pipes in bathroom and replace water heater",
    customer: "Michael Chen",
    contractor: "David Martinez",
    location: "San Francisco, CA",
    budget: "$800",
    posted: "18/01/2024",
    category: "Plumbing",
  },
  {
    id: 3,
    title: "Electrical Wiring",
    status: "Completed",
    statusType: "completed",
    description: "Install new electrical outlets and update circuit breaker",
    customer: "Emily Rodriguez",
    contractor: "James Thompson",
    location: "Austin, TX",
    budget: "$1,500",
    posted: "10/01/2024",
    completed: "20/01/2024",
    category: "Electrical",
  },
];

export const jobDetailData = [
  {
    id: 1,
    job: {
      title: "Kitchen Renovation",
      status: "Open",
      category: "Home Improvement",
      postedDate: "15/01/2024",
      budget: "$15,000",
      JobImages: [
        "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        "https://images.unsplash.com/photo-1551434678-e076c223a692",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        "https://images.unsplash.com/photo-1551434678-e076c223a692",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        "https://images.unsplash.com/photo-1551434678-e076c223a692",
        "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
        "https://images.unsplash.com/photo-1556761175-4b46a572b786",
        "https://images.unsplash.com/photo-1551434678-e076c223a692",
      ],
      description:
        "Complete kitchen remodel including cabinets, countertops, and appliances. Looking for experienced contractor with portfolio of similar projects.",
      requirements:
        "Replace cabinets, install granite countertops, upgrade appliances, install lighting, update plumbing. Timeline 6–8 weeks.",
      location: "1234 Sunset Blvd, Los Angeles, CA 90028",
    },

    customer: {
      name: "Sarah Johnson",
      initials: "SJ",
      memberSince: "15/06/2023",
      email: "sarah.johnson@email.com",
      phone: "+1 (555) 123-4567",
      totalJobs: 3,
    },

    timeline: [{ label: "Job Posted", date: "15/01/2024" }],

    bids: [
      {
        id: 101,
        company: "Mike Construction",
        initials: "MC",
        rating: 4.8,
        jobs: 127,
        price: "$18,500",
        duration: "6 weeks",
        proposal:
          "I have over 10 years of experience in kitchen renovations. I can provide custom cabinets and ensure quality installation.",
        submitted: "16/01/2024",
      },
    ],
  },

  {
    id: 2,
    job: {
      title: "Bathroom Remodeling",
      status: "In Progress",
      category: "Home Improvement",
      postedDate: "01/12/2023",
      budget: "$8,000",
      description:
        "Full bathroom renovation including tiles, fixtures, and vanity.",
      requirements:
        "Replace tiles, install new vanity, update plumbing, install shower enclosure.",
      location: "890 Market St, San Francisco, CA 94103",
    },

    customer: {
      name: "David Miller",
      initials: "DM",
      memberSince: "20/03/2022",
      email: "david.miller@email.com",
      phone: "+1 (555) 987-6543",
      totalJobs: 5,
    },

    contractor: {
      name: "David Martinez",
      initials: "DM",
      memberSince: "10/03/2022",
      email: "david.martinez@contractor.com",
      phone: "+1 (555) 321-7890",
      totalJobs: 8,
      rating: 3.4,
    },

    timeline: [
      { label: "Job Posted", date: "01/12/2023" },
      { label: "Work Started", date: "10/12/2023" },
    ],

    bids: [
      {
        id: 201,
        company: "Urban Build Co.",
        rating: 4.6,
        jobs: 89,
        price: "$10,500",
        duration: "4 weeks",
        proposal:
          "Experienced bathroom renovation team. Quality materials and on-time delivery.",
        submitted: "03/12/2023",
      },
    ],
  },

  {
    id: 3,
    job: {
      title: "Living Room Interior Design",
      status: "Completed",
      category: "Interior Design",
      postedDate: "10/01/2024",
      startedDate: "12/01/2024",
      completedDate: "20/01/2024",
      budget: "$5,000",
      finalAmount: "$1,750",
      description:
        "Modern living room redesign including furniture and lighting.",
      requirements:
        "New furniture layout, modern lighting, wall paint, and decor.",
      location: "456 Palm Ave, Miami, FL 33101",
      reviews: [
        {
          review:
            "Excellent work! James was professional, on time, and did a fantastic job. Highly recommend!",
          rating: 3,
        },
      ],
    },

    customer: {
      name: "Emily Carter",
      initials: "EC",
      memberSince: "11/08/2021",
      email: "emily.carter@email.com",
      phone: "+1 (555) 321-7890",
      totalJobs: 8,
    },

    contractor: {
      name: "David Martinez",
      initials: "DM",
      memberSince: "10/03/2022",
      email: "david.martinez@contractor.com",
      phone: "+1 (555) 321-7890",
      totalJobs: 8,
      rating: 3.4,
    },

    timeline: [
      { label: "Job Posted", date: "01/12/2023" },
      { label: "Work Started", date: "10/12/2023" },
      { label: "Job Completed", date: "20/01/2024" },
    ],

    bids: [
      {
        id: 301,
        company: "DesignPro Studio",
        rating: 4.9,
        jobs: 214,
        price: "$6,200",
        duration: "3 weeks",
        proposal: "Specialized in modern interiors with premium finishes.",
        submitted: "07/10/2023",
      },
    ],
  },
];
