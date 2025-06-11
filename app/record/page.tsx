"use client";

import { useSearchParams } from "next/navigation";
import { useMemo, useState, useRef } from "react";
import Link from "next/link";

// Zelfde classOptions en classStudents als in dashboard (voor demo, in praktijk zou je dit delen)
const classOptions = [
  "Media - Semester 2 - Tilburg",
  "Media Semester 3 - Tilburg",
  "Main - Front End Development - Tilburg",
  "Main - Front End Development - Eindhoven",
] as const;
type ClassType = (typeof classOptions)[number];

function getAvatar(gender: "men" | "women", idx: number) {
  return `https://randomuser.me/api/portraits/${gender}/${idx % 100}.jpg`;
}

const classStudents: Record<
  ClassType,
  Array<{ name: string; email: string; studentId: string; avatar: string }>
> = {
  "Media - Semester 2 - Tilburg": [
    {
      name: "Daan de Vries",
      email: "d.devries@student.fontys.nl",
      studentId: "S1002001",
      avatar: getAvatar("men", 1),
    },
    {
      name: "Lieke Bakker",
      email: "l.bakker@student.fontys.nl",
      studentId: "S1002002",
      avatar: getAvatar("women", 2),
    },
    {
      name: "Tim van Dijk",
      email: "t.vandijk@student.fontys.nl",
      studentId: "S1002003",
      avatar: getAvatar("men", 3),
    },
    {
      name: "Sanne Jansen",
      email: "s.jansen@student.fontys.nl",
      studentId: "S1002004",
      avatar: getAvatar("women", 4),
    },
    {
      name: "Niels Visser",
      email: "n.visser@student.fontys.nl",
      studentId: "S1002005",
      avatar: getAvatar("men", 5),
    },
    {
      name: "Femke Smit",
      email: "f.smit@student.fontys.nl",
      studentId: "S1002006",
      avatar: getAvatar("women", 6),
    },
    {
      name: "Bram Vermeulen",
      email: "b.vermeulen@student.fontys.nl",
      studentId: "S1002007",
      avatar: getAvatar("men", 7),
    },
    {
      name: "Eva Mulder",
      email: "e.mulder@student.fontys.nl",
      studentId: "S1002008",
      avatar: getAvatar("women", 8),
    },
    {
      name: "Ruben de Jong",
      email: "r.dejong@student.fontys.nl",
      studentId: "S1002009",
      avatar: getAvatar("men", 9),
    },
    {
      name: "Lisa van den Berg",
      email: "l.vandenberg@student.fontys.nl",
      studentId: "S1002010",
      avatar: getAvatar("women", 10),
    },
    {
      name: "Jasper Willems",
      email: "j.willems@student.fontys.nl",
      studentId: "S1002011",
      avatar: getAvatar("men", 11),
    },
    {
      name: "Sophie Peters",
      email: "s.peters@student.fontys.nl",
      studentId: "S1002012",
      avatar: getAvatar("women", 12),
    },
    {
      name: "Tom van Leeuwen",
      email: "t.vanleeuwen@student.fontys.nl",
      studentId: "S1002013",
      avatar: getAvatar("men", 13),
    },
    {
      name: "Mila Vos",
      email: "m.vos@student.fontys.nl",
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

// Voeg feedbackmomenten toe
const feedbackMoments = [
  {
    id: "1",
    name: "Portfolio / FeedPulse - versie 1 (Week 6)",
    date: "2023-03-30",
    description: "First iteration of your portfolio",
  },
  {
    id: "2",
    name: "Portfolio / FeedPulse - versie 2 (Week 10)",
    date: "2023-05-04",
    description: "Second iteration of your portfolio",
  },
  {
    id: "3",
    name: "Portfolio / FeedPulse - versie 3 (Week 15)",
    date: "2023-06-15",
    description: "Third iteration of your portfolio",
  },
  {
    id: "4",
    name: "Portfolio / FeedPulse - versie 4 (Week 18)",
    date: "2023-07-02",
    description: "Fourth/Final iteration of your portfolio",
  },
];

// Learning outcomes data
const learningOutcomes = [
  {
    id: "1",
    title:
      "LO1 - Conceptualize, design, and develop interactive media products",
    description:
      "You create engaging concepts and translate them into interactive validated media products by applying user-centred design principles, and visual design techniques and by exploring emerging trends and developments in media, design and technologies.",
    level: "undefined",
    feedback: "",
    feedforward: "",
  },
  {
    id: "2",
    title: "LO2 - Transferable production",
    description:
      "You document and comment on your code using version control in a personal and team context and communicate technical recommendations.",
    level: "undefined",
    feedback: "",
    feedforward: "",
  },
  {
    id: "3",
    title: "LO3 - Creative iterations",
    description:
      "You present the successive iterations of your creative process, and the connections between them, of your methodically substantiated, iterative design and development process.",
    level: "undefined",
    feedback: "",
    feedforward: "",
  },
  {
    id: "4",
    title: "LO4 - Professional standards",
    description:
      "Both individually and in teams, you apply a relevant methodological approach used in the professional field to formulate project goals, involve stakeholders, conduct applied (BA) or action-oriented (AD) research, provide advice, make decisions, and deliver reports. In doing so, you consider the relevant ethical, intercultural, and sustainable aspects.",
    level: "undefined",
    feedback: "",
    feedforward: "",
  },
  {
    id: "5",
    title: "LO5 - Personal leadership",
    description:
      "You are aware of your strengths and weaknesses, both in ICT and your personal development. You choose actions aligning with your core values to promote your personal growth and develop your learning attitude.",
    level: "undefined",
    feedback: "",
    feedforward: "",
  },
];

const TEACHER_NAME = "William Janssen";

export default function RecordPage() {
  const searchParams = useSearchParams();
  const className = searchParams.get("class") as ClassType | null;
  const studentId = searchParams.get("student");

  const student = useMemo(() => {
    if (!className || !studentId) return null;
    const students = classStudents[className as ClassType];
    return students.find((s) => s.studentId === studentId) || null;
  }, [className, studentId]);

  const [selectedMomentId, setSelectedMomentId] = useState<string>("");
  const [selectedOutcomes, setSelectedOutcomes] = useState<string[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState<string>("");
  const [recordingError, setRecordingError] = useState<string>("");
  const recognitionRef = useRef<any>(null);
  const [feedbacks, setFeedbacks] = useState<
    Record<
      string,
      Array<{ reviewer: string; feedback: string; feedforward: string }>
    >
  >({});

  const canRecord = !!selectedMomentId && selectedOutcomes.length > 0;

  // Start/stop recording met Web Speech API
  const handleRecording = () => {
    setRecordingError("");
    if (!canRecord) return;
    if (!isRecording) {
      setTranscript("");
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

  // Voeg feedback toe aan een leeruitkomst
  const addFeedback = (outcomeId: string) => {
    const feedbackText = `Feedback from ${TEACHER_NAME} for ${student?.name}: ${transcript}`;
    const feedforwardText = `Feed forward from ${TEACHER_NAME} for ${student?.name}: ${transcript}`;
    setFeedbacks((prev) => ({
      ...prev,
      [outcomeId]: [
        ...(prev[outcomeId] || []),
        {
          reviewer: TEACHER_NAME,
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

  if (!className || !student) {
    return (
      <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow text-center">
        <h1 className="text-xl font-semibold mb-4">Student not found</h1>
        <p>
          Please select a student from the{" "}
          <Link
            href="/dashboard"
            className="text-blue-600 underline hover:text-blue-800 transition"
          >
            dashboard
          </Link>
          .
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Record Feedback</h1>
          {className && student && (
            <div className="mt-2 text-sm text-gray-600">
              Class: {className} | Student: {student.name}
            </div>
          )}
          <div className="mt-2">
            <Link href="/progress" className="text-blue-600 hover:underline">
              Progress
            </Link>
          </div>
        </div>
      </header>
      <div className="mb-4 text-gray-700 font-medium">
        Teacher: {TEACHER_NAME}
      </div>
      <div className="flex items-center gap-4 mb-6">
        <img
          src={student.avatar}
          alt={student.name}
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <div className="text-lg font-bold text-gray-900">{student.name}</div>
          <div className="text-gray-600">{student.email}</div>
          <div className="text-gray-400 text-sm">{student.studentId}</div>
          <div className="mt-2 text-blue-700 font-medium">{className}</div>
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        {/* Feedback moments */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Select a feedback moment
          </h2>
          <ul className="space-y-3">
            {feedbackMoments.map((moment) => (
              <li key={moment.id}>
                <button
                  type="button"
                  onClick={() => setSelectedMomentId(moment.id)}
                  className={`w-full text-left border rounded p-4 bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer ${
                    selectedMomentId === moment.id
                      ? "border-blue-600 bg-blue-50 shadow"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="font-medium text-gray-900">
                      {moment.name}
                    </div>
                    {selectedMomentId === moment.id && (
                      <span className="ml-4 text-blue-600 font-bold">
                        Selected
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500 mb-1">
                    {moment.date}
                  </div>
                  <div className="text-gray-700 text-sm">
                    {moment.description}
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </div>
        {/* Learning outcomes */}
        <div>
          <h2 className="text-lg font-semibold mb-3">
            Select the learning outcomes
          </h2>
          <ul className="space-y-3">
            {learningOutcomes.map((lo) => (
              <li key={lo.id}>
                <button
                  type="button"
                  onClick={() =>
                    setSelectedOutcomes(
                      selectedOutcomes.includes(lo.id)
                        ? selectedOutcomes.filter((id) => id !== lo.id)
                        : [...selectedOutcomes, lo.id]
                    )
                  }
                  className={`w-full text-left border rounded p-4 bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-blue-400 cursor-pointer flex flex-col items-start ${
                    selectedOutcomes.includes(lo.id)
                      ? "border-blue-600 bg-blue-50 shadow"
                      : "hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center mb-1">
                    <input
                      type="checkbox"
                      checked={selectedOutcomes.includes(lo.id)}
                      readOnly
                      className="mr-3 accent-blue-600"
                    />
                    <span className="font-medium text-gray-900">
                      {lo.title}
                    </span>
                  </div>
                  <div className="text-gray-700 text-sm">{lo.description}</div>
                </button>
              </li>
            ))}
          </ul>
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
              selectedOutcomes.forEach((loId) => {
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
            <p>{transcript}</p>
            {/* Feedback/feedforward per leeruitkomst */}
            <div className="mt-6 space-y-6">
              {selectedOutcomes.map((loId) => {
                const lo = learningOutcomes.find((l) => l.id === loId);
                const feedbackArr = feedbacks[loId] || [];
                return lo && feedbackArr.length > 0 ? (
                  <div key={loId} className="bg-white border rounded p-4">
                    <div className="font-semibold text-gray-900 mb-2">
                      {lo.title}
                    </div>
                    <div className="mb-4">
                      <div className="text-xs text-gray-500 mb-1">
                        Reviewer: {feedbackArr[0]?.reviewer}
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
                ) : null;
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
