import React, { useEffect, useState } from "react";
import axiosInstance from "../../api/AxiosInstance";
import NoteCard from "./../../components/NoteCard";

export default function Notes() {
  const [semester, setSemester] = useState("");
  const [subject, setSubject] = useState("");
  const [subjects, setSubjects] = useState([]);
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userRole, setUserRole] = useState(null);
  const [currentUserId, setCurrentUserId] = useState(null);

  const jwt = localStorage.getItem("jwt");

  const semesterOptions = [
    "First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth",
  ];

  const subjectMap = {
    First: ["English I","Mathematics I","Computer Fundamentals and Applications","Digital Logic","Society and Technology"],
    Second: ["English II","Mathematics II","Microprocessor and Computer Architecture","Programming in C","Financial Accounting"],
    Third: ["Data Structures and Algorithms","Database Management System (DBMS)","Discrete Mathematics","System Analysis and Design","Business Communication"],
    Fourth: ["Operating System","Numerical Methods","Software Engineering","Scripting Language","Web Technology"],
    Fifth: ["Object Oriented Programming in Java","Computer Networking","Introduction to Management","Principles of Programming Languages","Project I (Minor Project)"],
    Sixth: ["Mobile Programming","Distributed System","Applied Economics","Advanced Java Programming","Project II (Major Project)"],
    Seventh: ["Cyber Law and Professional Ethics","Cloud Computing","Internship","Elective I"],
    Eight: ["IT Security","Elective II","Final Project (Dissertation)"],
  };

  useEffect(() => {
    if (!jwt) return;

    axiosInstance
      .get("/user/me", { headers: { Authorization: `Bearer ${jwt}` } })
      .then((res) => {
        setUserRole(res.data.data.roles?.[0]);
        setCurrentUserId(res.data.data.id);
      })
      .catch((err) => console.error("Error fetching user info:", err));
  }, [jwt]);

  useEffect(() => {
    if (semester) {
      setSubjects(subjectMap[semester]);
      setSubject("");
      setNotes([]);
    }
  }, [semester]);

  useEffect(() => {
    if (semester && subject) {
      fetchNotes();
    }
  }, [subject]);

  const fetchNotes = async (sem = semester, sub = subject) => {
    setLoading(true);
    try {
      const res = await axiosInstance.get(
        `/note/getNote?semester=${encodeURIComponent(sem)}&subject=${encodeURIComponent(sub)}`
      );
      setNotes(res.data.data || []);
    } catch (err) {
      console.error("Error fetching notes", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete handler
  const handleDeleteNote = (noteId) => {
    // Remove the deleted note from state immediately
    setNotes((prevNotes) => prevNotes.filter((note) => note.note_id !== noteId));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">Find Notes</h2>

      <div className="grid md:grid-cols-2 gap-4">
        <select
          value={semester}
          onChange={(e) => setSemester(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Select Semester</option>
          {semesterOptions.map((sem) => (
            <option key={sem} value={sem}>{sem}</option>
          ))}
        </select>

        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={!semester}
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100"
        >
          <option value="">Select Subject</option>
          {subjects.map((sub) => (
            <option key={sub} value={sub}>{sub}</option>
          ))}
        </select>
      </div>

      {loading && <p className="mt-6 text-blue-600 animate-pulse">Loading notes...</p>}

      {!loading && notes.length === 0 && semester && subject && (
        <p className="mt-6 text-gray-500">No notes available for this selection.</p>
      )}

      {notes.length > 0 && (
        <div className="mt-10 space-y-6">
          {notes.map((note) => (
            <NoteCard
              key={note.note_id}
              note={note}
              userRole={userRole}
              currentUserId={currentUserId}
              onDelete={handleDeleteNote}
            />
          ))}
        </div>
      )}
    </div>
  );
}
