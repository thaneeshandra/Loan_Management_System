import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { FiEye, FiX, FiDownload, FiFileText } from 'react-icons/fi';
import api from '../../services/api';
import { DOCUMENT_TYPES, DOCUMENT_CATEGORIES, MAX_FILE_SIZE, SUPPORTED_FILE_TYPES } from '../../constants/documentConstants';

const documentValidationSchema = Yup.object({
  documentType: Yup.string().required('Document type is required'),
  documentCategory: Yup.string().required('Document category is required'),
  file: Yup.mixed()
    .required('Please select a file to upload')
    .test('fileSize', 'File size must be less than 5MB', (value) => {
      return value && value.size <= MAX_FILE_SIZE;
    })
    .test('fileType', 'Only PDF, JPG, JPEG, and PNG files are allowed', (value) => {
      return value && SUPPORTED_FILE_TYPES.includes(value.type);
    })
    .test('fileNameLength', 'File name must be 30 characters or less', (value) => {
      return value && value.name && value.name.length <= 30;
    })
});

// Preview Modal Component
const PreviewModal = ({ file, isOpen, onClose }) => {
  if (!isOpen || !file) return null;

  const fileType = file.type;
  const fileName = file.name;
  const fileUrl = URL.createObjectURL(file);

  const renderPreview = () => {
    if (fileType === 'application/pdf') {
      return (
        <div className="w-full h-96 border rounded">
          <iframe
            src={fileUrl}
            className="w-full h-full"
            title="PDF Preview"
          />
        </div>
      );
    } else if (fileType.startsWith('image/')) {
      return (
        <div className="flex justify-center">
          <img
            src={fileUrl}
            alt="Preview"
            className="max-w-full max-h-96 object-contain rounded"
          />
        </div>
      );
    } else {
      return (
        <div className="text-center py-8">
          <FiFileText className="w-16 h-16 mx-auto text-gray-400 mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Preview not available for this file type
          </p>
        </div>
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Document Preview
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
              {fileName}
            </p>
          </div>
          <div className="flex items-center space-x-2">
            <a
              href={fileUrl}
              download={fileName}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
              title="Download"
            >
              <FiDownload className="w-5 h-5" />
            </a>
            <button
              onClick={onClose}
              className="p-2 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
            >
              <FiX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="p-4 overflow-auto max-h-[calc(90vh-120px)]">
          {renderPreview()}
        </div>
      </div>
    </div>
  );
};

const DocumentUploader = ({ loanId }) => {
  const [notification, setNotification] = useState({ show: false, type: '', message: '' });
  const [documents, setDocuments] = useState([]);
  const [selectedType, setSelectedType] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewModal, setPreviewModal] = useState({ isOpen: false, file: null });

  const initialValues = {
    documentType: '',
    documentCategory: '',
    file: null
  };

  const handleFileChange = (event, setFieldValue) => {
    const file = event.currentTarget.files[0];
    setFieldValue("file", file);
    setSelectedFile(file);
  };

  const openPreview = (file) => {
    setPreviewModal({ isOpen: true, file });
  };

  const closePreview = () => {
    setPreviewModal({ isOpen: false, file: null });
  };

  const handleSubmit = async (values, { setSubmitting, resetForm }) => {
    try {
      setNotification({ show: false });
      const formData = new FormData();
      formData.append('file', values.file);
      formData.append('documentType', values.documentType);
      formData.append('documentCategory', values.documentCategory);
      formData.append('loanId', loanId);

      const response = await api.post('/documents', formData);

      setDocuments([...documents, response.data]);
      setNotification({
        show: true,
        type: 'success',
        message: 'Document uploaded successfully!'
      });
      resetForm();
      setSelectedFile(null);
    } catch (error) {
      console.error('Error uploading document:', error);
      setNotification({
        show: true,
        type: 'error',
        message: error.response?.data?.message || 'Failed to upload document'
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-900 border dark:border-gray-700 rounded-lg shadow-md p-6 mt-4 transition-colors duration-300">
      <h3 className="text-lg font-semibold mb-4 text-gray-800 dark:text-gray-100">Supporting Documents</h3>
      
      {notification.show && (
        <div className={`mb-4 p-3 rounded ${
          notification.type === 'success' 
            ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 border border-green-200 dark:border-green-700' 
            : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-700'
        }`}>
          {notification.message}
        </div>
      )}
      
      {/* Show uploaded documents */}
      {documents.length > 0 && (
        <div className="mb-6">
          <h4 className="font-medium mb-2 text-gray-800 dark:text-gray-100">Uploaded Documents:</h4>
          <ul className="list-disc pl-5 space-y-1">
            {documents.map((doc, index) => (
              <li key={index} className="text-sm text-gray-700 dark:text-gray-200">
                {doc.documentCategory} - {doc.documentType} 
                <span className="ml-2 text-green-600 dark:text-green-400 text-xs">(Uploaded)</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      <Formik
        initialValues={initialValues}
        validationSchema={documentValidationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, setFieldValue, values }) => (
          <Form className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Document Type */}
            <div>
              <label htmlFor="documentType" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Document Type <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="documentType"
                name="documentType"
                onChange={e => {
                  setFieldValue("documentType", e.target.value);
                  setSelectedType(e.target.value);
                }}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Document Type</option>
                {Object.entries(DOCUMENT_TYPES).map(([key, label]) => (
                  <option key={key} value={key}>{label}</option>
                ))}
              </Field>
              <ErrorMessage name="documentType" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* Document Category */}
            <div>
              <label htmlFor="documentCategory" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Document Category <span className="text-red-500">*</span>
              </label>
              <Field
                as="select"
                id="documentCategory"
                name="documentCategory"
                disabled={!selectedType}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-gray-100"
              >
                <option value="">Select Category</option>
                {selectedType && DOCUMENT_CATEGORIES[selectedType]?.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </Field>
              <ErrorMessage name="documentCategory" component="div" className="text-red-500 text-sm mt-1" />
            </div>

            {/* File Upload */}
            <div className="col-span-full">
              <label htmlFor="file" className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
                Upload Document <span className="text-red-500">*</span>
              </label>
              <input
                id="file"
                name="file"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={(event) => handleFileChange(event, setFieldValue)}
                className="w-full border px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500
                  bg-white dark:bg-gray-800
                  border-gray-300 dark:border-gray-700
                  text-gray-900 dark:text-gray-100"
              />
              <ErrorMessage name="file" component="div" className="text-red-500 text-sm mt-1" />
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Supported: PDF, JPG, PNG (Max 5MB)</p>
              
              {/* File Preview Section */}
              {selectedFile && (
                <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800 rounded border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="flex-shrink-0">
                        {selectedFile.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(selectedFile)}
                            alt="Thumbnail"
                            className="w-12 h-12 object-cover rounded border"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-red-100 dark:bg-red-900 flex items-center justify-center rounded border">
                            <FiFileText className="w-6 h-6 text-red-600 dark:text-red-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                          {selectedFile.name}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => openPreview(selectedFile)}
                      className="flex items-center space-x-1 px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
                    >
                      <FiEye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="col-span-full mt-4">
              <button
                type="submit"
                disabled={isSubmitting || !loanId}
                className={`${
                  isSubmitting || !loanId
                    ? "bg-gray-400 dark:bg-gray-700"
                    : "bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600"
                } text-white py-2 px-4 rounded-md font-medium transition-colors`}
              >
                {isSubmitting ? "Uploading..." : "Upload Document"}
              </button>
              {!loanId && (
                <p className="text-sm text-amber-600 dark:text-amber-400 mt-2">
                  Submit the loan application first to enable document uploads
                </p>
              )}
            </div>
          </Form>
        )}
      </Formik>

      {/* Preview Modal */}
      <PreviewModal
        file={previewModal.file}
        isOpen={previewModal.isOpen}
        onClose={closePreview}
      />

      {/* Help Section */}
      <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mt-6">
        <h3 className="text-lg font-semibold text-blue-800 dark:text-blue-200 mb-2">
          Need Help with Document Upload?
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-700 dark:text-blue-300">
          <div>
            <h4 className="font-medium mb-1">Supported Formats:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>PDF documents (recommended)</li>
              <li>JPEG/JPG images</li>
              <li>PNG images</li>
            </ul>
          </div>
          <div>
            <h4 className="font-medium mb-1">File Requirements:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Maximum file size: 5MB</li>
              <li>Clear, readable images</li>
              <li>All text should be visible</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentUploader;