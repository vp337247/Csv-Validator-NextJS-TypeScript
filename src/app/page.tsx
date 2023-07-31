'use client'
// page.tsx
import React from 'react';
import { usePageHelper, PageHelperProps } from './pageHelpers';

export default function Home() {
  // Get the functions and state variables from pageHelper.tsx
  const pageHelperProps: PageHelperProps = usePageHelper();

  // Destructure the required functions and state variables from pageHelperProps
  const {
    csvData,
    validationErrors,
    isFileUploaded,
    fileType,
    showErrorMessage,
    isSubmitted,
    showTable,
    shouldShowTable,
    editingRowIndex,
    editedRowData,
    deletingRowIndex,
    setEditedRowData,
    handleEditRow,
    handleSaveEdit,
    handleCancelEdit,
    handleUpdateRow,
    handleOpenDeleteConfirmation,
    handleCloseDeleteConfirmation,
    handleConfirmDelete,
    handleFileChange,
    handleDownload,
    handleSubmit,
    handleAddRow,
  } = pageHelperProps;

  return (
    <div className="flex flex-col items-center justify-start h-screen bg-zinc-950">
      <h1 className="mb-10 text-3xl font-bold pt-3 text-white-800">CSV Validator</h1>
      {/*Filepicker*/}
      <div className="w-3/4 mb-3">
        <label htmlFor="formFile" className="block text-black-700 font-medium mb-1">
          Upload CSV file
        </label>
        <input
          className="w-full px-3 py-2 border border-blue-300 bg-black rounded-md focus:outline-none focus:ring focus:ring-blue-200 focus:border-blue-500"
          type="file"
          id="formFile"
          onChange={handleFileChange}
        />
        {isFileUploaded && !showErrorMessage && (
          <button
            className="mt-3 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-all duration-300"
            type="submit"
            onClick={handleSubmit}
          >
            Submit
          </button>
        )}
      </div>
      {/*Filepicker Error Handler */}
      {showErrorMessage && (
        <div className="w-3/4 mb-3">
          <p className="text-red-600">Please upload a CSV file. The selected file type is: {fileType}</p>
        </div>
      )}

      {isSubmitted && csvData.length > 0 && (
        <>
          <table className="w-3/4 border-collapse border border-gray-500">
            {/* Table Header */}
            <thead>
              <tr>
                <th className="border border-blue-300 p-2">Index</th>
                <th className="border border-blue-300 p-2">Name</th>
                <th className="border border-blue-300 p-2">Phone Number</th>
                <th className="border border-blue-300 p-2">Address</th>
                <th className="border border-blue-300 p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* Table Rows */}
              {csvData.map((row, index) => (
                <tr key={index}>
                  <td className={`border hover:bg-blue-900 border-blue-300  p-2 `}>{index + 1}</td>
                  <td className={`border hover:bg-blue-900 border-blue-300  p-2 `}>
                    {row.Name}
                    {!validationErrors[index].name && (//checking not null
                      <div className="text-red-500">{validationErrors[index].nameErrorMessage}</div>
                    )}
                  </td>
                  <td className={`border border-blue-300 hover:bg-blue-900 p-2 `}>
                    {row['Phone Number']}
                    {!validationErrors[index].phone && (
                      <div className="text-red-500">{validationErrors[index].phoneErrorMessage}</div>
                    )}
                  </td>
                  <td className="border border-blue-300 hover:bg-blue-900 p-2">{row.Address}</td>
                  <td className="border border-blue-300 p-2">
                    <button
                      className="mr-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                      onClick={() => handleEditRow(index)}
                    >
                      Edit
                    </button>
                    <button
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                      onClick={() => handleOpenDeleteConfirmation(index)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {/*Download Button */}
          <div className="w-3/4 mt-3 flex justify-start">
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:bg-blue-600 transition-all duration-300"
              onClick={handleDownload}
            >
              Download
            </button>
          </div>

          {/* Edit Modal */}
          {editingRowIndex !== null && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
              <div className="bg-white p-4 w-96">
                <h2 className="text-lg text-black font-bold mb-2">Edit Row</h2>
                <label className="block mb-2">
                  Name:
                  <input
                    type="text"
                    placeholder="Name"
                    className="text-black font-bold border border-gray-400 w-full px-2 py-1"
                    value={editedRowData.Name}
                    onChange={(e) => setEditedRowData({ ...editedRowData, Name: e.target.value })}
                  />
                  {!validationErrors[editingRowIndex].name && (
                    <div className="text-red-500">{validationErrors[editingRowIndex].nameErrorMessage}</div>
                  )}
                </label>
                <label className="block mb-2">
                  Phone Number:
                  <input
                    type="text"
                    placeholder="Phone Number"
                    className="border text-black font-bold border-gray-400 w-full px-2 py-1"
                    value={editedRowData['Phone Number']}
                    onChange={(e) => setEditedRowData({ ...editedRowData, 'Phone Number': e.target.value })}
                  />
                  {!validationErrors[editingRowIndex].phone && (
                    <div className="text-red-500">{validationErrors[editingRowIndex].phoneErrorMessage}</div>
                  )}
                </label>
                <label className="block mb-2">
                  Address:
                  <input
                    type="text"
                    placeholder="Address"
                    className="border border-gray-400 w-full px-2 text-black font-bold py-1"
                    value={editedRowData.Address}
                    onChange={(e) => setEditedRowData({ ...editedRowData, Address: e.target.value })}
                  />
                </label>
                <div className="flex justify-end">
                  <button
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 mr-2"
                    onClick={handleSaveEdit}
                  >
                    Save
                  </button>
                  <button
                    className="px-4 py-2  bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                    onClick={handleCancelEdit}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* Add New Row Button */}
      {isSubmitted && (
        <div className="w-3/4 flex justify-end">
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-800 focus:outline-none focus:bg-green-600 transition-all duration-300"
            onClick={handleAddRow}
          >
            Add New Row
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deletingRowIndex !== null && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-4 w-96">
            <h2 className="text-lg font-semibold mb-2">Confirm Delete</h2>
            <p className="mb-4 text-black font-semibold">Are you sure you want to delete this row?</p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 mr-2"
                onClick={handleConfirmDelete}
              >
                Confirm
              </button>
              <button
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
                onClick={handleCloseDeleteConfirmation}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
