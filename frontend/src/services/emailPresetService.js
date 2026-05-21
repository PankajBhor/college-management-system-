import axios from 'axios';
import { getAuthHeader } from './authHeader';

const API_BASE_URL = process.env.REACT_APP_API_URL || '/api';
const API_INSTANCE = axios.create({ baseURL: API_BASE_URL, headers: {} });

API_INSTANCE.interceptors.request.use((config) => {
  const authHeader = getAuthHeader();
  if (authHeader) config.headers.Authorization = authHeader;
  if (config.data instanceof FormData) delete config.headers['Content-Type'];
  return config;
});

const buildPresetFormData = (preset, files = []) => {
  const formData = new FormData();
  formData.append('name', preset.name || 'Untitled preset');
  formData.append('subject', preset.subject || 'College update');
  formData.append('body', preset.body || '');
  formData.append('targetScope', preset.targetScope || 'ENQUIRY');
  files.forEach(file => formData.append('attachments', file));
  return formData;
};

export async function getEmailPresets(targetScope) {
  const response = await API_INSTANCE.get('/email-presets', { params: { targetScope } });
  return response.data;
}

export async function createEmailPreset(preset, files = []) {
  const response = await API_INSTANCE.post('/email-presets', buildPresetFormData(preset, files));
  return response.data;
}

export async function updateEmailPreset(id, preset, files = []) {
  const response = await API_INSTANCE.put(`/email-presets/${id}`, buildPresetFormData(preset, files));
  return response.data;
}

export async function deleteEmailPreset(id) {
  const response = await API_INSTANCE.delete(`/email-presets/${id}`);
  return response.data;
}

export async function sendEmailPreset(payload) {
  const response = await API_INSTANCE.post('/email-presets/send', payload);
  return response.data;
}

const emailPresetService = {
  getEmailPresets,
  createEmailPreset,
  updateEmailPreset,
  deleteEmailPreset,
  sendEmailPreset
};

export default emailPresetService;
