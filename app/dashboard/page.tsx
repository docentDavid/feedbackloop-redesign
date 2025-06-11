"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

const students = [
  {
    name: "Daan de Vries",
    email: "d.devries@student.fontys.nl",
    studentId: "S1001234",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    name: "Lieke Bakker",
    email: "l.bakker@student.fontys.nl",
    studentId: "S1001235",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    name: "Tim van Dijk",
    email: "t.vandijk@student.fontys.nl",
    studentId: "S1001236",
    avatar: "https://randomuser.me/api/portraits/men/45.jpg",
  },
  {
    name: "Sanne Jansen",
    email: "s.jansen@student.fontys.nl",
    studentId: "S1001237",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    name: "Niels Visser",
    email: "n.visser@student.fontys.nl",
    studentId: "S1001238",
    avatar: "https://randomuser.me/api/portraits/men/67.jpg",
  },
  {
    name: "Femke Smit",
    email: "f.smit@student.fontys.nl",
    studentId: "S1001239",
    avatar: "https://randomuser.me/api/portraits/women/68.jpg",
  },
  {
    name: "Bram Vermeulen",
    email: "b.vermeulen@student.fontys.nl",
    studentId: "S1001240",
    avatar: "https://randomuser.me/api/portraits/men/69.jpg",
  },
  {
    name: "Eva Mulder",
    email: "e.mulder@student.fontys.nl",
    studentId: "S1001241",
    avatar: "https://randomuser.me/api/portraits/women/70.jpg",
  },
  {
    name: "Ruben de Jong",
    email: "r.dejong@student.fontys.nl",
    studentId: "S1001242",
    avatar: "https://randomuser.me/api/portraits/men/71.jpg",
  },
  {
    name: "Lisa van den Berg",
    email: "l.vandenberg@student.fontys.nl",
    studentId: "S1001243",
    avatar: "https://randomuser.me/api/portraits/women/72.jpg",
  },
  {
    name: "Jasper Willems",
    email: "j.willems@student.fontys.nl",
    studentId: "S1001244",
    avatar: "https://randomuser.me/api/portraits/men/106.jpg",
  },
  {
    name: "Sophie Peters",
    email: "s.peters@student.fontys.nl",
    studentId: "S1001245",
    avatar: "https://randomuser.me/api/portraits/women/107.jpg",
  },
  {
    name: "Tom van Leeuwen",
    email: "t.vanleeuwen@student.fontys.nl",
    studentId: "S1001246",
    avatar: "https://randomuser.me/api/portraits/men/108.jpg",
  },
  {
    name: "Mila Vos",
    email: "m.vos@student.fontys.nl",
    studentId: "S1001247",
    avatar: "https://randomuser.me/api/portraits/women/109.jpg",
  },
  {
    name: "Rick de Groot",
    email: "r.degroot@student.fontys.nl",
    studentId: "S1001248",
    avatar: "https://randomuser.me/api/portraits/men/110.jpg",
  },
  {
    name: "Julia Kuipers",
    email: "j.kuipers@student.fontys.nl",
    studentId: "S1001249",
    avatar: "https://randomuser.me/api/portraits/women/111.jpg",
  },
  {
    name: "Max van Dam",
    email: "m.vandam@student.fontys.nl",
    studentId: "S1001250",
    avatar: "https://randomuser.me/api/portraits/men/112.jpg",
  },
  {
    name: "Emma de Boer",
    email: "e.deboer@student.fontys.nl",
    studentId: "S1001251",
    avatar: "https://randomuser.me/api/portraits/women/113.jpg",
  },
  {
    name: "Lars Smits",
    email: "l.smits@student.fontys.nl",
    studentId: "S1001252",
    avatar: "https://randomuser.me/api/portraits/men/114.jpg",
  },
  {
    name: "Tessa Jacobs",
    email: "t.jacobs@student.fontys.nl",
    studentId: "S1001253",
    avatar: "https://randomuser.me/api/portraits/women/115.jpg",
  },
  {
    name: "Dylan van der Meer",
    email: "d.vandermeer@student.fontys.nl",
    studentId: "S1001254",
    avatar: "https://randomuser.me/api/portraits/men/116.jpg",
  },
  {
    name: "Noa de Wit",
    email: "n.dewit@student.fontys.nl",
    studentId: "S1001255",
    avatar: "https://randomuser.me/api/portraits/women/117.jpg",
  },
  {
    name: "Jelle Bakker",
    email: "j.bakker@student.fontys.nl",
    studentId: "S1001256",
    avatar: "https://randomuser.me/api/portraits/men/118.jpg",
  },
  {
    name: "Saar van Dongen",
    email: "s.vandongen@student.fontys.nl",
    studentId: "S1001257",
    avatar: "https://randomuser.me/api/portraits/women/119.jpg",
  },
  {
    name: "Mats de Bruin",
    email: "m.debruin@student.fontys.nl",
    studentId: "S1001258",
    avatar: "https://randomuser.me/api/portraits/men/120.jpg",
  },
  {
    name: "Fleur Smit",
    email: "f.smit2@student.fontys.nl",
    studentId: "S1001259",
    avatar: "https://randomuser.me/api/portraits/women/121.jpg",
  },
  {
    name: "Joris van Vliet",
    email: "j.vanvliet@student.fontys.nl",
    studentId: "S1001260",
    avatar: "https://randomuser.me/api/portraits/men/122.jpg",
  },
  {
    name: "Lotte de Jong",
    email: "l.dejong@student.fontys.nl",
    studentId: "S1001261",
    avatar: "https://randomuser.me/api/portraits/women/123.jpg",
  },
  {
    name: "Pim van der Linden",
    email: "p.vanderlinden@student.fontys.nl",
    studentId: "S1001262",
    avatar: "https://randomuser.me/api/portraits/men/124.jpg",
  },
  {
    name: "Sven de Graaf",
    email: "s.degraaf@student.fontys.nl",
    studentId: "S1001263",
    avatar: "https://randomuser.me/api/portraits/men/125.jpg",
  },
  {
    name: "Nina van den Heuvel",
    email: "n.vandenheuvel@student.fontys.nl",
    studentId: "S1001264",
    avatar: "https://randomuser.me/api/portraits/women/126.jpg",
  },
  {
    name: "Ahmed El Amrani",
    email: "a.elamrani@student.fontys.nl",
    studentId: "S1001265",
    avatar: "https://randomuser.me/api/portraits/men/94.jpg",
  },
  {
    name: "Yasmin Benali",
    email: "y.benali@student.fontys.nl",
    studentId: "S1001266",
    avatar: "https://randomuser.me/api/portraits/women/95.jpg",
  },
  {
    name: "Omar Al-Farsi",
    email: "o.alfarsi@student.fontys.nl",
    studentId: "S1001267",
    avatar: "https://randomuser.me/api/portraits/men/96.jpg",
  },
  {
    name: "Ayşe Yılmaz",
    email: "a.yilmaz@student.fontys.nl",
    studentId: "S1001268",
    avatar: "https://randomuser.me/api/portraits/women/97.jpg",
  },
  {
    name: "Mehmet Kaya",
    email: "m.kaya@student.fontys.nl",
    studentId: "S1001269",
    avatar: "https://randomuser.me/api/portraits/men/98.jpg",
  },
  {
    name: "Fatima Zahra",
    email: "f.zahra@student.fontys.nl",
    studentId: "S1001270",
    avatar: "https://randomuser.me/api/portraits/women/99.jpg",
  },
  {
    name: "James Smith",
    email: "j.smith@student.fontys.nl",
    studentId: "S1001271",
    avatar: "https://randomuser.me/api/portraits/men/100.jpg",
  },
  {
    name: "Emily Johnson",
    email: "e.johnson@student.fontys.nl",
    studentId: "S1001272",
    avatar: "https://randomuser.me/api/portraits/women/101.jpg",
  },
  {
    name: "Pierre Dubois",
    email: "p.dubois@student.fontys.nl",
    studentId: "S1001273",
    avatar: "https://randomuser.me/api/portraits/men/102.jpg",
  },
  {
    name: "Sophie Lefevre",
    email: "s.lefevre@student.fontys.nl",
    studentId: "S1001274",
    avatar: "https://randomuser.me/api/portraits/women/103.jpg",
  },
  {
    name: "Giulia Rossi",
    email: "g.rossi@student.fontys.nl",
    studentId: "S1001275",
    avatar: "https://randomuser.me/api/portraits/women/104.jpg",
  },
  {
    name: "Carlos García",
    email: "c.garcia@student.fontys.nl",
    studentId: "S1001276",
    avatar: "https://randomuser.me/api/portraits/men/105.jpg",
  },
];

const classOptions = [
  "Media - Semester 2 - Tilburg",
  "Media Semester 3 - Tilburg",
  "Main - Front End Development - Tilburg",
  "Main - Front End Development - Eindhoven",
] as const;
type ClassType = (typeof classOptions)[number];

// Helper om unieke avatars te genereren (0-99)
function getAvatar(gender: "men" | "women", idx: number) {
  return `https://randomuser.me/api/portraits/${gender}/${idx % 100}.jpg`;
}

// Unieke studenten per klas, met geldige avatars (0-99)
const classStudents: Record<
  ClassType,
  Array<{ name: string; email: string; studentId: string; avatar: string }>
> = {
  "Media - Semester 2 - Tilburg": [
    {
      name: "Daan de Vries",
      email: "daan.devries@student.fontys.nl",
      studentId: "S1002001",
      avatar: getAvatar("men", 1),
    },
    {
      name: "Lieke Bakker",
      email: "lieke.bakker@student.fontys.nl",
      studentId: "S1002002",
      avatar: getAvatar("women", 2),
    },
    {
      name: "Tim van Dijk",
      email: "tim.vandijk@student.fontys.nl",
      studentId: "S1002003",
      avatar: getAvatar("men", 3),
    },
    {
      name: "Sanne Jansen",
      email: "sanne.jansen@student.fontys.nl",
      studentId: "S1002004",
      avatar: getAvatar("women", 4),
    },
    {
      name: "Niels Visser",
      email: "niels.visser@student.fontys.nl",
      studentId: "S1002005",
      avatar: getAvatar("men", 5),
    },
    {
      name: "Femke Smit",
      email: "femke.smit@student.fontys.nl",
      studentId: "S1002006",
      avatar: getAvatar("women", 6),
    },
    {
      name: "Bram Vermeulen",
      email: "bram.vermeulen@student.fontys.nl",
      studentId: "S1002007",
      avatar: getAvatar("men", 7),
    },
    {
      name: "Eva Mulder",
      email: "eva.mulder@student.fontys.nl",
      studentId: "S1002008",
      avatar: getAvatar("women", 8),
    },
    {
      name: "Ruben de Jong",
      email: "ruben.dejong@student.fontys.nl",
      studentId: "S1002009",
      avatar: getAvatar("men", 9),
    },
    {
      name: "Lisa van Berg",
      email: "lisa.vberg@student.fontys.nl",
      studentId: "S1002010",
      avatar: getAvatar("women", 10),
    },
    {
      name: "Jasper Willems",
      email: "jasper.willems@student.fontys.nl",
      studentId: "S1002011",
      avatar: getAvatar("men", 11),
    },
    {
      name: "Sophie Peters",
      email: "sophie.peters@student.fontys.nl",
      studentId: "S1002012",
      avatar: getAvatar("women", 12),
    },
    {
      name: "Tom Leeuwen",
      email: "tom.leeuwen@student.fontys.nl",
      studentId: "S1002013",
      avatar: getAvatar("men", 13),
    },
    {
      name: "Mila Vos",
      email: "mila.vos@student.fontys.nl",
      studentId: "S1002014",
      avatar: getAvatar("women", 14),
    },
  ],
  "Media Semester 3 - Tilburg": [
    {
      name: "Rick de Groot",
      email: "r.degroot@student.fontys.nl",
      studentId: "S1002021",
      avatar: getAvatar("men", 21),
    },
    {
      name: "Julia Kuipers",
      email: "j.kuipers@student.fontys.nl",
      studentId: "S1002022",
      avatar: getAvatar("women", 22),
    },
    {
      name: "Max van Dam",
      email: "m.vandam@student.fontys.nl",
      studentId: "S1002023",
      avatar: getAvatar("men", 23),
    },
    {
      name: "Emma de Boer",
      email: "e.deboer@student.fontys.nl",
      studentId: "S1002024",
      avatar: getAvatar("women", 24),
    },
    {
      name: "Lars Smits",
      email: "l.smits@student.fontys.nl",
      studentId: "S1002025",
      avatar: getAvatar("men", 25),
    },
    {
      name: "Tessa Jacobs",
      email: "t.jacobs@student.fontys.nl",
      studentId: "S1002026",
      avatar: getAvatar("women", 26),
    },
    {
      name: "Dylan van der Meer",
      email: "d.vandermeer@student.fontys.nl",
      studentId: "S1002027",
      avatar: getAvatar("men", 27),
    },
    {
      name: "Noa de Wit",
      email: "n.dewit@student.fontys.nl",
      studentId: "S1002028",
      avatar: getAvatar("women", 28),
    },
    {
      name: "Jelle Bakker",
      email: "j.bakker@student.fontys.nl",
      studentId: "S1002029",
      avatar: getAvatar("men", 29),
    },
    {
      name: "Saar van Dongen",
      email: "s.vandongen@student.fontys.nl",
      studentId: "S1002030",
      avatar: getAvatar("women", 30),
    },
    {
      name: "Mats de Bruin",
      email: "m.debruin@student.fontys.nl",
      studentId: "S1002031",
      avatar: getAvatar("men", 31),
    },
    {
      name: "Fleur Smit",
      email: "f.smit2@student.fontys.nl",
      studentId: "S1002032",
      avatar: getAvatar("women", 32),
    },
    {
      name: "Joris van Vliet",
      email: "j.vanvliet@student.fontys.nl",
      studentId: "S1002033",
      avatar: getAvatar("men", 33),
    },
    {
      name: "Lotte de Jong",
      email: "l.dejong@student.fontys.nl",
      studentId: "S1002034",
      avatar: getAvatar("women", 34),
    },
  ],
  "Main - Front End Development - Tilburg": [
    {
      name: "Pim van der Linden",
      email: "p.vanderlinden@student.fontys.nl",
      studentId: "S1002041",
      avatar: getAvatar("men", 41),
    },
    {
      name: "Sven de Graaf",
      email: "s.degraaf@student.fontys.nl",
      studentId: "S1002042",
      avatar: getAvatar("men", 42),
    },
    {
      name: "Nina van den Heuvel",
      email: "n.vandenheuvel@student.fontys.nl",
      studentId: "S1002043",
      avatar: getAvatar("women", 43),
    },
    {
      name: "Ahmed El Amrani",
      email: "a.elamrani@student.fontys.nl",
      studentId: "S1002044",
      avatar: getAvatar("men", 44),
    },
    {
      name: "Yasmin Benali",
      email: "y.benali@student.fontys.nl",
      studentId: "S1002045",
      avatar: getAvatar("women", 45),
    },
    {
      name: "Omar Al-Farsi",
      email: "o.alfarsi@student.fontys.nl",
      studentId: "S1002046",
      avatar: getAvatar("men", 46),
    },
    {
      name: "Ayşe Yılmaz",
      email: "a.yilmaz@student.fontys.nl",
      studentId: "S1002047",
      avatar: getAvatar("women", 47),
    },
    {
      name: "Mehmet Kaya",
      email: "m.kaya@student.fontys.nl",
      studentId: "S1002048",
      avatar: getAvatar("men", 48),
    },
    {
      name: "Fatima Zahra",
      email: "f.zahra@student.fontys.nl",
      studentId: "S1002049",
      avatar: getAvatar("women", 49),
    },
    {
      name: "James Smith",
      email: "j.smith@student.fontys.nl",
      studentId: "S1002050",
      avatar: getAvatar("men", 50),
    },
    {
      name: "Emily Johnson",
      email: "e.johnson@student.fontys.nl",
      studentId: "S1002051",
      avatar: getAvatar("women", 51),
    },
    {
      name: "Pierre Dubois",
      email: "p.dubois@student.fontys.nl",
      studentId: "S1002052",
      avatar: getAvatar("men", 52),
    },
    {
      name: "Sophie Lefevre",
      email: "s.lefevre@student.fontys.nl",
      studentId: "S1002053",
      avatar: getAvatar("women", 53),
    },
    {
      name: "Giulia Rossi",
      email: "g.rossi@student.fontys.nl",
      studentId: "S1002054",
      avatar: getAvatar("women", 54),
    },
  ],
  "Main - Front End Development - Eindhoven": [
    {
      name: "Carlos García",
      email: "c.garcia@student.fontys.nl",
      studentId: "S1002061",
      avatar: getAvatar("men", 61),
    },
    {
      name: "Maria Fernandez",
      email: "m.fernandez@student.fontys.nl",
      studentId: "S1002062",
      avatar: getAvatar("women", 62),
    },
    {
      name: "Ali Hassan",
      email: "a.hassan@student.fontys.nl",
      studentId: "S1002063",
      avatar: getAvatar("men", 63),
    },
    {
      name: "Sofia Romano",
      email: "s.romano@student.fontys.nl",
      studentId: "S1002064",
      avatar: getAvatar("women", 64),
    },
    {
      name: "John Brown",
      email: "j.brown@student.fontys.nl",
      studentId: "S1002065",
      avatar: getAvatar("men", 65),
    },
    {
      name: "Amina El Idrissi",
      email: "a.elidrissi@student.fontys.nl",
      studentId: "S1002066",
      avatar: getAvatar("women", 66),
    },
    {
      name: "Lucas Moreau",
      email: "l.moreau@student.fontys.nl",
      studentId: "S1002067",
      avatar: getAvatar("men", 67),
    },
    {
      name: "Sara Bianchi",
      email: "s.bianchi@student.fontys.nl",
      studentId: "S1002068",
      avatar: getAvatar("women", 68),
    },
    {
      name: "Mohammed Bouzid",
      email: "m.bouzid@student.fontys.nl",
      studentId: "S1002069",
      avatar: getAvatar("men", 69),
    },
    {
      name: "Emma Dubois",
      email: "e.dubois@student.fontys.nl",
      studentId: "S1002070",
      avatar: getAvatar("women", 70),
    },
    {
      name: "David Wilson",
      email: "d.wilson@student.fontys.nl",
      studentId: "S1002071",
      avatar: getAvatar("men", 71),
    },
    {
      name: "Fatma Yildiz",
      email: "f.yildiz@student.fontys.nl",
      studentId: "S1002072",
      avatar: getAvatar("women", 72),
    },
    {
      name: "Hugo Martin",
      email: "h.martin@student.fontys.nl",
      studentId: "S1002073",
      avatar: getAvatar("men", 73),
    },
    {
      name: "Isabella Costa",
      email: "i.costa@student.fontys.nl",
      studentId: "S1002074",
      avatar: getAvatar("women", 74),
    },
  ],
};

// Sorteer op achternaam
const getLastName = (name: string) =>
  name.split(" ").slice(-1)[0].toLowerCase();

const studentsPerPageOptions = [10, 20, 40, "All"] as const;
type StudentsPerPage = (typeof studentsPerPageOptions)[number];

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState<ClassType>(
    "Main - Front End Development - Tilburg"
  );
  const [studentsPerPage, setStudentsPerPage] = useState<StudentsPerPage>(10);
  const [page, setPage] = useState(1);
  const router = useRouter();

  // Sorteer de studenten van de geselecteerde klas op achternaam
  const sortedStudents = [...classStudents[selectedClass]].sort((a, b) => {
    return getLastName(a.name).localeCompare(getLastName(b.name));
  });

  const perPage =
    studentsPerPage === "All" ? sortedStudents.length : studentsPerPage;
  const totalPages = Math.ceil(sortedStudents.length / perPage);
  const paginatedStudents = sortedStudents.slice(
    (page - 1) * perPage,
    page * perPage
  );

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 mt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Student Feedback Dashboard
      </h1>
      {/* Klas selectie */}
      <div className="mt-8 mb-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">
          Select a class
        </h2>
        <div className="relative inline-block w-full max-w-md w-80 mb-4">
          <select
            id="classSelect"
            className="appearance-none border rounded px-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
            value={selectedClass}
            onChange={(e) => {
              setSelectedClass(e.target.value as ClassType);
              setPage(1);
            }}
          >
            {classOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
            <svg
              className="h-4 w-4 text-gray-400"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <h2 className="text-lg font-medium text-gray-900">Select a student</h2>
        <div>
          <label className="sr-only" htmlFor="studentsPerPage">
            Show
          </label>
          <div className="relative inline-block w-full max-w-xs">
            <select
              id="studentsPerPage"
              className="appearance-none border rounded px-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
              value={studentsPerPage}
              onChange={(e) => {
                const value =
                  e.target.value === "All"
                    ? "All"
                    : (Number(e.target.value) as StudentsPerPage);
                setStudentsPerPage(value);
                setPage(1);
              }}
            >
              {studentsPerPageOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? "All" : `Show: ${opt} students`}
                </option>
              ))}
            </select>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
              <svg
                className="h-4 w-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {paginatedStudents.map((student, index) => (
          <button
            key={index}
            className="flex items-center gap-4 border rounded-lg p-4 bg-gray-50 hover:bg-blue-50 transition w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400"
            onClick={() =>
              router.push(
                `/record?class=${encodeURIComponent(
                  selectedClass
                )}&student=${encodeURIComponent(student.studentId)}`
              )
            }
            type="button"
          >
            <img
              src={student.avatar}
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border"
            />
            <div>
              <h3 className="text-base font-semibold text-gray-900">
                {student.name}
              </h3>
              <p className="block max-w-[200px] overflow-hidden text-ellipsis whitespace-nowrap text-sm text-gray-600">
                {student.email}
              </p>
              <p className="text-xs text-gray-400">{student.studentId}</p>
            </div>
          </button>
        ))}
      </div>
      {/* Pagination */}
      {studentsPerPage !== "All" && (
        <div className="flex justify-center items-center gap-2">
          <button
            className="px-2 py-1 rounded border text-gray-500 disabled:opacity-50"
            onClick={() => setPage(page - 1)}
            disabled={page === 1}
          >
            &lt;
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`px-3 py-1 rounded border ${
                page === i + 1
                  ? "bg-blue-50 border-blue-500 text-blue-600 font-medium"
                  : "text-gray-700"
              }`}
              onClick={() => setPage(i + 1)}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="px-2 py-1 rounded border text-gray-500 disabled:opacity-50"
            onClick={() => setPage(page + 1)}
            disabled={page === totalPages}
          >
            &gt;
          </button>
        </div>
      )}
    </div>
  );
}
