import axios from 'axios';
import { mockStudents } from '../data/mockStudents';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// In-memory storage for students during development
let studentsStore = [...mockStudents];

/**
 * Get all students
 */
export async function getAllStudents() {
  try {
    // Try real API first
    const response = await API_INSTANCE.get('/students');
    return response.data;
  } catch (error) {
    // Fallback to mock data
    return studentsStore;
  }
}

/**
 * Get single student by ID
 */
export async function getStudentById(id) {
  try {
    const response = await API_INSTANCE.get(`/students/${id}`);
    return response.data;
  } catch (error) {
    return studentsStore.find(s => s.id === id);
  }
}

/**
 * Get students by course
 */
export async function getStudentsByCourse(course) {
  const allStudents = await getAllStudents();
  return allStudents.filter(s => s.course === course);
}

/**
 * Get students by semester
 */
export async function getStudentsBySemester(semester) {
  const allStudents = await getAllStudents();
  return allStudents.filter(s => s.semester === semester);
}

/**
 * Create new student
 */
export async function createStudent(studentData) {
  try {
    const response = await API_INSTANCE.post('/students', studentData);
    return response.data;
  } catch (error) {
    // Fallback - create in mock store
    const newStudent = {
      id: Math.max(...studentsStore.map(s => s.id), 0) + 1,
      ...studentData
    };
    studentsStore.push(newStudent);
    return newStudent;
  }
}

/**
 * Update student
 */
export async function updateStudent(id, studentData) {
  try {
    const response = await API_INSTANCE.put(`/students/${id}`, studentData);
    return response.data;
  } catch (error) {
    // Fallback - update in mock store
    const index = studentsStore.findIndex(s => s.id === id);
    if (index !== -1) {
      studentsStore[index] = { ...studentsStore[index], ...studentData };
      return studentsStore[index];
    }
    throw new Error('Student not found');
  }
}

/**
 * Delete student
 */
export async function deleteStudent(id) {
  try {
    await API_INSTANCE.delete(`/students/${id}`);
    return { success: true };
  } catch (error) {
    // Fallback - delete from mock store
    const index = studentsStore.findIndex(s => s.id === id);
    if (index !== -1) {
      studentsStore.splice(index, 1);
      return { success: true };
    }
    throw new Error('Student not found');
  }
}

export default {
  getAllStudents,
  getStudentById,
  getStudentsByCourse,
  getStudentsBySemester,
  createStudent,
  updateStudent,
  deleteStudent
};
