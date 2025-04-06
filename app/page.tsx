import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center bg-purple-50 text-purple-800">
      {/* Top-right corner buttons */}
      <div className="absolute top-4 right-4 flex space-x-4">
        <Link href="/login">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
            Login
          </button>
        </Link>
        <Link href="/signup">
          <button className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 cursor-pointer">
            Sign Up
          </button>
        </Link>
      </div>

      {/* Main content */}
      <h2 className="text-4xl font-semibold mt-12">
        Collaborative Calendar App
      </h2>
      <p className="mt-6 text-center max-w-2xl">
        Welcome to the Collaborative Calendar App! Plan, organize, and share your schedules effortlessly with friends, family, or colleagues. 
        Our app is designed to make collaboration seamless and efficient, ensuring you never miss an important event.
      </p>
    </div>
  );
}
