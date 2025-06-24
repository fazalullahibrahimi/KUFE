import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import LoadingSpinner from "../ui/LoadingSpinner";

const ProtectedRoute = ({
  children,
  requiredRoles = [],
  requiredPermissions = [],
  fallbackPath = "/login",
  showUnauthorized = false,
}) => {
  const { isAuthenticated, isLoading, user, hasAnyRole, hasPermission } =
    useAuth();
  const location = useLocation();

  // Show loading spinner while checking authentication
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return (
      <Navigate to={fallbackPath} state={{ from: location.pathname }} replace />
    );
  }

  // Check role-based access
  if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
    if (showUnauthorized) {
      return <UnauthorizedAccess requiredRoles={requiredRoles} />;
    }

    // Redirect based on user role
    const redirectPath = getRedirectPathByRole(user?.role);
    return <Navigate to={redirectPath} replace />;
  }

  // Check permission-based access
  if (requiredPermissions.length > 0) {
    const hasRequiredPermission = requiredPermissions.some((permission) =>
      hasPermission(permission)
    );

    if (!hasRequiredPermission) {
      if (showUnauthorized) {
        return <UnauthorizedAccess requiredPermissions={requiredPermissions} />;
      }

      const redirectPath = getRedirectPathByRole(user?.role);
      return <Navigate to={redirectPath} replace />;
    }
  }

  // User is authenticated and authorized
  return children;
};

// Helper function to get redirect path based on user role
const getRedirectPathByRole = (role) => {
  const rolePaths = {
    admin: "/dashboardv1",
    teacher: "/",
    student: "/",
    committee: "/",
  };

  return rolePaths[role] || "/";
};

// Unauthorized access component
const UnauthorizedAccess = ({
  requiredRoles = [],
  requiredPermissions = [],
}) => {
  const { user } = useAuth();

  return (
    <div className='min-h-screen flex items-center justify-center bg-gray-50'>
      <div className='max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center'>
        <div className='mb-6'>
          <div className='mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100'>
            <svg
              className='h-8 w-8 text-red-600'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z'
              />
            </svg>
          </div>
        </div>

        <h2 className='text-2xl font-bold text-gray-900 mb-4'>Access Denied</h2>

        <p className='text-gray-600 mb-6'>
          You don't have permission to access this page.
        </p>

        <div className='text-sm text-gray-500 mb-6'>
          <p>
            Your role: <span className='font-medium'>{user?.role}</span>
          </p>
          {requiredRoles.length > 0 && (
            <p>
              Required roles:{" "}
              <span className='font-medium'>{requiredRoles.join(", ")}</span>
            </p>
          )}
          {requiredPermissions.length > 0 && (
            <p>
              Required permissions:{" "}
              <span className='font-medium'>
                {requiredPermissions.join(", ")}
              </span>
            </p>
          )}
        </div>

        <div className='space-y-3'>
          <button
            onClick={() => window.history.back()}
            className='w-full bg-[#1D3D6F] text-white py-2 px-4 rounded-lg hover:bg-[#2C4F85] transition-colors'
          >
            Go Back
          </button>

          <button
            onClick={() =>
              (window.location.href = getRedirectPathByRole(user?.role))
            }
            className='w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors'
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

// Role-specific route components
export const AdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const TeacherRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["teacher", "admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const StudentRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["student"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const CommitteeRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["committeeMember", "admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const TeacherOrAdminRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["teacher", "admin"]} {...props}>
    {children}
  </ProtectedRoute>
);

export const StudentOrTeacherRoute = ({ children, ...props }) => (
  <ProtectedRoute requiredRoles={["student", "teacher"]} {...props}>
    {children}
  </ProtectedRoute>
);

export default ProtectedRoute;
