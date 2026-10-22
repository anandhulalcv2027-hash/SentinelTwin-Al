import { useState } from 'react';

import { Shield } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { incidentService } from '../services/incidentService';
import { Incident, IncidentStatus, IncidentSeverity } from '../types/incident';


const severityColors: Record<IncidentSeverity, string> = {
  LOW: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
  MEDIUM: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
  HIGH: 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
  CRITICAL: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
};

const statusColors: Record<IncidentStatus, string> = {
  OPEN: 'bg-red-100 text-red-800 border-red-200',
  ACKNOWLEDGED: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  INVESTIGATING: 'bg-blue-100 text-blue-800 border-blue-200',
  RESOLVED: 'bg-green-100 text-green-800 border-green-200',
  CLOSED: 'bg-gray-100 text-gray-800 border-gray-200',
};

export const IncidentsPage = () => {
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const queryClient = useQueryClient();

  const { data: incidents, isLoading } = useQuery({
    queryKey: ['incidents', filterStatus],
    queryFn: () => incidentService.getIncidents(filterStatus === 'ALL' ? undefined : filterStatus),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Incident> }) => incidentService.updateIncident(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['incidents'] });
    },
  });

  // Websocket updates omitted for now

  const handleStatusChange = (incident: Incident, newStatus: IncidentStatus) => {
    updateMutation.mutate({ id: incident.id, data: { status: newStatus } });
  };

  return (
    <div className="space-y-6 animate-fade-in" style={{ padding: '2rem' }}>
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-3">
          <div style={{ padding: '0.6rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-accent)' }}>
            <Shield size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] m-0">Incident Management</h1>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">Review, triage, and resolve security incidents</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Select value={filterStatus} onValueChange={setFilterStatus} className="w-[180px]">
            <SelectTrigger>
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ALL">All Statuses</SelectItem>
              {Object.values(IncidentStatus).map(status => (
                <SelectItem key={status} value={status}>{status}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : incidents?.length === 0 ? (
        <div className="premium-panel st-card p-12 flex flex-col items-center justify-center text-[var(--color-text-muted)]">
          <p>No incidents found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {incidents?.map((incident) => (
            <div key={incident.id} className="premium-panel st-card overflow-hidden" style={{ padding: 0 }}>
              <div className="bg-[var(--color-bg-overlay)] p-4 border-b border-[var(--color-border)]">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-xl font-bold flex items-center gap-2 m-0 text-[var(--color-text-primary)]">
                      {incident.title}
                      <Badge variant="outline" className={severityColors[incident.severity]}>
                        {incident.severity}
                      </Badge>
                    </h3>
                    <p className="text-[var(--color-text-muted)] mt-1 text-xs">
                      ID: {incident.id} | Created: {new Date(incident.created_at).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline" className={statusColors[incident.status]}>
                      {incident.status}
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="p-4 flex flex-col gap-4">
                <div className="text-sm text-[var(--color-text-secondary)]">
                  {incident.description || 'No description provided.'}
                </div>
                
                <div className="flex items-center justify-between border-t pt-4">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold uppercase text-muted-foreground">Update Status:</span>
                    <Select 
                      value={incident.status} 
                      onValueChange={(val: any) => handleStatusChange(incident, val as IncidentStatus)}
                      className="w-[160px] h-8 text-xs"
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(IncidentStatus).map(status => (
                          <SelectItem key={status} value={status} className="text-xs">
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
