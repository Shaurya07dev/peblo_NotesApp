import {
  db,
  collection,
  doc,
  addDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from "@/lib/firebase";
import { nanoid } from "nanoid";

const NOTES_COLLECTION = "notes";

/**
 * Create a new note in Firestore.
 */
export async function createNote(userId) {
  const noteData = {
    userId,
    title: "",
    content: "",
    tags: [],
    category: "general",
    isArchived: false,
    isPublic: false,
    shareId: nanoid(10),
    aiSummary: null,
    aiActionItems: null,
    aiSuggestedTitle: null,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, NOTES_COLLECTION), noteData);
  return { id: docRef.id, ...noteData };
}

/**
 * Fetch all notes for a user, with optional search/filter.
 */
export async function fetchNotes(userId, { searchQuery = "", filterTag = "", sortBy = "updatedAt" } = {}) {
  try {
    const notesRef = collection(db, NOTES_COLLECTION);
    let snapshot;

    try {
      // Try the indexed query first (requires composite index)
      const orderedQuery = query(
        notesRef,
        where("userId", "==", userId),
        orderBy(sortBy, "desc")
      );
      snapshot = await getDocs(orderedQuery);
    } catch (indexError) {
      // Fallback: query without orderBy (no composite index needed)
      console.warn("Index not ready, using fallback query:", indexError.message);
      const fallbackQuery = query(notesRef, where("userId", "==", userId));
      snapshot = await getDocs(fallbackQuery);
    }

    let notes = snapshot.docs.map((d) => ({
      id: d.id,
      ...d.data(),
      // Convert Firestore timestamps to ISO strings for serialization
      createdAt: d.data().createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
      updatedAt: d.data().updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    }));

    // Client-side sort (always apply to guarantee correct order)
    notes.sort((a, b) => new Date(b[sortBy]) - new Date(a[sortBy]));

    // Client-side filtering — simpler than complex Firestore queries
    if (filterTag) {
      notes = notes.filter((n) => n.tags.includes(filterTag));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      notes = notes.filter(
        (n) =>
          (n.title || "").toLowerCase().includes(q) ||
          (n.content || "").toLowerCase().includes(q)
      );
    }

    // Filter out archived notes by default
    notes = notes.filter((n) => !n.isArchived);

    return notes;
  } catch (error) {
    console.error("Error fetching notes:", error);
    throw error;
  }
}

/**
 * Fetch a single note by ID.
 */
export async function fetchNote(noteId) {
  const docRef = doc(db, NOTES_COLLECTION, noteId);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) {
    return null;
  }

  const data = docSnap.data();
  return {
    id: docSnap.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

/**
 * Update a note's fields.
 */
export async function updateNote(noteId, updates) {
  const docRef = doc(db, NOTES_COLLECTION, noteId);
  await updateDoc(docRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

/**
 * Delete a note.
 */
export async function deleteNoteById(noteId) {
  const docRef = doc(db, NOTES_COLLECTION, noteId);
  await deleteDoc(docRef);
}

/**
 * Toggle the public sharing state of a note.
 */
export async function toggleShareNote(noteId, isPublic) {
  await updateNote(noteId, { isPublic });
}

/**
 * Fetch a note by its public share ID (no auth required).
 */
export async function fetchNoteByShareId(shareId) {
  const notesRef = collection(db, NOTES_COLLECTION);
  const q = query(
    notesRef,
    where("shareId", "==", shareId),
    where("isPublic", "==", true)
  );

  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;

  const d = snapshot.docs[0];
  const data = d.data();
  return {
    id: d.id,
    ...data,
    createdAt: data.createdAt?.toDate?.()?.toISOString() || new Date().toISOString(),
    updatedAt: data.updatedAt?.toDate?.()?.toISOString() || new Date().toISOString(),
  };
}

/**
 * Get all unique tags used by a user.
 */
export async function fetchUserTags(userId) {
  const notesRef = collection(db, NOTES_COLLECTION);
  const q = query(notesRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const tagSet = new Set();
  snapshot.docs.forEach((d) => {
    const tags = d.data().tags || [];
    tags.forEach((t) => tagSet.add(t));
  });

  return Array.from(tagSet).sort();
}

/**
 * Get productivity insights for a user.
 */
export async function fetchInsights(userId) {
  const notesRef = collection(db, NOTES_COLLECTION);
  const q = query(notesRef, where("userId", "==", userId));
  const snapshot = await getDocs(q);

  const notes = snapshot.docs.map((d) => ({
    ...d.data(),
    createdAt: d.data().createdAt?.toDate?.() || new Date(),
    updatedAt: d.data().updatedAt?.toDate?.() || new Date(),
  }));

  const now = new Date();
  const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

  // Tag frequency
  const tagCounts = {};
  notes.forEach((n) => {
    (n.tags || []).forEach((t) => {
      tagCounts[t] = (tagCounts[t] || 0) + 1;
    });
  });

  // Notes per day (last 7 days)
  const dailyActivity = {};
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now.getTime() - i * 24 * 60 * 60 * 1000);
    const key = date.toISOString().split("T")[0];
    dailyActivity[key] = { created: 0, updated: 0 };
  }

  notes.forEach((n) => {
    const createdKey = n.createdAt.toISOString().split("T")[0];
    const updatedKey = n.updatedAt.toISOString().split("T")[0];
    if (dailyActivity[createdKey]) dailyActivity[createdKey].created++;
    if (dailyActivity[updatedKey]) dailyActivity[updatedKey].updated++;
  });

  // AI usage
  const aiUsedCount = notes.filter((n) => n.aiSummary).length;

  // Recent notes (last 7 days)
  const recentNotes = notes.filter((n) => n.updatedAt >= sevenDaysAgo).length;

  return {
    totalNotes: notes.length,
    recentNotes,
    aiUsedCount,
    tagCounts,
    dailyActivity,
    topTags: Object.entries(tagCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8),
  };
}
