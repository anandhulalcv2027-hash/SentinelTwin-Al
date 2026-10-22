import api from '@/lib/api';
import { Incident, IncidentCreate, IncidentUpdate } from '../types/incident';

export const incidentService = {
  getIncidents: async (status?: string): Promise<Incident[]> => {
    const params = status ? { incident_status: status } : {};
    const response = await api.get('/incidents/', { params });
    return response.data;
  },

  getIncident: async (id: string): Promise<Incident> => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  createIncident: async (data: IncidentCreate): Promise<Incident> => {
    const response = await api.post('/incidents/', data);
    return response.data;
  },

  updateIncident: async (id: string, data: IncidentUpdate): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },
};
