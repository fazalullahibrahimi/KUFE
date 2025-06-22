import React, { createContext, useContext, useReducer, useEffect } from "react";
import { authService } from "../services/authService";

// Auth action types
const AUTH_ACTIONS = {
  LOGIN_START: "LOGIN_START",
  LOGIN_SUCCESS: "LOGIN_SUCCESS",
  LOGIN_FAILURE: "LOGIN_FAILURE",
  LOGOUT: "LOGOUT",
  REGISTER_START: "REGISTER_START",
  REGISTER_SUCCESS: "REGISTER_SUCCESS",
  REGISTER_FAILURE: "REGISTER_FAILURE",
  REFRESH_TOKEN: "REFRESH_TOKEN",
  SET_USER: "SET_USER",
  CLEAR_ERROR: "CLEAR_ERROR",
  SET_LOADING: "SET_LOADING",
};

// Initial state
const initialState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: true,
  error: null,
  isLoginLoading: false,
  isRegisterLoading: false,
};

// Auth reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case AUTH_ACTIONS.LOGIN_START:
      return {
        ...state,
        isLoginLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_SUCCESS:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoginLoading: false,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.LOGIN_FAILURE:
      return {
        ...state,
        user: null,
        token: null,
        isAuthenticated: false,
        isLoginLoading: false,
        isLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.REGISTER_START:
      return {
        ...state,
        isRegisterLoading: true,
        error: null,
      };

    case AUTH_ACTIONS.REGISTER_SUCCESS:
      return {
        ...state,
        isRegisterLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.REGISTER_FAILURE:
      return {
        ...state,
        isRegisterLoading: false,
        error: action.payload,
      };

    case AUTH_ACTIONS.LOGOUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case AUTH_ACTIONS.SET_USER:
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };

    case AUTH_ACTIONS.REFRESH_TOKEN:
      return {
        ...state,
        token: action.payload,
      };

    case AUTH_ACTIONS.CLEAR_ERROR:
      return {
        ...state,
        error: null,
      };

    case AUTH_ACTIONS.SET_LOADING:
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

// Create context
const AuthContext = createContext();

// Auth provider component
export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        const userString = localStorage.getItem("user");

        if (token && userString) {
          const user = JSON.parse(userString);

          // Verify token is still valid
          const isValid = await authService.verifyToken(token);

          if (isValid) {
            // Ensure user image is properly set
            if (!user.image || user.image === "default-user.jpg") {
              user.image = "default-user.jpg";
            }

            // Set the full image URL
            user.imageUrl = `http://localhost:4400/public/img/users/${user.image}`;

            dispatch({
              type: AUTH_ACTIONS.SET_USER,
              payload: { user, token },
            });
          } else {
            // Token is invalid, clear storage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
          }
        } else {
          dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        dispatch({ type: AUTH_ACTIONS.SET_LOADING, payload: false });
      }
    };

    initializeAuth();
  }, []);

  // Login function
  const login = async (credentials) => {
    dispatch({ type: AUTH_ACTIONS.LOGIN_START });

    try {
      const response = await authService.login(credentials);

      if (response.success) {
        const { user, token } = response.data;

        // Ensure user image is properly set
        if (!user.image || user.image === "default-user.jpg") {
          user.image = "default-user.jpg";
        }

        // Set the full image URL
        user.imageUrl = `http://localhost:4400/public/img/users/${user.image}`;

        // Store in localStorage
        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(user));

        dispatch({
          type: AUTH_ACTIONS.LOGIN_SUCCESS,
          payload: { user, token },
        });

        return { success: true, user };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Login failed";
      dispatch({
        type: AUTH_ACTIONS.LOGIN_FAILURE,
        payload: errorMessage,
      });

      // Re-throw the error so the Login component can handle specific cases
      throw error;
    }
  };

  // Register function
  const register = async (userData) => {
    dispatch({ type: AUTH_ACTIONS.REGISTER_START });

    try {
      const response = await authService.register(userData);

      if (response.success) {
        dispatch({ type: AUTH_ACTIONS.REGISTER_SUCCESS });
        return { success: true, data: response.data };
      } else {
        throw new Error(response.message || "Registration failed");
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || error.message || "Registration failed";
      dispatch({
        type: AUTH_ACTIONS.REGISTER_FAILURE,
        payload: errorMessage,
      });
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = async () => {
    try {
      // Call logout API if needed
      await authService.logout();
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      // Clear local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      dispatch({ type: AUTH_ACTIONS.LOGOUT });
    }
  };

  // Clear error function
  const clearError = () => {
    dispatch({ type: AUTH_ACTIONS.CLEAR_ERROR });
  };

  // Check if user has specific role
  const hasRole = (role) => {
    return state.user?.role === role;
  };

  // Check if user has any of the specified roles
  const hasAnyRole = (roles) => {
    return roles.includes(state.user?.role);
  };

  // Get user permissions based on role
  const getUserPermissions = () => {
    const role = state.user?.role;

    const permissions = {
      admin: ["manage_all", "view_all", "create_all", "edit_all", "delete_all"],
      teacher: [
        "view_students",
        "manage_marks",
        "view_courses",
        "create_content",
      ],
      student: ["view_marks", "view_courses", "submit_assignments"],
      committee: ["review_research", "manage_quality"],
    };

    return permissions[role] || [];
  };

  // Check if user has specific permission
  const hasPermission = (permission) => {
    const userPermissions = getUserPermissions();
    return (
      userPermissions.includes(permission) ||
      userPermissions.includes("manage_all")
    );
  };

  // Update user data
  const updateUser = (userData) => {
    // Add the full image URL
    userData.imageUrl = `http://localhost:4400/public/img/users/${userData.image}`;
    
    // Update localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    
    // Update state
    dispatch({
      type: AUTH_ACTIONS.SET_USER,
      payload: { user: userData, token: state.token },
    });
  };

  const value = {
    // State
    ...state,

    // Actions
    login,
    register,
    logout,
    clearError,
    updateUser,

    // Utilities
    hasRole,
    hasAnyRole,
    hasPermission,
    getUserPermissions,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
};

export default AuthContext;
