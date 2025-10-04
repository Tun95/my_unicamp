import { Helmet } from "react-helmet-async";
import { Link, useNavigate } from "react-router-dom";

function ErrorBoundary() {
  const navigate = useNavigate();

  return (
    <>
      <Helmet>
        <title>Error 404</title>
      </Helmet>
      <div className="fixed inset-0 flex items-center justify-center bg-white dark:bg-gray-900">
        <div className="max-w-4xl w-full p-5 text-gray-900 dark:text-gray-50">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-10 lg:gap-28 text-center lg:text-left">
            <div className="text-center">
              <h1 className="text-8xl font-extrabold text-red-600">404</h1>
              <h1 className="text-4xl font-extrabold text-red-600">ERROR</h1>
            </div>
            <div className="flex flex-col gap-4">
              <h2 className="text-2xl font-extrabold">Oops!</h2>
              <h2 className="text-2xl font-extrabold">
                We were unable to find what you were looking for.
              </h2>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                The page you have requested cannot be found.
              </p>
              <p className="text-gray-400 dark:text-gray-500 text-sm">
                Error code: Page Not Found
              </p>
              <div className="flex flex-col sm:flex-row justify-center lg:justify-start gap-6 mt-4">
                <Link
                  to="/"
                  className="text-indigo-600 dark:text-indigo-400 underline text-xs hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  Go to the homepage
                </Link>
                <Link
                  to=""
                  onClick={() => navigate(-1)}
                  className="text-indigo-600 dark:text-indigo-400 underline text-xs hover:text-indigo-800 dark:hover:text-indigo-300 transition-colors"
                >
                  Go back
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ErrorBoundary;
