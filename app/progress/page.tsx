import React from "react";
import Link from "next/link";

const ProgressPage = () => {
  return (
    <div className="max-w-7xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Progress</h1>
          <div className="mt-2 text-sm text-gray-600">
            Class: <span className="font-semibold">Selected Class</span> |
            Student: <span className="font-semibold">Selected Student</span>
          </div>
          <div className="mt-2">
            <Link href="/dashboard" className="text-blue-600 hover:underline">
              Dashboard
            </Link>
          </div>
        </div>
      </header>
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-4">Student Progress</h2>
        {/* Add your progress content here */}
      </div>
    </div>
  );
};

export default ProgressPage;
