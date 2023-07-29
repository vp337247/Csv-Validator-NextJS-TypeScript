'use client'
// pageHelpers.tsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';

// Define the PageHelperProps interface for type checking
export interface PageHelperProps {
  // State variables
  csvData: any[];
  setCsvData: React.Dispatch<React.SetStateAction<any[]>>;
  validationErrors: {
    name: boolean;
    phone: boolean;
    nameErrorMessage: string;
    phoneErrorMessage: string;
  }[];
  setValidationErrors: React.Dispatch<
    React.SetStateAction<{
      name: boolean;
      phone: boolean;
      nameErrorMessage: string;
      phoneErrorMessage: string;
    }[]>
  >;
  isFileUploaded: boolean;
  setIsFileUploaded: React.Dispatch<React.SetStateAction<boolean>>;
  fileType: string;
  setFileType: React.Dispatch<React.SetStateAction<string>>;
  showErrorMessage: boolean;
  setShowErrorMessage: React.Dispatch<React.SetStateAction<boolean>>;
  isSubmitted: boolean;
  setIsSubmitted: React.Dispatch<React.SetStateAction<boolean>>;
  showTable: boolean;
  setShowTable: React.Dispatch<React.SetStateAction<boolean>>;
  shouldShowTable: boolean;
  setShouldShowTable: React.Dispatch<React.SetStateAction<boolean>>;
  editingRowIndex: number | null;
  setEditingRowIndex: React.Dispatch<React.SetStateAction<number | null>>;
  editedRowData: any;
  setEditedRowData: React.Dispatch<React.SetStateAction<any>>;
  deletingRowIndex: number | null;
  setDeletingRowIndex: React.Dispatch<React.SetStateAction<number | null>>;

  // Functions
  handleEditRow: (index: number) => void;
  handleSaveEdit: () => void;
  handleCancelEdit: () => void;
  handleUpdateRow: (index: number, updatedData: any) => void;
  handleOpenDeleteConfirmation: (index: number) => void;
  handleCloseDeleteConfirmation: () => void;
  handleConfirmDelete: () => void;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  validateData: (data: any[]) => void;
  handleDownload: () => void;
  handleSubmit: () => void;
  handleAddRow: () => void;
}

export const usePageHelper = (): PageHelperProps => {
  //State variables
  const [csvData, setCsvData] = useState<any[]>([]);
  const [validationErrors, setValidationErrors] = useState<
    { name: boolean; phone: boolean; nameErrorMessage: string; phoneErrorMessage: string }[]
  >([]);

  const [isFileUploaded, setIsFileUploaded] = useState(false);
  const [fileType, setFileType] = useState('');
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [showTable, setShowTable] = useState(false);
  const [shouldShowTable, setShouldShowTable] = useState(false);

  // State to keep track of the currently edited row index and data
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const [editedRowData, setEditedRowData] = useState<any>({
    Name: '',
    'Phone Number': '',
    Address: '',
  });

  // State to keep track of the row index to be deleted
  const [deletingRowIndex, setDeletingRowIndex] = useState<number | null>(null);

  // Function to handle editing a row
  const handleEditRow = (index: number) => {
    setEditingRowIndex(index);
    setEditedRowData(csvData[index]);
  };

  // Function to save the edited row
  const handleSaveEdit = () => {
    if (editingRowIndex !== null) {
      // Make a copy of the current data and update the edited row
      const updatedCsvData = [...csvData];
      updatedCsvData[editingRowIndex] = editedRowData;
      setCsvData(updatedCsvData);

      // Close the modal
      setEditingRowIndex(null);
      setEditedRowData({
        Name: '',
        'Phone Number': '',
        Address: '',
      });

      // Revalidate the edited data
      validateData(updatedCsvData);
    }
  };

  // Function to cancel editing a row
  const handleCancelEdit = () => {
    setEditingRowIndex(null);
    setEditedRowData({
      Name: '',
      'Phone Number': '',
      Address: '',
    });
  };

  // Function to update a row with new data
  const handleUpdateRow = (index: number, updatedData: any) => {
    const updatedCsvData = [...csvData];
    updatedCsvData[index] = updatedData;
    setCsvData(updatedCsvData);
    validateData(updatedCsvData);
  };

  // Function to open the delete confirmation modal
  const handleOpenDeleteConfirmation = (index: number) => {
    setDeletingRowIndex(index);
  };

  // Function to close the delete confirmation modal
  const handleCloseDeleteConfirmation = () => {
    setDeletingRowIndex(null);
  };

  // Function to confirm the deletion of a row
  const handleConfirmDelete = () => {
    if (deletingRowIndex !== null) {
      const updatedCsvData = [...csvData];
      updatedCsvData.splice(deletingRowIndex, 1);
      setCsvData(updatedCsvData);
      validateData(updatedCsvData);
      setDeletingRowIndex(null);
    }
  };

  // Function to handle file input change
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files && event.target.files[0];
    if (file) {
      setIsFileUploaded(true);
      const fileType = file.type;
      if (fileType !== 'text/csv') {
        setFileType(fileType);
        setShowErrorMessage(true);
        return;
      }
      setShowErrorMessage(false);

      const reader = new FileReader();
      reader.onload = (event) => {
        const csvText = event.target?.result as string;
        const parsedData = Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true, // This will skip empty lines during parsing
        });

        if (!parsedData.data || !Array.isArray(parsedData.data)) {
          console.error('Invalid CSV data format.');
          return;
        }

        setCsvData(parsedData.data);
        validateData(parsedData.data);
        setIsSubmitted(false); // Reset isSubmitted when a new file is selected
      };
      reader.readAsText(file);
    }
  };

  // Function to validate the data and update the validation errors
  const validateData = (data: any[]) => {
    const filteredData = data.filter(
      (row) => row.Name.trim() !== '' && row['Phone Number'].trim() !== '' && row.Address.trim() !== ''
    );

    const validationErrors = filteredData.map((row) => {
      // Name Validation
      const nameRegex = /^[^0-9!@#$%^&*()_+={}|[\]\\:';"<>?,./`~]*$/;
      const isValidName = row.Name.trim().length >= 3 && nameRegex.test(row.Name);

      // Phone Number Validation
      const isValidPhone = /^[6-9]\d{9}$/.test(row['Phone Number']);

      // Custom Error Messages
      const nameErrorMessage = [];
      if (row.Name.trim() === '') {
        nameErrorMessage.push('Name is required');
      }
      if (!nameRegex.test(row.Name)) {
        nameErrorMessage.push('Name should not contain any special characters');
      }
      if (row.Name.trim().length < 3) {
        nameErrorMessage.push('Name should contain a minimum of 3 characters');
      }

      const phoneErrorMessage = [];
      if (!isValidPhone) {
        phoneErrorMessage.push('The phone number should be a valid Indian phone number');
      }

      return {
        name: isValidName,
        phone: isValidPhone,
        nameErrorMessage: isValidName ? '' : nameErrorMessage.join(', '),
        phoneErrorMessage: isValidPhone ? '' : phoneErrorMessage.join(', '),
      };
    });

    setCsvData(filteredData);
    setValidationErrors(validationErrors);
  };

  // Function to handle download of the edited data as a CSV file
  const handleDownload = () => {
    const csvContent = Papa.unparse(csvData);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'edited_data.csv');
    document.body.appendChild(link);
    link.click();
  };

  // Function to handle the submit button click
  const handleSubmit = () => {
    if (!isFileUploaded) {
      alert('Please upload a CSV file.');
      return;
    }
    setIsSubmitted(true);
    setShowTable(true);
  };

  // Effect to update the visibility of the table when isSubmitted is true
  useEffect(() => {
    if (isSubmitted) {
      setShowTable(true);
      setShouldShowTable(true);
    }
  }, [isSubmitted]);

  // Function to add a new row to the CSV data
  const handleAddRow = () => {
    setCsvData((prevData) => [
      ...prevData,
      {
        Name: '',
        'Phone Number': '',
        Address: '',
      },
    ]);
    setValidationErrors((prevErrors) => [
      ...prevErrors,
      {
        name: true,
        phone: true,
        nameErrorMessage: '',
        phoneErrorMessage: '',
      },
    ]);
  };

  // Return the required state variables and functions
  return {
    csvData,
    setCsvData,
    validationErrors,
    setValidationErrors,
    isFileUploaded,
    setIsFileUploaded,
    fileType,
    setFileType,
    showErrorMessage,
    setShowErrorMessage,
    isSubmitted,
    setIsSubmitted,
    showTable,
    setShowTable,
    shouldShowTable,
    setShouldShowTable,
    editingRowIndex,
    setEditingRowIndex,
    editedRowData,
    setEditedRowData,
    deletingRowIndex,
    setDeletingRowIndex,
    handleEditRow,
    handleSaveEdit,
    handleCancelEdit,
    handleUpdateRow,
    handleOpenDeleteConfirmation,
    handleCloseDeleteConfirmation,
    handleConfirmDelete,
    handleFileChange,
    validateData,
    handleDownload,
    handleSubmit,
    handleAddRow,
  };
};
