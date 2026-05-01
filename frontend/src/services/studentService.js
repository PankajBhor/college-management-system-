import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
const API_INSTANCE = axios.create({
  baseURL: API_BASE_URL,
  headers: {}
});

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) {
    config.headers.Authorization = authHeader;
  }
  return config;
});

/**
 * Get all students
 */
export async function getAllStudents() {
  try {
    const response = await API_INSTANCE.get('/students');
    return response.data;
  } catch (error) {
    console.error('Error fetching students:', error.message);
    throw error;
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
    console.error('Error fetching student:', error.message);
    throw error;
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
    console.error('Error creating student:', error.message);
    throw error;
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
    console.error('Error updating student:', error.message);
    throw error;
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
    console.error('Error deleting student:', error.message);
    throw error;
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
