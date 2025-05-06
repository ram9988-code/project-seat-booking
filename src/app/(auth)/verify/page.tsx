export default function page() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-green-50 px-4">
      <div className="rounded-2xl bg-white p-8 shadow-xl text-center max-w-md">
        <div className="mb-4">
          <svg
            className="mx-auto h-16 w-16 text-green-500"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12l2 2 4-4m5 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-semibold text-gray-800 mb-2">
          Email Verified
        </h1>
        <p className="text-gray-600 mb-6">
          Your email has been successfully verified. You can now continue using
          all features.
        </p>
      </div>
    </div>
  );
}
