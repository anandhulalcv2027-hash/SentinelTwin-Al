import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { ReactFlow, Controls, Background, useNodesState, useEdgesState, Handle, Position } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Network, Server } from 'lucide-react';

const DeviceNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-lg rounded-md bg-[var(--color-bg-surface)] border-2 border-[var(--color-accent)] w-48">
    <Handle type="source" position={Position.Right} />
    <Handle type="target" position={Position.Left} />
    <div className="flex items-center gap-2">
      <Server className="text-[var(--color-accent)]" size={16} />
      <div className="font-bold text-sm truncate text-[var(--color-text-primary)]">{data.label}</div>
    </div>
    <div className="text-xs text-[var(--color-text-muted)] mt-1">{data.device_type}</div>
  </div>
);

const RemoteIPNode = ({ data }: { data: any }) => (
  <div className="px-4 py-2 shadow-lg rounded-md bg-[var(--color-bg-surface)] border-2 border-[var(--color-danger)] w-48">
    <Handle type="target" position={Position.Left} />
    <Handle type="source" position={Position.Right} />
    <div className="flex items-center gap-2">
      <Network className="text-[var(--color-danger)]" size={16} />
      <div className="font-bold text-sm truncate text-[var(--color-text-primary)]">{data.label}</div>
    </div>
    <div className="text-xs text-[var(--color-text-muted)] mt-1">Remote Endpoint</div>
  </div>
);

const nodeTypes = {
  device: DeviceNode,
  remote_ip: RemoteIPNode,
};

export const TopologyPage = () => {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  const { data: topologyData, isLoading } = useQuery({
    queryKey: ['topology'],
    queryFn: async () => {
      const res = await api.get('/analytics/topology');
      return res.data;
    },
    refetchInterval: 30000 // Poll every 30s
  });

  useEffect(() => {
    if (topologyData) {
      // Auto-layout logic (simple horizontal layout)
      const newNodes = topologyData.nodes.map((node: any, idx: number) => {
        const isDevice = node.type === 'device';
        return {
          ...node,
          position: {
            x: isDevice ? 100 : 500,
            y: idx * 100
          }
        };
      });
      setNodes(newNodes);
      
      const newEdges = topologyData.edges.map((edge: any) => ({
        ...edge,
        animated: true,
        style: { stroke: '#ef4444' }
      }));
      setEdges(newEdges);
    }
  }, [topologyData, setNodes, setEdges]);

  if (isLoading) {
    return <div className="flex h-full items-center justify-center">Loading Network Topology...</div>;
  }

  return (
    <div className="h-[calc(100vh-60px)] w-full flex flex-col animate-fade-in bg-[var(--color-bg-base)]">
      <div className="border-b border-[var(--color-border)] flex items-center gap-3" style={{ padding: '2rem' }}>
        <div style={{ padding: '0.6rem', backgroundColor: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', color: 'var(--color-accent)' }}>
          <Network size={24} />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] m-0">Live Network Topology</h1>
          <p className="text-sm text-[var(--color-text-secondary)] mt-1">Real-time endpoint connections discovered from security telemetry</p>
        </div>
      </div>
      <div className="flex-1 bg-[var(--color-bg-overlay)] relative">
        <ReactFlow 
          nodes={nodes} 
          edges={edges} 
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          colorMode="dark"
        >
          <Background color="#3f3f46" gap={16} />
          <Controls />
        </ReactFlow>
      </div>
    </div>
  );
};
