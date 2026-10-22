import api from '@/lib/api';
import { Incident, IncidentCreate, IncidentUpdate } from '../types/incident';

const INCIDENTS_PREFIX = '/api/v1/incidents';

export const incidentService = {
  getIncidents: async (status?: string): Promise<Incident[]> => {
    const params = status ? { incident_status: status } : {};
    const response = await api.get(`${INCIDENTS_PREFIX}/`, { params });
    return response.data;
  },

  getIncident: async (id: string): Promise<Incident> => {
    const response = await api.get(`${INCIDENTS_PREFIX}/${id}`);
    return response.data;
  },

  createIncident: async (data: IncidentCreate): Promise<Incident> => {
    const response = await api.post(`${INCIDENTS_PREFIX}/`, data);
    return response.data;
  },

  updateIncident: async (id: string, data: IncidentUpdate): Promise<Incident> => {
    const response = await api.put(`${INCIDENTS_PREFIX}/${id}`, data);
    return response.data;
  },
};
