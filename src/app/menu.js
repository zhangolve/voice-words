"use client";
import Link from "next/link";
import { signOut } from "next-auth/react";

function Menu() {
  return (
    <div className="flex bg-blue-500 text-white p-4 justify-between">
      <div>
        <Link href="/" className="mx-2 hover:bg-blue-700 px-2 py-1 rounded">
          Home
        </Link>
        <Link
          href="/search"
          className="mx-2 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Search
        </Link>
        <Link
          href="/collection"
          className="mx-2 hover:bg-blue-700 px-2 py-1 rounded"
        >
          Collection
        </Link>
        <Link href="/test" className="mx-2 hover:bg-blue-700 px-2 py-1 rounded">
          test ielts
        </Link>
      </div>
      <Link
        className="mx-2 hover:bg-blue-700 px-2 py-1 rounded"
        href="#"
        onClick={signOut}
      >
        Logout
      </Link>
    </div>
  );
}

export default Menu;
