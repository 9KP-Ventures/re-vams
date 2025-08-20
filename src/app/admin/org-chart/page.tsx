"use client";

import { useState, useCallback, useEffect } from "react";
// Unique ID generator (uses crypto if available, otherwise fallback)
function generateUniqueId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Date.now().toString() + Math.random().toString(36).substr(2, 9);
}
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, Connection, NodeChange, EdgeChange, Handle, Position, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Save, Eye, Trash2, Users, Link, ArrowRight } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface OrgNode {
  id: string;
  name: string;
  position: string;
  image?: string;
  email?: string;
  phone?: string;
}

interface OrgChart {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
}

const CustomOrgNode = ({ data }: { data: OrgNode }) => {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[200px] shadow-lg">
      {/* Add handles for connecting */}
      <Handle type="target" position={Position.Top} style={{ background: '#555' }} />
      <Handle type="source" position={Position.Bottom} style={{ background: '#555' }} />
      
      <div className="text-center">
        {data.image ? (
          <Image
            src={data.image}
            alt={data.name}
            width={64}
            height={64}
            className="w-16 h-16 rounded-full mx-auto mb-2 object-cover"
            unoptimized
          />
        ) : (
          <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-gray-200 flex items-center justify-center">
            <Users className="w-8 h-8 text-gray-400" />
          </div>
        )}
        <h3 className="font-semibold text-sm">{data.name}</h3>
        <p className="text-xs text-gray-600 mt-1">{data.position}</p>
      </div>
    </div>
  );
};

const nodeTypes = {
  orgNode: CustomOrgNode,
};

export default function CMSPage() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [chartName, setChartName] = useState("New Organizational Chart");
  const [savedCharts, setSavedCharts] = useState<OrgChart[]>([]);
  const [currentChartId, setCurrentChartId] = useState<string | null>(null);

  // Form state for node editing
  const [nodeForm, setNodeForm] = useState({
    name: "",
    position: "",
    image: "",
    email: "",
    phone: ""
  });

  // Form state for edge editing
  const [edgeForm, setEdgeForm] = useState({
    source: "",
    target: "",
    label: ""
  });

  // Load saved charts on component mount
  useEffect(() => {
    loadSavedCharts();
  }, []);

  const loadSavedCharts = () => {
    try {
      const saved = localStorage.getItem('org-charts');
      if (saved) {
        setSavedCharts(JSON.parse(saved));
      }
    } catch (error) {
      console.error('Error loading charts:', error);
    }
  };

  const saveChart = () => {
    if (!chartName.trim()) {
      toast.error("Please enter a chart name");
      return;
    }

    // Prevent duplicate chart names (optional)
    if (
      !currentChartId &&
      savedCharts.some((c) => c.name.trim().toLowerCase() === chartName.trim().toLowerCase())
    ) {
      toast.error("A chart with this name already exists");
      return;
    }

    const chartId = currentChartId || generateUniqueId();

    // Only save serializable node/edge properties
    const serializableNodes = nodes.map((node) => ({
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
    }));
    const serializableEdges = edges.map((edge) => ({
      id: edge.id,
      source: edge.source,
      target: edge.target,
      type: edge.type,
      label: edge.label,
      animated: edge.animated,
      style: edge.style,
      markerEnd: edge.markerEnd,
      sourceHandle: edge.sourceHandle,
      targetHandle: edge.targetHandle,
    }));

    const chart: OrgChart = {
      id: chartId,
      name: chartName,
      nodes: serializableNodes,
      edges: serializableEdges,
      createdAt: currentChartId ? savedCharts.find(c => c.id === currentChartId)?.createdAt || new Date().toISOString() : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      published: false
    };

    const updatedCharts = currentChartId 
      ? savedCharts.map(c => c.id === currentChartId ? chart : c)
      : [...savedCharts, chart];

  setSavedCharts(updatedCharts);
  localStorage.setItem('org-charts', JSON.stringify(updatedCharts));
  setCurrentChartId(chartId);
  console.log('Saved chart id:', chartId);
  toast.success("Chart saved successfully!");
  };

  const loadChart = (chartId: string) => {
    const chart = savedCharts.find(c => c.id === chartId);
    if (chart) {
      // Ensure loaded nodes/edges are valid for ReactFlow
      setNodes(
        chart.nodes.map((node) => ({
          ...node,
          position: node.position || { x: Math.random() * 300, y: Math.random() * 300 },
          type: node.type || "orgNode",
          data: node.data,
        }))
      );
      setEdges(
        chart.edges.map((edge) => ({
          ...edge,
          source: edge.source,
          target: edge.target,
          id: edge.id,
          type: edge.type,
          label: edge.label,
          animated: edge.animated,
          style: edge.style,
          markerEnd: edge.markerEnd,
          sourceHandle: edge.sourceHandle,
          targetHandle: edge.targetHandle,
        }))
      );
      setChartName(chart.name);
      setCurrentChartId(chartId);
      setSelectedNode(null);
      setNodeForm({ name: "", position: "", image: "", email: "", phone: "" });
      setEdgeForm({ source: "", target: "", label: "" });
      toast.success("Chart loaded successfully!");
    }
  };

  const publishChart = () => {
    if (!currentChartId) {
      toast.error("Please save the chart first");
      return;
    }

    const updatedCharts = savedCharts.map(c => 
      c.id === currentChartId ? { ...c, published: true } : c
    );

    setSavedCharts(updatedCharts);
    localStorage.setItem('org-charts', JSON.stringify(updatedCharts));

    // Ensure localStorage is updated and chart is published before opening new tab
    setTimeout(() => {
      const saved = localStorage.getItem('org-charts');
      if (saved) {
        const charts = JSON.parse(saved);
  const found = charts.find((c: OrgChart) => c.id === currentChartId && c.published);
        if (found) {
          window.open(`/admin/org-chart/${currentChartId}`, '_blank');
        } else {
          toast.error('Failed to publish chart. Please try again.');
        }
      } else {
        toast.error('Failed to publish chart. Please try again.');
      }
    }, 100);

    toast.success("Chart published successfully!");
  };

  const deleteChart = (chartId: string) => {
    const updatedCharts = savedCharts.filter(c => c.id !== chartId);
    setSavedCharts(updatedCharts);
    localStorage.setItem('org-charts', JSON.stringify(updatedCharts));
    
    if (currentChartId === chartId) {
      setNodes([]);
      setEdges([]);
      setChartName("New Organizational Chart");
      setCurrentChartId(null);
    }
    
    toast.success("Chart deleted successfully!");
  };

  const onNodesChange = useCallback(
    (changes: NodeChange[]) => setNodes((nds) => applyNodeChanges(changes, nds)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => setEdges((eds) => applyEdgeChanges(changes, eds)),
    []
  );

  const onConnect = useCallback(
    (params: Connection) => {
      const newEdge: Edge = {
        ...params,
        id: generateUniqueId(),
        type: 'default',
        animated: false,
        style: { stroke: '#374151', strokeWidth: 2 },
        markerEnd: { type: 'arrowclosed', color: '#374151' }
      };
      setEdges((eds) => addEdge(newEdge, eds));
    },
    []
  );

  const addNode = () => {
    if (!nodeForm.name.trim() || !nodeForm.position.trim()) {
      toast.error("Please fill in name and position");
      return;
    }

    const newId = generateUniqueId();

    const newNode: Node = {
      id: newId,
      type: 'orgNode',
      position: { 
        x: Math.random() * 300, 
        y: Math.random() * 300 
      },
      data: {
        id: newId,
        name: nodeForm.name,
        position: nodeForm.position,
        image: nodeForm.image,
        email: nodeForm.email,
        phone: nodeForm.phone
      }
    };

    setNodes((nds) => [...nds, newNode]);
    setNodeForm({ name: "", position: "", image: "", email: "", phone: "" });
    toast.success("Node added successfully!");
  };

  const updateNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => 
      nds.map((node) => 
        node.id === selectedNode 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                name: nodeForm.name,
                position: nodeForm.position,
                image: nodeForm.image,
                email: nodeForm.email,
                phone: nodeForm.phone
              }
            }
          : node
      )
    );
    
    setSelectedNode(null);
    setNodeForm({ name: "", position: "", image: "", email: "", phone: "" });
    toast.success("Node updated successfully!");
  };

  const deleteNode = () => {
    if (!selectedNode) return;

    setNodes((nds) => nds.filter((node) => node.id !== selectedNode));
    setEdges((eds) => eds.filter((edge) => edge.source !== selectedNode && edge.target !== selectedNode));
    setSelectedNode(null);
    setNodeForm({ name: "", position: "", image: "", email: "", phone: "" });
    toast.success("Node deleted successfully!");
  };

  const addEdgeManual = () => {
    if (!edgeForm.source || !edgeForm.target) {
      toast.error("Please select both source and target nodes");
      return;
    }

    if (edgeForm.source === edgeForm.target) {
      toast.error("Source and target cannot be the same node");
      return;
    }

    // Check if edge already exists
    const existingEdge = edges.find(
      edge => edge.source === edgeForm.source && edge.target === edgeForm.target
    );

    if (existingEdge) {
      toast.error("Connection already exists between these nodes");
      return;
    }

    const newEdge: Edge = {
      id: generateUniqueId(),
      source: edgeForm.source,
      target: edgeForm.target,
      label: edgeForm.label.trim() || undefined,
      type: 'default',
      animated: false,
      style: { stroke: '#374151', strokeWidth: 2 },
      markerEnd: { type: 'arrowclosed', color: '#374151' },
      sourceHandle: null,
      targetHandle: null
    };

    setEdges((eds) => [...eds, newEdge]);
    setEdgeForm({ source: "", target: "", label: "" });
    toast.success("Connection added successfully!");
  };

  const deleteEdge = (edgeId: string) => {
    setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    toast.success("Connection deleted successfully!");
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    // Defensive: ensure node.data is an object with string fields
    setNodeForm({
      name: typeof node.data?.name === 'string' ? node.data.name : "",
      position: typeof node.data?.position === 'string' ? node.data.position : "",
      image: typeof node.data?.image === 'string' ? node.data.image : "",
      email: typeof node.data?.email === 'string' ? node.data.email : "",
      phone: typeof node.data?.phone === 'string' ? node.data.phone : ""
    });
  }, []);

  const clearSelection = () => {
    setSelectedNode(null);
    setNodeForm({ name: "", position: "", image: "", email: "", phone: "" });
  };

  const getNodeName = (nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId);
    return node?.data?.name || nodeId;
  };

  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <div className="bg-white border-b p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold">Organizational Chart CMS</h1>
            <Input
              value={chartName}
              onChange={(e) => setChartName(e.target.value)}
              className="w-64"
              placeholder="Chart name..."
            />
          </div>
          <div className="flex space-x-2">
            <Button onClick={saveChart} variant="outline">
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Button onClick={publishChart} disabled={!currentChartId}>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
          {/* Saved Charts */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">Saved Charts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {savedCharts.map((chart) => (
                  <div key={chart.id} className="flex items-center justify-between p-2 bg-white rounded border">
                    <div className="flex-1">
                      <p className="font-medium text-sm">{chart.name}</p>
                      <p className="text-xs text-gray-500">
                        {chart.published ? "Published" : "Draft"}
                      </p>
                    </div>
                    <div className="flex space-x-1">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => loadChart(chart.id)}
                      >
                        Load
                      </Button>
                      <Button 
                        size="sm" 
                        variant="destructive" 
                        onClick={() => deleteChart(chart.id)}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Node Editor */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedNode ? "Edit Node" : "Add Node"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name"><span className="required-field">Name </span>
                </Label>
                <Input
                  id="name"
                  value={nodeForm.name}
                  onChange={(e) => setNodeForm({ ...nodeForm, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <Label htmlFor="position"><span className="required-field">Position </span>
                </Label>
                <Input
                  id="position"
                  value={nodeForm.position}
                  onChange={(e) => setNodeForm({ ...nodeForm, position: e.target.value })}
                  placeholder="Job title/position"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={nodeForm.image}
                  onChange={(e) => setNodeForm({ ...nodeForm, image: e.target.value })}
                  placeholder="Profile image URL"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={nodeForm.email}
                  onChange={(e) => setNodeForm({ ...nodeForm, email: e.target.value })}
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={nodeForm.phone}
                  onChange={(e) => setNodeForm({ ...nodeForm, phone: e.target.value })}
                  placeholder="Phone number"
                />
              </div>

              <div className="flex space-x-2">
                {selectedNode ? (
                  <>
                    <Button onClick={updateNode} className="flex-1">
                      Update Node
                    </Button>
                    <Button onClick={deleteNode} variant="destructive">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                    <Button onClick={clearSelection} variant="outline">
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button onClick={addNode} className="w-full">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Node
                  </Button>
                )}
              </div>

              {selectedNode && (
                <div className="text-sm text-gray-600 p-2 bg-blue-50 rounded">
                  <p><strong>Tip:</strong> Click on nodes in the chart to edit them, or drag to connect nodes with edges.</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Connection/Edge Manager */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Link className="w-5 h-5 mr-2" />
                Manage Connections
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Add Connection Form */}
              <div className="space-y-3">
                <div>
                  <Label htmlFor="source">From (Boss/Manager)</Label>
                  <Select value={edgeForm.source} onValueChange={(value) => setEdgeForm({ ...edgeForm, source: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select source node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {typeof node.data?.name === 'string' ? node.data.name : ''} ({typeof node.data?.position === 'string' ? node.data.position : ''})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-center">
                  <ArrowRight className="w-4 h-4 text-gray-400" />
                </div>

                <div>
                  <Label htmlFor="target">To (Subordinate)</Label>
                  <Select value={edgeForm.target} onValueChange={(value) => setEdgeForm({ ...edgeForm, target: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {typeof node.data?.name === 'string' ? node.data.name : ''} ({typeof node.data?.position === 'string' ? node.data.position : ''})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edge-label">Connection Label (Optional)</Label>
                  <Input
                    id="edge-label"
                    value={edgeForm.label}
                    onChange={(e) => setEdgeForm({ ...edgeForm, label: e.target.value })}
                    placeholder="e.g., Reports to, Manages"
                  />
                </div>

                <Button 
                  onClick={addEdgeManual} 
                  className="w-full"
                  disabled={!edgeForm.source || !edgeForm.target}
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Connection
                </Button>
              </div>

              {/* Existing Connections */}
              {edges.length > 0 && (
                <div className="space-y-2">
                  <Label>Existing Connections</Label>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {edges.map((edge) => (
                      <div key={edge.id} className="flex items-center justify-between p-2 bg-white rounded border text-sm">
                        <div className="flex-1">
                          <p className="font-medium">
                            {String(getNodeName(edge.source))} → {String(getNodeName(edge.target))}
                          </p>
                          {edge.label && (
                            <p className="text-xs text-gray-500">{edge.label}</p>
                          )}
                        </div>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteEdge(edge.id)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {nodes.length >= 2 && (
                <div className="text-sm text-gray-600 p-2 bg-green-50 rounded">
                  <p><strong>Tip:</strong> You can also drag from one node to another on the chart to create connections quickly!</p>
                </div>
              )}

              {nodes.length < 2 && (
                <div className="text-sm text-gray-600 p-2 bg-yellow-50 rounded">
                  <p>Add at least 2 nodes to create connections between them.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Main Canvas */}
        <div className="flex-1 relative">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            nodeTypes={nodeTypes}
            fitView
            style={{ background: '#f8fafc' }}
          >
            <Background />
            <Controls />
          </ReactFlow>
          
          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No nodes yet</h3>
                <p>Add your first organization member using the form on the left</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}