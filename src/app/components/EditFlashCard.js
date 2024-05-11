import React, { useState, useEffect } from "react";
import { useCreateWordExample, formatData } from "../utils";
import { atom, useAtom } from "jotai";

const Modal = ({ isOpen, onClose, flashcard, onSave }) => {
  const { data, setShouldFetch } = useCreateWordExample(flashcard.word);

  const [content, setContent] = useState(flashcard);
  const handleSave = () => {
    onSave({ ...flashcard, ...content });
    onClose();
  };

  const onCreate = () => {
    setShouldFetch(true);
  };

  useEffect(() => {
    if (data) {
      const rurrentContent = data;
      setContent({
        ...content,
        ...rurrentContent,
        translations: content?.translations || [
          rurrentContent.translation_word,
        ],
      });
    }
  }, [content, data]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  Edit Flashcard
                </h3>
                <div className="mt-2">
                  <input
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 font-semibold"
                    name="original"
                    placeholder="Foreign word"
                    autoComplete="off"
                    type="text"
                    value={content.word}
                    onChange={(e) => {
                      setContent({ ...content, word: e.target.value });
                    }}
                  />
                </div>
                <div className="mt-2">
                  <label>translation</label>
                  <input
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 font-semibold"
                    name="translation"
                    placeholder="Translation"
                    autoComplete="off"
                    type="text"
                    value={content.translations[0]}
                    onChange={(e) => {
                      setContent({
                        ...content,
                        translations: [e.target.value],
                      });
                    }}
                  />
                  <label>Notes</label>
                  <textarea
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 font-semibold"
                    name="translation"
                    placeholder="Translation"
                    autoComplete="off"
                    type="text"
                    value={content.note}
                    onChange={(e) => {
                      setContent({ ...content, note: e.target.value });
                    }}
                  />
                  <label>example</label>
                  <textarea
                    className="mt-1 block w-full rounded-md bg-gray-100 border-transparent focus:border-gray-500 focus:bg-white focus:ring-0 font-semibold"
                    name="translation"
                    placeholder="Translation"
                    autoComplete="off"
                    type="text"
                    value={content.sentence}
                    onChange={(e) => {
                      setContent({ ...content, sentence: e.target.value });
                    }}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleSave}
            >
              Save
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCreate}
            >
              Recreate example sentence
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
