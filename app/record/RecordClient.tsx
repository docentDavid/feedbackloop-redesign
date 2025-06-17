"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useRef, useEffect } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabase";

export default function RecordClient() {
  const searchParams = useSearchParams();
  const className = searchParams.get("class");
  const studentId = searchParams.get("student");

  console.log("Record page params:", { className, studentId });

  // Add early return with error message if parameters are missing
  if (!className || !studentId) {
    return (
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 mt-6">
        <div className="text-center">
          <h1 className="text-2xl font-semibold text-gray-900 mb-4">
            Missing Parameters
          </h1>
          <p className="text-gray-600 mb-4">
            Please select a class and student from the dashboard.
          </p>
          <Link
            href="/dashboard"
            className="inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition"
          >
            Go to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const [teacherName, setTeacherName] = useState<string>("Loading...");

  // Fetch teacher name
  useEffect(() => {
    const fetchTeacherName = async () => {
      try {
        const {
          data: { user },
          error,
        } = await supabase.auth.getUser();

        if (error) {
          console.error("Error fetching user:", error);
          setTeacherName("Unknown Teacher");
          return;
        }

        if (!user) {
          console.error("No user found");
          setTeacherName("Unknown Teacher");
          return;
        }

        const { data: teacherData, error: teacherError } = await supabase
          .from("teachers")
          .select("name")
          .eq("email", user.email)
          .single();

        if (teacherError) {
          console.error("Error fetching teacher:", teacherError);
          setTeacherName("Unknown Teacher");
        } else if (teacherData) {
          setTeacherName(teacherData.name);
        }
      } catch (error) {
        console.error("Error in fetchTeacherName:", error);
        setTeacherName("Unknown Teacher");
      }
    };

    fetchTeacherName();
  }, []);

  const [student, setStudent] = useState<{
    name: string;
    email: string;
    studentId: string;
    avatar: string;
  }>({
    name: "",
    email: "",
    studentId: "",
    avatar: "",
  });

  const [feedbackMoments, setFeedbackMoments] = useState<
    Array<{
      id: string;
      name: string;
      date: string;
      description: string;
    }>
  >([]);

  const [learningOutcomes, setLearningOutcomes] = useState<
    Array<{
      id: string;
      title: string;
      description: string;
      level: string;
    }>
  >([]);

  // Fetch classes
  useEffect(() => {
    const fetchClasses = async () => {
      const { data, error } = await supabase
        .from("classes")
        .select("name")
        .order("name", { ascending: true });

      if (error) {
        console.error("Error fetching classes:", error);
      } else if (data) {
        // Classes are now available in the data array
        console.log(
          "Available classes:",
          data.map((c) => c.name)
        );
      }
    };

    fetchClasses();
  }, []);

  // Fetch feedback moments
  useEffect(() => {
    const fetchFeedbackMoments = async () => {
      const { data, error } = await supabase
        .from("feedback_moments")
        .select("*")
        .order("date", { ascending: true });

      if (error) {
        console.error("Error fetching feedback moments:", error);
      } else if (data) {
        setFeedbackMoments(
          data.map((moment) => ({
            id: moment.id.toString(),
            name: moment.name,
            date: moment.date,
            description: moment.description,
          }))
        );
      }
    };

    fetchFeedbackMoments();
  }, []);

  // Fetch learning outcomes
  useEffect(() => {
    const fetchLearningOutcomes = async () => {
      if (!className) return;
      // Fetch class id for the selected class name
      const { data: classData, error: classError } = await supabase
        .from("classes")
        .select("id")
        .eq("name", className)
        .single();
      if (classError || !classData) {
        console.error(
          "Error fetching class id for learning outcomes:",
          classError
        );
        setLearningOutcomes([]);
        return;
      }
      // Fetch learning outcomes for this class
      const { data, error } = await supabase
        .from("learning_outcomes")
        .select("*")
        .eq("class_id", classData.id)
        .order("title", { ascending: true });
      if (error) {
        console.error("Error fetching learning outcomes:", error);
        setLearningOutcomes([]);
      } else if (data) {
        setLearningOutcomes(
          data.map((outcome) => ({
            id: outcome.id.toString(),
            title: outcome.title,
            description: outcome.description,
            level: outcome.level,
          }))
        );
      }
    };
    fetchLearningOutcomes();
  }, [className]);

  // Fetch student data
  useEffect(() => {
    const fetchStudent = async () => {
      if (!studentId || !className) {
        console.error("Missing studentId or className");
        return;
      }

      try {
        // First get the class ID
        const { data: classData, error: classError } = await supabase
          .from("classes")
          .select("id")
          .eq("name", className)
          .single();

        if (classError) {
          console.error("Error fetching class:", classError);
          return;
        }

        if (!classData) {
          console.error("Class not found");
          return;
        }

        // Then get the student data
        const { data: studentData, error: studentError } = await supabase
          .from("students")
          .select("name, email, student_id, avatar")
          .eq("student_id", studentId)
          .eq("class_id", classData.id)
          .single();

        if (studentError) {
          console.error("Error fetching student:", studentError);
          return;
        }

        if (studentData) {
          setStudent({
            name: studentData.name,
            email: studentData.email,
            studentId: studentData.student_id,
            avatar: studentData.avatar,
          });
        }
      } catch (error) {
        console.error("Error in fetchStudent:", error);
      }
    };

    fetchStudent();
  }, [studentId, className]);

  const [selectedMomentId, setSelectedMomentId] = useState<string>("");
  const [selectedOutcomes, setSelectedOutcomes] = useState<Set<string>>(
    new Set()
  );
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState("");
  const [editedTranscript, setEditedTranscript] = useState("");
  const [recordingError, setRecordingError] = useState<string>("");
  const [showFeedback, setShowFeedback] = useState(false);
  const recognitionRef = useRef<any>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<string, Array<{ feedback: string; feedforward: string }>>
  >({});

  const canRecord = !!selectedMomentId && selectedOutcomes.size > 0;

  // Start/stop recording met Web Speech API
  const handleRecording = () => {
    setRecordingError("");
    if (!canRecord) return;
    if (!isRecording) {
      setTranscript("");
      setEditedTranscript("");
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SpeechRecognition) {
        setRecordingError(
          "Speech recognition is not supported in this browser. Please use Chrome or Edge."
        );
        return;
      }
      const recognition = new SpeechRecognition();
      recognition.lang = "en-US";
      recognition.interimResults = false;
      recognition.continuous = true;
      let finalTranscript = "";
      recognition.onresult = (event: any) => {
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript + " ";
          }
        }
        setTranscript(finalTranscript.trim());
        setEditedTranscript(finalTranscript.trim());
      };
      recognition.onerror = (event: any) => {
        setRecordingError("Speech recognition error: " + event.error);
      };
      recognition.onend = () => {
        setIsRecording(false);
      };
      recognitionRef.current = recognition;
      recognition.start();
      setIsRecording(true);
    } else {
      // Stop recording
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    }
  };

  // Transfer transcript to feedback/feedforward
  const transferTranscript = () => {
    Array.from(selectedOutcomes).forEach((loId) => {
      addFeedback(loId);
    });
    setShowFeedback(true);
  };

  // Voeg feedback toe aan een leeruitkomst
  const addFeedback = (outcomeId: string) => {
    const feedbackText = transcript || "No feedback provided";
    const feedforwardText = transcript || "No feedforward provided";

    setFeedbacks((prev) => ({
      ...prev,
      [outcomeId]: [
        ...(prev[outcomeId] || []),
        {
          feedback: feedbackText,
          feedforward: feedforwardText,
        },
      ],
    }));
  };

  // Update feedback/feedforward/reviewer
  const updateFeedback = (
    outcomeId: string,
    idx: number,
    field: "reviewer" | "feedback" | "feedforward",
    value: string
  ) => {
    setFeedbacks((prev) => ({
      ...prev,
      [outcomeId]: prev[outcomeId].map((fb, i) =>
        i === idx ? { ...fb, [field]: value } : fb
      ),
    }));
  };

  // Copy to clipboard helper
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow p-8 mt-6">
      <h1 className="text-2xl font-semibold text-gray-900 mb-2">
        Record Feedback
      </h1>
      <div className="flex items-center gap-4 my-6">
        <img
          src={
            student.avatar || "https://randomuser.me/api/portraits/lego/1.jpg"
          }
          alt={student.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-bold text-gray-900">{student.name}</div>
          <div className="text-gray-600">{student.email}</div>
          <div className="text-gray-400 text-sm">{student.studentId}</div>
          <div className="mt-2 text-gray-600">{className}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
        {/* Feedback Moments */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select a feedback moment
          </h2>
          <div className="space-y-2">
            {feedbackMoments.map((moment) => (
              <button
                key={moment.id}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedMomentId === moment.id
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                onClick={() => setSelectedMomentId(moment.id)}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full border-2 flex-shrink-0 mt-1 ${
                      selectedMomentId === moment.id
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedMomentId === moment.id && (
                      <div className="w-2 h-2 rounded-full bg-white m-auto mt-[3px]" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">{moment.name}</h3>
                    <p className="text-sm text-gray-500">{moment.date}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {moment.description}
                    </p>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Learning Outcomes */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Select learning outcomes
          </h2>
          <div className="space-y-2">
            {learningOutcomes.map((outcome) => (
              <button
                key={outcome.id}
                className={`w-full text-left p-4 rounded-lg border transition ${
                  selectedOutcomes.has(outcome.id)
                    ? "border-blue-500 bg-blue-50 ring-2 ring-blue-500"
                    : "border-gray-200 hover:border-blue-300 hover:bg-blue-50/50"
                }`}
                onClick={() => {
                  const newSelected = new Set(selectedOutcomes);
                  if (selectedOutcomes.has(outcome.id)) {
                    newSelected.delete(outcome.id);
                  } else {
                    newSelected.add(outcome.id);
                  }
                  setSelectedOutcomes(newSelected);
                }}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded border-2 flex-shrink-0 mt-1 ${
                      selectedOutcomes.has(outcome.id)
                        ? "border-blue-500 bg-blue-500"
                        : "border-gray-300"
                    }`}
                  >
                    {selectedOutcomes.has(outcome.id) && (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </div>
                  <div>
                    <h3 className="font-medium text-gray-900">
                      {outcome.title}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      {outcome.description}
                    </p>
                    {outcome.level && (
                      <p className="text-xs text-gray-500 mt-1">
                        Level: {outcome.level}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8">
        <button
          className={`px-6 py-3 rounded font-semibold transition cursor-pointer w-full md:w-auto min-w-[200px] ${
            isRecording
              ? "bg-red-600 hover:bg-red-700"
              : "bg-blue-600 hover:bg-blue-700"
          } text-white disabled:bg-gray-300 disabled:text-gray-500 disabled:cursor-not-allowed`}
          onClick={() => {
            if (!canRecord) return;
            if (!isRecording) {
              setTranscript("");
              setIsRecording(true);
            } else {
              setIsRecording(false);
              // Voeg feedback toe aan alle geselecteerde leeruitkomsten
              Array.from(selectedOutcomes).forEach((loId) => {
                addFeedback(loId);
              });
            }
            handleRecording();
          }}
          disabled={!canRecord}
          title={
            !canRecord
              ? "Select a feedback moment and at least one learning outcome to start recording."
              : ""
          }
        >
          {isRecording ? "Recording..." : "Start recording"}
        </button>
        {isRecording && (
          <div className="mt-2 text-red-600 font-medium">
            Click again to stop recording.
          </div>
        )}
        {recordingError && (
          <div className="mt-4 text-red-600 font-medium">{recordingError}</div>
        )}
        {transcript && !isRecording && (
          <div className="mt-6 p-4 bg-gray-100 rounded border text-gray-800">
            <h3 className="font-semibold mb-2">Transcript</h3>
            <div className="mb-4">
              <textarea
                className="w-full p-3 border rounded-lg bg-white min-h-[150px]"
                value={editedTranscript}
                onChange={(e) => setEditedTranscript(e.target.value)}
                placeholder="Edit your transcript here..."
              />
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                You can edit the transcript above before converting it to
                feedback. The edited text will be used for both feedback and
                feedforward for all selected learning outcomes.
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
              onClick={transferTranscript}
            >
              Transfer to Feedback
            </button>
            {/* Feedback/feedforward per leeruitkomst */}
            {showFeedback && (
              <div className="mt-6 space-y-6">
                {Array.from(selectedOutcomes).map((loId: string) => {
                  const outcome = learningOutcomes.find((lo) => lo.id === loId);
                  if (!outcome) return null;
                  const feedbackArr = feedbacks[loId] || [];
                  return (
                    <div key={loId} className="bg-white border rounded p-4">
                      <div className="font-semibold text-gray-900 mb-2">
                        {outcome.title}
                      </div>
                      <div className="mb-4">
                        <div className="text-xs text-gray-500 mb-1">
                          Reviewer: {teacherName}
                        </div>
                        <div className="mb-2">
                          <label className="block text-xs font-semibold mb-1">
                            Feedback
                          </label>
                          <div className="flex gap-2 items-start">
                            <textarea
                              className="border rounded px-2 py-1 w-full text-sm"
                              rows={6}
                              value={feedbackArr[0]?.feedback}
                              readOnly
                            />
                            <button
                              type="button"
                              className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                              onClick={() =>
                                copyToClipboard(feedbackArr[0]?.feedback)
                              }
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold mb-1">
                            Feed forward
                          </label>
                          <div className="flex gap-2 items-start">
                            <textarea
                              className="border rounded px-2 py-1 w-full text-sm"
                              rows={6}
                              value={feedbackArr[0]?.feedforward}
                              readOnly
                            />
                            <button
                              type="button"
                              className="px-2 py-1 bg-gray-200 rounded text-xs hover:bg-gray-300"
                              onClick={() =>
                                copyToClipboard(feedbackArr[0]?.feedforward)
                              }
                            >
                              Copy
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
