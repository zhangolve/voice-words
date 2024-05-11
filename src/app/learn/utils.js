import { atom } from "jotai";

export const currentWordAtom = atom(null);

export const retry = async (word) => {
  const due_date = +new Date();
  await fetch("/api/due-date-words", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, due_date, period: 0 }),
  });
};

export const good = async (word, nextPeriod) => {
  const due_date = +new Date() + nextPeriod * 24 * 60 * 60 * 1000;
  await fetch("/api/due-date-words", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, due_date, period: nextPeriod }),
  });
};

export const master = async (word) => {
  const due_date = +new Date() + 9600 * 24 * 60 * 60 * 1000;
  await fetch("/api/due-date-words", {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ word, due_date, period: 960 }),
  });
};
