import React from "react";

import { useState } from "react";
import { Upload, File, X, Check, AlertCircle } from "lucide-react";

export default function CourseMaterialsUpload() {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles([...files, ...selectedFiles]);
  };

  const removeFile = (index) => {
    const newFiles = [...files];
    newFiles.splice(index, 1);
    setFiles(newFiles);
  };

  const handleUpload = () => {
    if (files.length === 0) {
      setError("Please select at least one file to upload");
      return;
    }

    setUploading(true);
    setError(null);

    // Simulate upload process
    setTimeout(() => {
      setUploading(false);
      setUploadSuccess(true);

      // Reset success message after 3 seconds
      setTimeout(() => {
        setUploadSuccess(false);
        setFiles([]);
      }, 3000);
    }, 2000);
  };

  return (
    <div className='bg-white rounded-lg shadow-md p-6'>
      <h2 className='text-2xl font-bold mb-6 font-[Poppins] text-[#333333]'>
        Upload Course Materials
      </h2>

      {/* File Drop Area */}
      <div className='border-2 border-dashed border-gray-300 rounded-lg p-8 text-center mb-6'>
        <Upload size={40} className='mx-auto text-gray-400 mb-3' />
        <p className='text-lg font-medium mb-2 font-[Poppins] text-[#333333]'>
          Drag and drop files here
        </p>
        <p className='text-gray-500 mb-4 font-[Roboto]'>
          or click to browse from your computer
        </p>
        <input
          type='file'
          multiple
          className='hidden'
          id='file-upload'
          onChange={handleFileChange}
        />
        <label
          htmlFor='file-upload'
          className='inline-block bg-[#004B87] text-white px-4 py-2 rounded-md cursor-pointer hover:bg-[#003a6a] transition-colors font-[Roboto]'
        >
          Select Files
        </label>
        <p className='mt-3 text-xs text-gray-500 font-[Roboto]'>
          Supported file types: PDF, DOCX, PPTX, MP4, ZIP (Max size: 100MB)
        </p>
      </div>

      {/* Selected Files */}
      {files.length > 0 && (
        <div className='mb-6'>
          <h3 className='text-lg font-medium mb-3 font-[Poppins] text-[#333333]'>
            Selected Files ({files.length})
          </h3>
          <div className='space-y-2 max-h-60 overflow-y-auto pr-2'>
            {files.map((file, index) => (
              <div
                key={index}
                className='flex items-center justify-between bg-gray-50 p-3 rounded-md'
              >
                <div className='flex items-center'>
                  <File size={20} className='text-[#004B87] mr-2' />
                  <div>
                    <p className='font-medium text-[#333333] font-[Roboto]'>
                      {file.name}
                    </p>
                    <p className='text-xs text-gray-500 font-[Roboto]'>
                      {(file.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => removeFile(index)}
                  className='text-gray-500 hover:text-red-500'
                >
                  <X size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Upload Options */}
      <div className='grid md:grid-cols-2 gap-4 mb-6'>
        <div>
          <label
            htmlFor='course-select'
            className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
          >
            Select Course
          </label>
          <select
            id='course-select'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
          >
            <option value=''>Select a course</option>
            <option value='ECON101'>
              ECON101 - Principles of Microeconomics
            </option>
            <option value='ECON201'>ECON201 - Macroeconomic Theory</option>
            <option value='FIN301'>FIN301 - Financial Management</option>
            <option value='STAT202'>STAT202 - Business Statistics</option>
          </select>
        </div>
        <div>
          <label
            htmlFor='material-type'
            className='block text-sm font-medium text-gray-700 mb-1 font-[Roboto]'
          >
            Material Type
          </label>
          <select
            id='material-type'
            className='w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-[#004B87] font-[Roboto]'
          >
            <option value=''>Select material type</option>
            <option value='lecture'>Lecture Notes</option>
            <option value='assignment'>Assignment</option>
            <option value='syllabus'>Syllabus</option>
            <option value='textbook'>Textbook</option>
            <option value='presentation'>Presentation</option>
            <option value='video'>Video Lecture</option>
          </select>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className='mb-4 p-3 bg-red-50 text-red-700 rounded-md flex items-center'>
          <AlertCircle size={18} className='mr-2' />
          <span className='font-[Roboto]'>{error}</span>
        </div>
      )}

      {/* Success Message */}
      {uploadSuccess && (
        <div className='mb-4 p-3 bg-green-50 text-green-700 rounded-md flex items-center'>
          <Check size={18} className='mr-2' />
          <span className='font-[Roboto]'>Files uploaded successfully!</span>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={uploading || files.length === 0}
        className={`w-full py-3 rounded-md font-medium font-[Roboto] flex items-center justify-center ${
          uploading || files.length === 0
            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
            : "bg-[#004B87] text-white hover:bg-[#003a6a]"
        } transition-colors`}
      >
        {uploading ? (
          <>
            <div className='animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2'></div>
            Uploading...
          </>
        ) : (
          <>Upload Materials</>
        )}
      </button>
    </div>
  );
}
