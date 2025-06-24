import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for authentication guards
 * Provides utilities for protecting components and redirecting users
 */
export const useAuthGuard = () => {
  const { isAuthenticated, isLoading, user, hasRole, hasAnyRole, hasPermission } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  /**
   * Redirect to login if not authenticated
   */
  const requireAuth = (redirectPath = '/login') => {
    useEffect(() => {
      if (!isLoading && !isAuthenticated) {
        navigate(redirectPath, { 
          state: { from: location.pathname },
          replace: true 
        });
      }
    }, [isAuthenticated, isLoading, redirectPath]);
  };

  /**
   * Redirect authenticated users away from auth pages
   */
  const redirectIfAuthenticated = (redirectPath = null) => {
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        const targetPath = redirectPath || getDefaultRedirectPath(user?.role);
        navigate(targetPath, { replace: true });
      }
    }, [isAuthenticated, isLoading, redirectPath]);
  };

  /**
   * Require specific roles
   */
  const requireRoles = (roles = [], fallbackPath = null) => {
    useEffect(() => {
      if (!isLoading && isAuthenticated && !hasAnyRole(roles)) {
        const targetPath = fallbackPath || getDefaultRedirectPath(user?.role);
        navigate(targetPath, { replace: true });
      }
    }, [isAuthenticated, isLoading, user?.role, roles, fallbackPath]);
  };

  /**
   * Require specific permissions
   */
  const requirePermissions = (permissions = [], fallbackPath = null) => {
    useEffect(() => {
      if (!isLoading && isAuthenticated) {
        const hasRequiredPermission = permissions.some(permission => 
          hasPermission(permission)
        );
        
        if (!hasRequiredPermission) {
          const targetPath = fallbackPath || getDefaultRedirectPath(user?.role);
          navigate(targetPath, { replace: true });
        }
      }
    }, [isAuthenticated, isLoading, user?.role, permissions, fallbackPath]);
  };

  /**
   * Check if user can access a specific route
   */
  const canAccess = (requiredRoles = [], requiredPermissions = []) => {
    if (!isAuthenticated) return false;
    
    // Check roles
    if (requiredRoles.length > 0 && !hasAnyRole(requiredRoles)) {
      return false;
    }
    
    // Check permissions
    if (requiredPermissions.length > 0) {
      const hasRequiredPermission = requiredPermissions.some(permission => 
        hasPermission(permission)
      );
      if (!hasRequiredPermission) return false;
    }
    
    return true;
  };

  /**
   * Get navigation items based on user role and permissions
   */
  const getAuthorizedNavItems = (navItems = []) => {
    return navItems.filter(item => {
      if (!item.requiredRoles && !item.requiredPermissions) return true;
      return canAccess(item.requiredRoles, item.requiredPermissions);
    });
  };

  return {
    // State
    isAuthenticated,
    isLoading,
    user,
    
    // Guards
    requireAuth,
    redirectIfAuthenticated,
    requireRoles,
    requirePermissions,
    
    // Utilities
    canAccess,
    getAuthorizedNavItems,
    hasRole,
    hasAnyRole,
    hasPermission,
  };
};

/**
 * Get default redirect path based on user role
 */
const getDefaultRedirectPath = (role) => {
  const rolePaths = {
    admin: '/dashboardv1',
    teacher: '/',
    student: '/',
    committeeMember: '/committee-research',
  };
  
  return rolePaths[role] || '/';
};

/**
 * Hook for role-based component rendering
 */
export const useRoleAccess = () => {
  const { user, hasRole, hasAnyRole, hasPermission } = useAuth();

  const isAdmin = () => hasRole('admin');
  const isTeacher = () => hasRole('teacher');
  const isStudent = () => hasRole('student');
  const isCommittee = () => hasRole('committeeMember');
  
  const isTeacherOrAdmin = () => hasAnyRole(['teacher', 'admin']);
  const isStudentOrTeacher = () => hasAnyRole(['student', 'teacher']);

  return {
    user,
    isAdmin,
    isTeacher,
    isStudent,
    isCommittee,
    isTeacherOrAdmin,
    isStudentOrTeacher,
    hasRole,
    hasAnyRole,
    hasPermission,
  };
};

/**
 * Hook for conditional rendering based on authentication
 */
export const useAuthRender = () => {
  const { isAuthenticated, user } = useAuth();
  const { isAdmin, isTeacher, isStudent, isCommittee } = useRoleAccess();

  const renderForAuth = (component) => {
    return isAuthenticated ? component : null;
  };

  const renderForGuest = (component) => {
    return !isAuthenticated ? component : null;
  };

  const renderForRole = (role, component) => {
    const roleCheckers = {
      admin: isAdmin,
      teacher: isTeacher,
      student: isStudent,
      committee: isCommittee,
    };
    
    return roleCheckers[role]?.() ? component : null;
  };

  const renderForRoles = (roles, component) => {
    const hasAnyRequiredRole = roles.some(role => {
      const roleCheckers = {
        admin: isAdmin,
        teacher: isTeacher,
        student: isStudent,
        committee: isCommittee,
      };
      return roleCheckers[role]?.();
    });
    
    return hasAnyRequiredRole ? component : null;
  };

  return {
    renderForAuth,
    renderForGuest,
    renderForRole,
    renderForRoles,
  };
};

export default useAuthGuard;
