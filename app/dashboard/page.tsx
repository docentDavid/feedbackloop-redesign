"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";

const studentsPerPageOptions = [12, 24, 48, "All"] as const;
type StudentsPerPage = (typeof studentsPerPageOptions)[number];

// Helper function to get last name for sorting
const getLastName = (name: string) =>
  name.split(" ").slice(-1)[0].toLowerCase();

export default function Dashboard() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentsPerPage, setStudentsPerPage] = useState<StudentsPerPage>(12);
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState<string[]>([]);
  const [students, setStudents] = useState<
    Array<{ name: string; email: string; studentId: string; avatar: string }>
  >([]);
  const router = useRouter();

  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase.from("classes").select("name");
      if (error) {
        console.error("Error fetching classes:", error);
      } else {
        setClasses(data.map((c) => c.name));
        // Only set the default class if no class is currently selected
        if (!selectedClass) {
          const defaultClass = data.find((c) =>
            c.name.includes("Front End Development")
          );
          setSelectedClass(
            defaultClass ? defaultClass.name : data[0]?.name || ""
          );
        }
      }
    };

    const fetchStudents = async () => {
      if (!selectedClass) return;
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id")
        .eq("name", selectedClass)
        .single();

      if (classError || !classData) {
        console.error("Error fetching class:", classError);
        return;
      }

      const { data, error } = await supabase
        .from("students")
        .select("name, email, student_id, avatar")
        .eq("class_id", classData.id);

      if (error) {
        console.error("Error fetching students:", error);
      } else {
        setStudents(
          data.map((s) => ({
            name: s.name,
            email: s.email,
            studentId: s.student_id,
            avatar: s.avatar,
          }))
        );
      }
    };

    fetchClasses();
    if (selectedClass) {
      fetchStudents();
    }
  }, [selectedClass]);

  // Sort students by last name
  const sortedStudents = [...students].sort((a, b) => {
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
      {/* Class selection */}
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
              setSelectedClass(e.target.value);
              setPage(1);
            }}
          >
            {classes.map((opt) => (
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
            onClick={() => {
              const url = `/record?class=${encodeURIComponent(
                selectedClass
              )}&student=${encodeURIComponent(student.studentId)}`;
              console.log("Navigating to:", url); // Debug log
              router.push(url);
            }}
            type="button"
          >
            <img
              src={
                student.avatar ||
                "https://randomuser.me/api/portraits/lego/1.jpg"
              }
              alt={student.name}
              className="w-14 h-14 rounded-full object-cover border flex-shrink-0"
            />
            <div className="min-w-0 flex-1">
              <h3 className="text-base font-semibold text-gray-900 truncate">
                {student.name}
              </h3>
              <p className="text-sm text-gray-600 truncate">{student.email}</p>
              <p className="text-xs text-gray-400 truncate">
                {student.studentId}
              </p>
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
