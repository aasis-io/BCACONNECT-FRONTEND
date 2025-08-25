import React from "react";

const NoteCard = ({ note }) => {
  const isImage = note.fileType?.startsWith("image/");
  const isPdf = note.fileType?.includes("pdf"); // more robust check

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden mb-4">
      <div className="p-4">
        {/* Subject + Semester */}
        <div className="mb-3">
          <h3 className="font-semibold text-lg text-gray-800">
            {note.subject}
          </h3>
          <p className="text-sm text-gray-500">{note.semester} Sem</p>
        </div>

        {/* Uploader Info */}
        <div className="mb-3">
          <p className="text-sm text-gray-600">
            Uploaded by: {note.userResponse.fullName}
          </p>
          <p className="text-sm text-gray-500">
            Email: {note.userResponse.email}
          </p>
        </div>

        {/* File Preview */}
        {note.fileUrl && (
          <div className="mb-3">
            {isImage ? (
              <img
                src={note.fileUrl}
                alt={note.filename}
                className="max-h-60 rounded-md border"
              />
            ) : isPdf ? (
              <div>
                {/* Show filename */}
                <p className="text-sm font-medium text-gray-700 mb-2">
                  {note.filename}
                </p>
                {/* Try inline PDF preview */}
                <iframe
                  src={note.fileUrl}
                  title={note.filename}
                  className="w-full h-64 border rounded-md"
                />
                {/* Always provide fallback link */}
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline block mt-2"
                >
                  Open PDF in new tab
                </a>
              </div>
            ) : (
              <div>
                <p className="text-sm font-medium text-gray-700 mb-1">
                  {note.filename}
                </p>
                <a
                  href={note.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  Download File
                </a>
              </div>
            )}
          </div>
        )}

        {/* Date */}
        <div className="mt-3 text-sm text-gray-500">
          <p>Uploaded on: {new Date(note.date).toLocaleString()}</p>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
