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

console.log("=== DEBUG: ProgressPage loaded, code is up to date ===");

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
      title: string;
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
  const [feedbacks, setFeedbacks] = useState<
    Array<{
      id: number;
      student_id: string;
      learning_outcome_id: string;
      feedback_moment_id: string;
      reviewer: string;
      feedback: string;
      feedforward: string;
      created_at: string;
    }>
  >([]);
  const router = useRouter();

  const sortedFeedbackMoments = [...feedbackMoments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const [momentPage, setMomentPage] = useState(0); // 0 = latest
  const currentMoment = sortedFeedbackMoments[momentPage] || null;

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
            return outcome?.title || "";
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
        labels: learningOutcomes.map((outcome) => outcome.title),
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
        let classId = null;
        if (selectedClass) {
          // Fetch the id for the selected class
          const { data: classData, error: classError } = await supabase
            .from("classes")
            .select("id")
            .eq("name", selectedClass)
            .single();
          if (classError) {
            console.error("Error fetching class id:", classError);
          } else {
            classId = classData?.id;
          }
        }
        let learningOutcomesData = [];
        if (classId) {
          // Fetch learning outcomes for the class
          const { data, error } = await supabase
            .from("learning_outcomes")
            .select("*")
            .eq("class_id", classId);
          if (error) {
            console.error("Error fetching learning outcomes:", error);
            learningOutcomesData = [];
          } else {
            learningOutcomesData = data || [];
          }
        } else {
          // Fallback: fetch all if no classId
          const { data, error } = await supabase
            .from("learning_outcomes")
            .select("*");
          if (error) {
            console.error("Error fetching learning outcomes:", error);
            learningOutcomesData = [];
          } else {
            learningOutcomesData = data || [];
          }
        }
        setLearningOutcomes(learningOutcomesData);
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
          setStudentProgress([]);
        } else {
          console.log("Fetched student progress:", data);
          setStudentProgress(data || []);
        }
      } catch (error) {
        console.error("Error in student progress operations:", error);
        setStudentProgress([]);
      }
    };

    fetchLearningOutcomes();
    fetchStudentProgress();
  }, [selectedStudent]);

  const fetchProgressHistory = async () => {
    try {
      if (!selectedStudent) {
        setProgressHistory([]);
        return;
      }

      const studentId = selectedStudent.studentId;
      const { data: studentData, error: studentError } = await supabase
        .from("student_progress")
        .select("*")
        .eq("student_id", studentId);

      if (studentError) {
        console.error("Error fetching student progress:", studentError);
        setProgressHistory([]);
        return;
      }

      if (!studentData || studentData.length === 0) {
        setProgressHistory([]);
        return;
      }

      const formattedData = studentData.map((item) => ({
        feedback_moment_id: String(item.feedback_moment_id),
        learning_outcome_id: String(item.learning_outcome_id),
        progress_level: item.progress_level,
      }));

      setProgressHistory(formattedData);
    } catch (error) {
      console.error("Error in progress history operations:", error);
      setProgressHistory([]);
    }
  };

  useEffect(() => {
    const fetchFeedbackMoments = async () => {
      try {
        const { data, error } = await supabase
          .from("feedback_moments")
          .select("*")
          .order("date", { ascending: true });

        if (error) {
          console.error("Error fetching feedback moments:", error);
          setFeedbackMoments([]);
        } else {
          setFeedbackMoments(data || []);
        }
      } catch (error) {
        console.error("Error fetching feedback moments:", error);
        setFeedbackMoments([]);
      }
    };

    fetchFeedbackMoments();
    fetchProgressHistory();
  }, [selectedStudent]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      if (!selectedStudent || !currentMoment) {
        setFeedbacks([]);
        return;
      }
      const { data, error } = await supabase
        .from("student_feedback")
        .select("*")
        .eq("student_id", selectedStudent.studentId)
        .eq("feedback_moment_id", currentMoment.id);
      if (error) {
        setFeedbacks([]);
        console.error("Error fetching student feedback:", error);
      } else {
        setFeedbacks(data || []);
      }
    };
    fetchFeedbacks();
  }, [selectedStudent, currentMoment]);

  // Sort students by last name
  const sortedStudents = [...students].sort((a, b) => {
    return getLastName(a.name).localeCompare(getLastName(b.name));
  });

  // Sort learning outcomes: LO1 first, then the rest in order
  const sortedLearningOutcomes = [...learningOutcomes].sort((a, b) => {
    const getLO = (title: string) => {
      const match = title.match(/LO(\d+)/i);
      return match ? parseInt(match[1], 10) : 99;
    };
    const aLO = getLO(a.title);
    const bLO = getLO(b.title);
    if (aLO === 1) return -1;
    if (bLO === 1) return 1;
    return aLO - bLO;
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
                className="appearance-none border rounded px-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
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
              <div className="relative inline-block w-full max-w-md w-80">
                <select
                  id="studentsPerPage"
                  className="appearance-none border rounded px-4 pr-10 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 w-full cursor-pointer"
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
                onClick={() => {
                  setSelectedStudent(student);
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
                  {/* Pagination Controls */}
                  {sortedFeedbackMoments.length > 1 && (
                    <div className="flex justify-between items-center my-8">
                      <button
                        className="cursor-pointer px-3 py-1 rounded border text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        onClick={() =>
                          setMomentPage((p) =>
                            Math.min(sortedFeedbackMoments.length - 1, p + 1)
                          )
                        }
                        disabled={
                          momentPage === sortedFeedbackMoments.length - 1
                        }
                      >
                        Previous
                      </button>
                      <span className="text-sm text-gray-700">
                        {`Moment ${
                          sortedFeedbackMoments.length - momentPage
                        } of ${sortedFeedbackMoments.length}`}
                      </span>
                      <button
                        className="cursor-pointer px-3 py-1 rounded border text-gray-500 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                        onClick={() => setMomentPage((p) => Math.max(0, p - 1))}
                        disabled={momentPage === 0}
                      >
                        Next
                      </button>
                    </div>
                  )}

                  {/* Moment label moved above the title */}
                  {(() => {
                    const moment = currentMoment;
                    if (!moment) return null;
                    return (
                      <div className="mb-4">
                        <h4 className="text-base font-medium text-gray-900">
                          {moment.name} -{" "}
                          {new Date(moment.date).toLocaleDateString()}
                        </h4>
                      </div>
                    );
                  })()}

                  <h3 className="text-lg font-semibold text-gray-900 mt-8">
                    Progress Overview
                  </h3>

                  <div className="bg-white p-6 rounded-lg">
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : sortedFeedbackMoments.length > 0 && currentMoment ? (
                      <div>
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
                                {["U", "O", "B", "P", "A"].map((level) => (
                                  <div key={level} className="text-center">
                                    <div className="text-sm font-medium text-gray-500">
                                      {level}
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                          {/* Learning Outcomes Rows */}
                          <div className="space-y-3">
                            {sortedLearningOutcomes.map((outcome) => {
                              // Find progress for this learning outcome in current moment
                              const progress = progressHistory.find(
                                (p) =>
                                  String(p.learning_outcome_id) ===
                                    String(outcome.id) &&
                                  String(p.feedback_moment_id) ===
                                    String(currentMoment?.id)
                              );

                              // Log the match attempt with more detail
                              console.log(
                                `Looking for match - LO: ${outcome.id}, Moment: ${currentMoment?.id}`,
                                {
                                  progressHistory,
                                  currentMoment,
                                  outcome,
                                  found: progress,
                                  matchCriteria: {
                                    learning_outcome_id: String(outcome.id),
                                    feedback_moment_id: String(
                                      currentMoment?.id
                                    ),
                                  },
                                }
                              );

                              return (
                                <div
                                  key={outcome.id}
                                  className="grid grid-cols-6 gap-4 items-center"
                                >
                                  {/* Learning Outcome Title */}
                                  <div className="col-span-2 min-w-[220px] relative group">
                                    <span
                                      className="text-base font-medium text-gray-800 block truncate max-w-[200px] cursor-pointer"
                                      title={outcome.title}
                                    >
                                      {outcome.title?.length > 32
                                        ? outcome.title.slice(0, 29) + "..."
                                        : outcome.title || "(no title)"}
                                    </span>
                                    {outcome.description && (
                                      <div className="absolute left-0 z-20 hidden group-hover:block bg-gray-900 text-white text-sm rounded px-3 py-2 shadow-lg max-w-xs mt-2 whitespace-pre-line">
                                        {outcome.description}
                                      </div>
                                    )}
                                  </div>
                                  {/* Score Boxes */}
                                  <div className="col-span-4">
                                    <div className="grid grid-cols-5 gap-4">
                                      {["U", "O", "B", "P", "A"].map(
                                        (level) => {
                                          const isCurrentLevel =
                                            progress?.progress_level === level;

                                          // Log when we find a match
                                          if (isCurrentLevel) {
                                            console.log(
                                              `Match found - LO: ${outcome.id}, Level: ${level}, Progress:`,
                                              progress
                                            );
                                          }

                                          return (
                                            <div
                                              key={level}
                                              className="text-center"
                                            >
                                              <div
                                                className={`h-8 rounded min-w-[40px] px-2 flex items-center justify-center uppercase ${
                                                  isCurrentLevel
                                                    ? "bg-blue-500 text-white font-bold"
                                                    : "bg-white"
                                                }`}
                                              >
                                                {isCurrentLevel ? level : ""}
                                              </div>
                                            </div>
                                          );
                                        }
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        No feedback moments available
                      </div>
                    )}
                  </div>
                </div>

                {/* Existing Learning Outcomes Section */}
                <div className="mt-12">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    Feedback Overview
                  </h3>
                  <div>
                    {isLoading ? (
                      <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                      </div>
                    ) : sortedLearningOutcomes.length > 0 ? (
                      <div className="space-y-6">
                        {sortedLearningOutcomes.map((outcome) => {
                          // Find all feedback entries for this learning outcome and current moment
                          const allFeedbacksForOutcome = feedbacks.filter(
                            (fb) =>
                              fb.learning_outcome_id === String(outcome.id) &&
                              fb.feedback_moment_id ===
                                String(currentMoment?.id)
                          );

                          // Deduplicate feedbacks based on reviewer, feedback, and feedforward
                          const uniqueKey = (
                            fb: (typeof allFeedbacksForOutcome)[0]
                          ) =>
                            `${fb.reviewer}-${fb.feedback}-${fb.feedforward}`;

                          const feedbacksForOutcome =
                            allFeedbacksForOutcome.filter(
                              (fb, index, self) =>
                                index ===
                                self.findIndex(
                                  (f) => uniqueKey(f) === uniqueKey(fb)
                                )
                            );

                          return (
                            <div
                              key={outcome.id}
                              className="p-4 bg-gray-50 rounded-lg mb-4"
                            >
                              <div className="mb-2 text-base font-medium text-gray-800">
                                {outcome.title}
                              </div>
                              {feedbacksForOutcome.length > 0 ? (
                                <div className="space-y-4">
                                  {feedbacksForOutcome.map(
                                    (feedback, index) => (
                                      <div
                                        key={feedback.id}
                                        className="space-y-2"
                                      >
                                        <div className="text-sm text-gray-600 mb-1">
                                          <span className="font-semibold text-gray-700">
                                            {feedback.reviewer}
                                          </span>
                                          <span className="text-gray-400 ml-2">
                                            {new Date(
                                              feedback.created_at
                                            ).toLocaleDateString()}
                                          </span>
                                        </div>
                                        <div className="bg-white p-3 rounded-md">
                                          <div className="text-sm text-gray-800 mb-2">
                                            <span className="font-semibold">
                                              Feedback:
                                            </span>{" "}
                                            {feedback.feedback}
                                          </div>
                                          <div className="text-sm text-gray-800">
                                            <span className="font-semibold">
                                              Feedforward:
                                            </span>{" "}
                                            {feedback.feedforward}
                                          </div>
                                        </div>
                                      </div>
                                    )
                                  )}
                                </div>
                              ) : (
                                <div className="text-sm text-gray-400 italic">
                                  No feedback yet for this learning outcome in
                                  the current feedback moment
                                </div>
                              )}
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
            <div className="flex justify-center mt-8">
              <span className="text-gray-400 text-base">
                Select a student to view progress
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
