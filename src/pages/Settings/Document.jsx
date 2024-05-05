import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import DotLoader from "../../components/DotLoader";
import { CheckIcon, ExclamationCircleIcon } from "@heroicons/react/24/outline";
import { customModal } from "../../utils/modalUtils";
import { fetchDocument, updateDocument } from "../../config/documents";
import { useModal } from "../../context/ModalContext";

export default function Document() {
  const userId = useSelector(state => state.user.userId);
  const { showModal } = useModal();
  const [isLoading, setIsLoading] = useState(false);
  const [doc, setDoc] = useState([]);
  const [fileDescription, setFileDescription] = useState("");
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchDoc = async () => {
      try {
        const userDoc = await fetchDocument(userId);
        if (userDoc) {
          setDoc(userDoc);
          setFileDescription(userDoc[0].fileDescription || "");
        }
      } catch (error) {
        console.error("Error fetching document:", error);
        customModal({
          showModal,
          title: "Error Fetching",
          text: "Failed to fetch document",
          icon: ExclamationCircleIcon,
          iconBgColor: 'bg-red-100',
          iconTextColor: 'text-red-600',
          showConfirmButton: false,
          timer: 2000
        });
      }
    };

    fetchDoc();
  }, [userId, showModal]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (!fileDescription) {
        throw new Error("File description must be provided.");
      }

      await updateDocument(userId, fileDescription, file, doc?.id);
      customModal({
        showModal,
        title: "Success",
        text: "Document has been updated successfully.",
        icon: CheckIcon,
        timer: 1500
      });

      setFileDescription("");
      setFile(null);
    } catch (error) {
      console.error("Error during document update:", error);
      customModal({
        showModal,
        title: "Error",
        text: `An error occurred: ${error.message}`,
        icon: ExclamationCircleIcon,
        timer: 1500
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    setFile(selectedFile);
  };

  return (
    <div className="grid grid-cols-1 gap-x-8 gap-y-8 pt-10 md:grid-cols-3">
      <div className="px-4 sm:px-0">
        <h2 className="text-base font-semibold leading-7 text-gray-900">
          Document Upload
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-600">
          Ensure there is a (✔️) in front of the file name before submitting.
        </p>
      </div>

      <form className="bg-white shadow-sm ring-1 ring-gray-900/5 sm:rounded-xl md:col-span-2" onSubmit={handleUpdate}>
        <div className="px-4 py-6 sm:p-8">
          <div className="grid max-w-2xl grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label htmlFor="document-name" className="block text-sm font-medium leading-6 text-gray-900">
                Document name
              </label>
              <input
                type="text"
                name="fileDescription"
                id="fileDescription"
                value={fileDescription}
                onChange={(e) => setFileDescription(e.target.value)}
                required
                className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 sm:text-sm"
              />
            </div>

            <div className="sm:col-span-4 flex items-center">
              <input
                type="file"
                name="image"
                id="file"
                className="hidden"
                onChange={handleFileChange}
                accept="image/*,application/pdf"
              />
              <button
                type="button"
                className="rounded-md bg-white px-2.5 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                onClick={() => document.getElementById("file").click()}
              >
                Choose File
              </button>
              <span className="ml-2 text-sm text-gray-500">
                {file ? file.name : doc[0]?.fileName}
                {file && <CheckIcon className="ml-2 h-5 w-5 text-green-500" />}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-x-6 border-t border-gray-900/10 px-4 py-4 sm:px-8">
          <button
            type="submit"
            className="rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
          >
           {isLoading ? (
              <div className="flex w-full justify-center align-middle gap-2">
                <span>Uploading</span>
                <DotLoader />
              </div>
            ) : (
              "Upload Document"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
