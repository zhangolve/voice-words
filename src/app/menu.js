import Link from 'next/link';

function Menu() {
  return (
    <>
    <div className="flex bg-blue-500 text-white p-4">
            <Link href="/" className="mx-2 hover:bg-blue-700 px-2 py-1 rounded">Home</Link>
            <Link href="/search" className="mx-2 hover:bg-blue-700 px-2 py-1 rounded">Search</Link>
            <Link href="/collection" className="mx-2 hover:bg-blue-700 px-2 py-1 rounded">Collection</Link>
    </div>
    </>
  );
}

export default Menu;
