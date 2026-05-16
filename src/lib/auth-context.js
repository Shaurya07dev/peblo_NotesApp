"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
import { auth, db, doc, getDoc, setDoc } from "@/lib/firebase";
import { setDoc as firestoreSetDoc } from "firebase/firestore";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // Fetch additional user data from Firestore
        try {
          const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
          const userData = userDoc.exists() ? userDoc.data() : {};
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || userData.name || "",
            ...userData,
          });
        } catch (error) {
          console.error("Error fetching user data:", error);
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName || "",
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = useCallback(async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  }, []);

  const signup = useCallback(async (name, email, password) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update display name
      await updateProfile(result.user, { displayName: name });

      // Create user document in Firestore
      await firestoreSetDoc(doc(db, "users", result.user.uid), {
        name,
        email,
        createdAt: new Date().toISOString(),
        aiUsageCount: 0,
      });

      return { success: true, user: result.user };
    } catch (error) {
      return { success: false, error: getAuthErrorMessage(error.code) };
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await signOut(auth);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

// Map Firebase error codes to user-friendly messages
function getAuthErrorMessage(code) {
  const messages = {
    "auth/email-already-in-use": "An account with this email already exists.",
    "auth/invalid-email": "Please enter a valid email address.",
    "auth/weak-password": "Password must be at least 6 characters.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password. Please try again.",
    "auth/too-many-requests": "Too many attempts. Please try again later.",
    "auth/invalid-credential": "Invalid email or password.",
  };
  return messages[code] || "An unexpected error occurred. Please try again.";
}
