"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../lib/supabase";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const studentsPerPageOptions = [12, 24, 48, "All"] as const;
type StudentsPerPage = (typeof studentsPerPageOptions)[number];

// Helper function to get last name for sorting
const getLastName = (name: string) =>
  name.split(" ").slice(-1)[0].toLowerCase();

export default function ProgressPage() {
  const [selectedClass, setSelectedClass] = useState<string>("");
  const [studentsPerPage, setStudentsPerPage] = useState<StudentsPerPage>(12);
  const [page, setPage] = useState(1);
  const [classes, setClasses] = useState<string[]>([]);
  const [students, setStudents] = useState<
    Array<{ name: string; email: string; studentId: string; avatar: string }>
  >([]);
  const [selectedStudent, setSelectedStudent] = useState<{
    name: string;
    email: string;
    studentId: string;
    avatar: string;
  } | null>(null);
  const [learningOutcomes, setLearningOutcomes] = useState<
    Array<{
      id: string;
      name: string;
      description: string;
    }>
  >([]);
  const [studentProgress, setStudentProgress] = useState<
    Array<{
      learning_outcome_id: string;
      progress_level: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chartData, setChartData] = useState<any>(null);
  const [feedbackMoments, setFeedbackMoments] = useState<
    Array<{
      id: string;
      name: string;
      date: string;
      teacher: string;
    }>
  >([]);
  const [progressHistory, setProgressHistory] = useState<
    Array<{
      feedback_moment_id: string;
      learning_outcome_id: string;
      progress_level: string;
    }>
  >([]);
  const router = useRouter();

  const getProgressValue = (level: string) => {
    const levels = { U: 0, O: 1, B: 2, P: 3, A: 4 };
    return levels[level as keyof typeof levels] || 0;
  };

  const chartOptions = {
    scales: {
      r: {
        min: 0,
        max: 4,
        ticks: {
          stepSize: 1,
          callback: function (this: any, tickValue: number | string) {
            const labels = ["U", "O", "B", "P", "A"];
            return labels[Number(tickValue)];
          },
        },
        pointLabels: {
          font: {
            size: 12,
            weight: "bold" as const,
          },
          callback: function (label: string) {
            return label.length > 20 ? label.substring(0, 20) + "..." : label;
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          title: function (context: any) {
            const outcome = learningOutcomes[context[0].dataIndex];
            return outcome?.name || "";
          },
          label: function (context: any) {
            const labels = [
              "Undefined",
              "Orienting",
              "Beginning",
              "Proficient",
              "Advanced",
            ];
            const outcome = learningOutcomes[context.dataIndex];
            return [
              `Current Level: ${labels[context.raw]}`,
              `Description: ${outcome?.description || ""}`,
            ];
          },
        },
      },
    },
  };

  // Update chart data when learning outcomes or student progress changes
  useEffect(() => {
    if (learningOutcomes.length > 0) {
      const newChartData = {
        labels: learningOutcomes.map((outcome) => outcome.name),
        datasets: [
          {
            label: "Current Progress",
            data: learningOutcomes.map((outcome) => {
              const progress = studentProgress.find(
                (p) => p.learning_outcome_id === outcome.id
              );
              return getProgressValue(progress?.progress_level || "U");
            }),
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
            pointBackgroundColor: "rgb(59, 130, 246)",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#fff",
            pointHoverBorderColor: "rgb(59, 130, 246)",
          },
        ],
      };
      setChartData(newChartData);
    } else {
      setChartData(null);
    }
  }, [learningOutcomes, studentProgress]);

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

  useEffect(() => {
    const fetchLearningOutcomes = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("learning_outcomes")
          .select("*");

        if (error) {
          console.error("Error fetching learning outcomes:", error);
          // Add dummy learning outcomes
          setLearningOutcomes([
            {
              id: "1",
              name: "Frontend Development",
              description:
                "Building responsive and interactive web applications",
            },
            {
              id: "2",
              name: "Backend Development",
              description: "Creating and managing server-side applications",
            },
            {
              id: "3",
              name: "Database Management",
              description: "Designing and implementing database solutions",
            },
            {
              id: "4",
              name: "Version Control",
              description: "Managing code versions and collaboration",
            },
            {
              id: "5",
              name: "Testing & Debugging",
              description: "Writing tests and fixing bugs",
            },
          ]);
        } else {
          console.log("Fetched learning outcomes:", data);
          setLearningOutcomes(data || []);
        }
      } catch (error) {
        console.error("Error fetching learning outcomes:", error);
        setLearningOutcomes([]);
      } finally {
        setIsLoading(false);
      }
    };

    const fetchStudentProgress = async () => {
      if (!selectedStudent) {
        setStudentProgress([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("student_progress")
          .select("learning_outcome_id, progress_level")
          .eq("student_id", selectedStudent.studentId);

        if (error) {
          console.error("Error fetching student progress:", error);
          // Add dummy current progress for Omar
          if (selectedStudent.name === "Omar Al-Farsi") {
            setStudentProgress([
              { learning_outcome_id: "1", progress_level: "P" },
              { learning_outcome_id: "2", progress_level: "A" },
              { learning_outcome_id: "3", progress_level: "P" },
              { learning_outcome_id: "4", progress_level: "A" },
              { learning_outcome_id: "5", progress_level: "P" },
            ]);
          } else {
            setStudentProgress([]);
          }
        } else {
          console.log("Fetched student progress:", data);
          setStudentProgress(data || []);
        }
      } catch (error) {
        console.error("Error fetching student progress:", error);
        setStudentProgress([]);
      }
    };

    fetchLearningOutcomes();
    fetchStudentProgress();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchFeedbackMoments = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback_moments")
          .select("*")
          .order("date", { ascending: true });

        if (error) {
          console.error("Error fetching feedback moments:", error);
          // Add dummy feedback moments with teachers
          setFeedbackMoments([
            {
              id: "1",
              name: "Portfolio 1",
              date: "2024-01-15",
              teacher: "John Smith",
            },
            {
              id: "2",
              name: "Portfolio 2",
              date: "2024-02-15",
              teacher: "Sarah Johnson",
            },
            {
              id: "3",
              name: "Portfolio 3",
              date: "2024-03-15",
              teacher: "Michael Brown",
            },
            {
              id: "4",
              name: "Portfolio 4",
              date: "2024-04-15",
              teacher: "Emma Wilson",
            },
          ]);
        } else {
          console.log("Fetched feedback moments:", data);
          setFeedbackMoments(data || []);
        }
      } catch (error) {
        console.error("Error fetching feedback moments:", error);
        setFeedbackMoments([]);
      }
    };

    const fetchProgressHistory = async () => {
      if (!selectedStudent) {
        setProgressHistory([]);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("student_progress")
          .select("feedback_moment_id, learning_outcome_id, progress_level")
          .eq("student_id", selectedStudent.studentId)
          .order("feedback_moment_id", { ascending: true });

        if (error) {
          console.error("Error fetching progress history:", error);
          // Add dummy progress data for Omar
          if (selectedStudent.name === "Omar Al-Farsi") {
            const dummyProgress = [
              // Initial Assessment
              {
                feedback_moment_id: "1",
                learning_outcome_id: "1",
                progress_level: "U",
              },
              {
                feedback_moment_id: "1",
                learning_outcome_id: "2",
                progress_level: "O",
              },
              {
                feedback_moment_id: "1",
                learning_outcome_id: "3",
                progress_level: "U",
              },
              {
                feedback_moment_id: "1",
                learning_outcome_id: "4",
                progress_level: "O",
              },
              {
                feedback_moment_id: "1",
                learning_outcome_id: "5",
                progress_level: "U",
              },
              // Mid-term Review
              {
                feedback_moment_id: "2",
                learning_outcome_id: "1",
                progress_level: "O",
              },
              {
                feedback_moment_id: "2",
                learning_outcome_id: "2",
                progress_level: "B",
              },
              {
                feedback_moment_id: "2",
                learning_outcome_id: "3",
                progress_level: "O",
              },
              {
                feedback_moment_id: "2",
                learning_outcome_id: "4",
                progress_level: "B",
              },
              {
                feedback_moment_id: "2",
                learning_outcome_id: "5",
                progress_level: "O",
              },
              // Final Assessment
              {
                feedback_moment_id: "3",
                learning_outcome_id: "1",
                progress_level: "B",
              },
              {
                feedback_moment_id: "3",
                learning_outcome_id: "2",
                progress_level: "P",
              },
              {
                feedback_moment_id: "3",
                learning_outcome_id: "3",
                progress_level: "B",
              },
              {
                feedback_moment_id: "3",
                learning_outcome_id: "4",
                progress_level: "P",
              },
              {
                feedback_moment_id: "3",
                learning_outcome_id: "5",
                progress_level: "B",
              },
              // End of Semester
              {
                feedback_moment_id: "4",
                learning_outcome_id: "1",
                progress_level: "P",
              },
              {
                feedback_moment_id: "4",
                learning_outcome_id: "2",
                progress_level: "A",
              },
              {
                feedback_moment_id: "4",
                learning_outcome_id: "3",
                progress_level: "P",
              },
              {
                feedback_moment_id: "4",
                learning_outcome_id: "4",
                progress_level: "A",
              },
              {
                feedback_moment_id: "4",
                learning_outcome_id: "5",
                progress_level: "P",
              },
            ];
            setProgressHistory(dummyProgress);
          } else {
            setProgressHistory([]);
          }
        } else {
          console.log("Fetched progress history:", data);
          setProgressHistory(data || []);
        }
      } catch (error) {
        console.error("Error fetching progress history:", error);
        setProgressHistory([]);
      }
    };

    fetchFeedbackMoments();
    fetchProgressHistory();
  }, [selectedStudent]);

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
        Student Progress Overview
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left column - Student selection */}
        <div className="lg:col-span-1">
          {/* Class selection */}
          <div className="mb-6">
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
                  setSelectedStudent(null);
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

          <div className="mb-4">
            <h2 className="text-lg font-medium text-gray-900 mb-4">
              Select a student
            </h2>
            <div className="mb-4">
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

          <div className="grid grid-cols-1 gap-4">
            {paginatedStudents.map((student, index) => (
              <button
                key={index}
                className={`flex items-center gap-4 border rounded-lg p-4 transition w-full text-left cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-400 ${
                  selectedStudent?.studentId === student.studentId
                    ? "bg-blue-50 border-blue-500"
                    : "bg-gray-50 hover:bg-blue-50"
                }`}
                onClick={() => setSelectedStudent(student)}
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
                  <p className="text-sm text-gray-600 truncate">
                    {student.email}
                  </p>
                  <p className="text-xs text-gray-400 truncate">
                    {student.studentId}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {/* Pagination */}
          {studentsPerPage !== "All" && (
            <div className="flex justify-center items-center gap-2 mt-4">
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

        {/* Right column - Student details */}
        <div className="lg:col-span-2">
          {selectedStudent ? (
            <div className="bg-white rounded-lg border p-6">
              <div className="flex items-center gap-6 mb-8">
                <img
                  src={
                    selectedStudent.avatar ||
                    "https://randomuser.me/api/portraits/lego/1.jpg"
                  }
                  alt={selectedStudent.name}
                  className="w-24 h-24 rounded-full object-cover border"
                />
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    {selectedStudent.name}
                  </h2>
                  <p className="text-gray-600">{selectedStudent.email}</p>
                  <p className="text-sm text-gray-500">
                    Student ID: {selectedStudent.studentId}
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {/* Progress History Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Progress History
                  </h3>
                  <div className="bg-white p-6 rounded-lg">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : feedbackMoments.length > 0 ? (
                      <div className="space-y-8">
                        {feedbackMoments.map((moment, index) => {
                          const momentProgress = progressHistory.filter(
                            (p) => p.feedback_moment_id === moment.id
                          );

                          return (
                            <div key={moment.id}>
                              {/* Header */}
                              <div className="mb-4">
                                <h4 className="text-base font-medium text-gray-900">
                                  {moment.name}
                                </h4>
                                <p className="text-sm text-gray-500">
                                  {moment.teacher} •{" "}
                                  {new Date(moment.date).toLocaleDateString()}
                                </p>
                              </div>

                              {/* Schedule Grid */}
                              <div>
                                {/* Header Row */}
                                <div className="grid grid-cols-6 gap-4 mb-2">
                                  <div className="col-span-2">
                                    <div className="text-sm font-medium text-gray-500">
                                      Learning Outcome
                                    </div>
                                  </div>
                                  <div className="col-span-4">
                                    <div className="grid grid-cols-5 gap-4">
                                      {["U", "O", "B", "P", "A"].map(
                                        (level) => (
                                          <div
                                            key={level}
                                            className="text-center"
                                          >
                                            <div className="text-sm font-medium text-gray-500">
                                              {level}
                                            </div>
                                          </div>
                                        )
                                      )}
                                    </div>
                                  </div>
                                </div>

                                {/* Learning Outcomes Rows */}
                                <div className="space-y-3">
                                  {learningOutcomes.map((outcome) => {
                                    const progress = momentProgress.find(
                                      (p) =>
                                        p.learning_outcome_id === outcome.id
                                    );
                                    const selectedLevel =
                                      progress?.progress_level || "U";

                                    return (
                                      <div
                                        key={outcome.id}
                                        className="grid grid-cols-6 gap-4 items-center"
                                      >
                                        {/* Learning Outcome Name */}
                                        <div className="col-span-2">
                                          <span className="text-sm font-medium text-gray-900 whitespace-nowrap">
                                            {outcome.name}
                                          </span>
                                        </div>
                                        {/* Score Boxes */}
                                        <div className="col-span-4">
                                          <div className="grid grid-cols-5 gap-4">
                                            {["U", "O", "B", "P", "A"].map(
                                              (level) => (
                                                <div
                                                  key={level}
                                                  className="text-center"
                                                >
                                                  <div
                                                    className={`h-8 rounded min-w-[40px] px-2 ${
                                                      level === selectedLevel
                                                        ? "bg-blue-50 text-blue-600 font-semibold"
                                                        : "bg-gray-50 text-gray-400"
                                                    } flex items-center justify-center`}
                                                  >
                                                    {level}
                                                  </div>
                                                </div>
                                              )
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No feedback moments available
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Learning Outcomes Section */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Current Progress
                  </h3>
                  <div className="bg-white p-6 rounded-lg border">
                    <div className="mb-6">
                      <p className="text-sm text-gray-600 mb-2">
                        This section shows the student's progress across all
                        learning outcomes.
                      </p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span className="font-medium">Progress Levels:</span>
                        {["U", "O", "B", "P", "A"].map((level, index) => (
                          <span key={level} className="flex items-center gap-1">
                            {level}
                            {index < 4 && (
                              <span className="text-gray-400">→</span>
                            )}
                          </span>
                        ))}
                      </div>
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                      </div>
                    ) : learningOutcomes.length > 0 ? (
                      <div className="space-y-3">
                        {learningOutcomes.map((outcome) => {
                          const progress = studentProgress.find(
                            (p) => p.learning_outcome_id === outcome.id
                          );
                          const level = progress?.progress_level || "U";
                          const levelNames = {
                            U: "Undefined",
                            O: "Orienting",
                            B: "Beginning",
                            P: "Proficient",
                            A: "Advanced",
                          };

                          return (
                            <div
                              key={outcome.id}
                              className="py-2 border-b border-gray-100 last:border-0"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <h4 className="text-base font-medium text-gray-900">
                                  {outcome.name}
                                </h4>
                                <span
                                  className={`px-2 py-0.5 rounded text-sm font-medium
                                  ${
                                    level === "U"
                                      ? "bg-gray-100 text-gray-600"
                                      : level === "O"
                                      ? "bg-blue-100 text-blue-600"
                                      : level === "B"
                                      ? "bg-yellow-100 text-yellow-600"
                                      : level === "P"
                                      ? "bg-green-100 text-green-600"
                                      : "bg-purple-100 text-purple-600"
                                  }`}
                                >
                                  {level} -{" "}
                                  {levelNames[level as keyof typeof levelNames]}
                                </span>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">
                                {outcome.description}
                              </p>
                              <div className="flex items-center gap-2">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${
                                      level === "U"
                                        ? "w-0"
                                        : level === "O"
                                        ? "w-1/4"
                                        : level === "B"
                                        ? "w-1/2"
                                        : level === "P"
                                        ? "w-3/4"
                                        : "w-full"
                                    } ${
                                      level === "U"
                                        ? "bg-gray-300"
                                        : level === "O"
                                        ? "bg-blue-400"
                                        : level === "B"
                                        ? "bg-yellow-400"
                                        : level === "P"
                                        ? "bg-green-400"
                                        : "bg-purple-400"
                                    }`}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">
                                  {level === "U"
                                    ? "0%"
                                    : level === "O"
                                    ? "25%"
                                    : level === "B"
                                    ? "50%"
                                    : level === "P"
                                    ? "75%"
                                    : "100%"}
                                </span>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No learning outcomes available
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 rounded-lg border p-8 text-center">
              <p className="text-gray-500">
                Select a student to view their progress
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
