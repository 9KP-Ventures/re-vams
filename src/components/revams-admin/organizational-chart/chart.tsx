"use client";

import {
  Node,
  Edge,
  NodeChange,
  applyNodeChanges,
  EdgeChange,
  applyEdgeChanges,
  Connection,
  addEdge,
  ReactFlow,
  Background,
  Controls,
} from "@xyflow/react";
import { useCallback, useState } from "react";
import MemberNode, { OrganizationCoreMember } from "./member-node";
import { toast } from "sonner";
import { generateUniqueId } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { ArrowRight, Eye, Link, Plus, Trash2, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function ChartCMS() {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [chartName, setChartName] = useState("New Organizational Chart");

  // Form state for node editing
  const [nodeForm, setNodeForm] = useState<OrganizationCoreMember>({
    id: "",
    name: "",
    position: "",
    image: "",
    email: "",
    phone: "",
  });

  // Form state for edge editing
  const [edgeForm, setEdgeForm] = useState<
    Pick<Edge, "source" | "target" | "label">
  >({
    source: "",
    target: "",
    label: "",
  });

  const onNodesChange = useCallback(
    (changes: NodeChange[]) =>
      setNodes(nodes => applyNodeChanges(changes, nodes)),
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) =>
      setEdges(edges => applyEdgeChanges(changes, edges)),
    []
  );

  const onConnect = useCallback((params: Connection) => {
    const newEdge: Edge = {
      ...params,
      id: generateUniqueId(),
      type: "default",
      animated: false,
      style: { stroke: "#374151", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#374151" },
    };
    setEdges(edges => addEdge(newEdge, edges));
  }, []);

  const addNode = () => {
    if (!nodeForm.name.trim() || !nodeForm.position.trim()) {
      toast.error("Please fill in name and position");
      return;
    }

    const newId = generateUniqueId();

    const newNode: Node = {
      id: newId,
      type: "orgNode",
      position: {
        x: Math.random() * 300,
        y: Math.random() * 300,
      },
      data: {
        id: newId,
        name: nodeForm.name,
        position: nodeForm.position,
        image: nodeForm.image,
        email: nodeForm.email,
        phone: nodeForm.phone,
      },
    };

    setNodes(nodes => [...nodes, newNode]);
    setNodeForm({
      id: "",
      name: "",
      position: "",
      image: "",
      email: "",
      phone: "",
    });

    toast.success("Node added successfully!");
  };

  const updateNode = () => {
    if (!selectedNode) return;

    setNodes(nodes =>
      nodes.map(node =>
        node.id === selectedNode
          ? {
              ...node,
              data: {
                ...node.data,
                name: nodeForm.name,
                position: nodeForm.position,
                image: nodeForm.image,
                email: nodeForm.email,
                phone: nodeForm.phone,
              },
            }
          : node
      )
    );

    setSelectedNode(null);
    setNodeForm({
      id: "",
      name: "",
      position: "",
      image: "",
      email: "",
      phone: "",
    });

    toast.success("Node updated successfully!");
  };

  const deleteNode = () => {
    if (!selectedNode) return;

    setNodes(nodes => nodes.filter(node => node.id !== selectedNode));
    setEdges(edges =>
      edges.filter(
        edge => edge.source !== selectedNode && edge.target !== selectedNode
      )
    );
    setSelectedNode(null);
    setNodeForm({
      id: "",
      name: "",
      position: "",
      image: "",
      email: "",
      phone: "",
    });
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
      label: edgeForm.label,
      type: "default",
      animated: false,
      style: { stroke: "#374151", strokeWidth: 2 },
      markerEnd: { type: "arrowclosed", color: "#374151" },
      sourceHandle: null,
      targetHandle: null,
    };

    setEdges(edges => [...edges, newEdge]);
    setEdgeForm({ source: "", target: "", label: "" });
    toast.success("Connection added successfully!");
  };

  const deleteEdge = (edgeId: string) => {
    setEdges(eds => eds.filter(edge => edge.id !== edgeId));
    toast.success("Connection deleted successfully!");
  };

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node.id);
    setNodeForm({
      id: "",
      name: `${node.data?.name}`,
      position: `${node.data?.position}`,
      image: `${node.data?.image}`,
      email: `${node.data?.email}`,
      phone: `${node.data?.phone}`,
    });
  }, []);

  const clearSelection = () => {
    setSelectedNode(null);
    setNodeForm({
      id: "",
      name: "",
      position: "",
      image: "",
      email: "",
      phone: "",
    });
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
              onChange={e => setChartName(e.target.value)}
              className="w-64"
              placeholder="Chart name..."
            />
          </div>
          <div className="flex space-x-2">
            <Button>
              <Eye className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar */}
        <div className="w-80 bg-gray-50 border-r p-4 overflow-y-auto">
          {/* Node Editor */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-lg">
                {selectedNode ? "Edit Node" : "Add Node"}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">
                  <span className="flex gap-1 required-field">Name</span>
                </Label>
                <Input
                  id="name"
                  value={nodeForm.name}
                  onChange={e =>
                    setNodeForm({ ...nodeForm, name: e.target.value })
                  }
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <Label htmlFor="position">
                  <span className="flex gap-1 required-field">Position</span>
                </Label>
                <Input
                  id="position"
                  value={nodeForm.position}
                  onChange={e =>
                    setNodeForm({ ...nodeForm, position: e.target.value })
                  }
                  placeholder="Job title/position"
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL</Label>
                <Input
                  id="image"
                  value={nodeForm.image}
                  onChange={e =>
                    setNodeForm({ ...nodeForm, image: e.target.value })
                  }
                  placeholder="Profile image URL"
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={nodeForm.email}
                  onChange={e =>
                    setNodeForm({ ...nodeForm, email: e.target.value })
                  }
                  placeholder="email@example.com"
                />
              </div>

              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  value={nodeForm.phone}
                  onChange={e =>
                    setNodeForm({ ...nodeForm, phone: e.target.value })
                  }
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
                  <p>
                    <strong>Tip:</strong> Click on nodes in the chart to edit
                    them, or drag to connect nodes with edges.
                  </p>
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
                  <Select
                    value={edgeForm.source}
                    onValueChange={value =>
                      setEdgeForm({ ...edgeForm, source: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select source node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(node => (
                        <SelectItem key={node.id} value={node.id}>
                          {typeof node.data?.name === "string"
                            ? node.data.name
                            : ""}{" "}
                          (
                          {typeof node.data?.position === "string"
                            ? node.data.position
                            : ""}
                          )
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
                  <Select
                    value={edgeForm.target}
                    onValueChange={value =>
                      setEdgeForm({ ...edgeForm, target: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select target node" />
                    </SelectTrigger>
                    <SelectContent>
                      {nodes.map(node => (
                        <SelectItem key={node.id} value={node.id}>
                          {typeof node.data?.name === "string"
                            ? node.data.name
                            : ""}{" "}
                          (
                          {typeof node.data?.position === "string"
                            ? node.data.position
                            : ""}
                          )
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="edge-label">
                    Connection Label (Optional)
                  </Label>
                  <Input
                    id="edge-label"
                    value={`${edgeForm.label}`}
                    onChange={e =>
                      setEdgeForm({ ...edgeForm, label: e.target.value })
                    }
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
                    {edges.map(edge => (
                      <div
                        key={edge.id}
                        className="flex items-center justify-between p-2 bg-white rounded border text-sm"
                      >
                        <div className="flex-1">
                          <p className="font-medium">
                            {String(getNodeName(edge.source))} →{" "}
                            {String(getNodeName(edge.target))}
                          </p>
                          {edge.label && (
                            <p className="text-xs text-gray-500">
                              {edge.label}
                            </p>
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
                  <p>
                    <strong>Tip:</strong> You can also drag from one node to
                    another on the chart to create connections quickly!
                  </p>
                </div>
              )}

              {nodes.length < 2 && (
                <div className="text-sm text-gray-600 p-2 bg-yellow-50 rounded">
                  <p>
                    Add at least 2 nodes to create connections between them.
                  </p>
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
            nodeTypes={{ orgNode: MemberNode }}
            fitView
            style={{ background: "#f8fafc" }}
          >
            <Background />
            <Controls />
          </ReactFlow>

          {nodes.length === 0 && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center text-gray-500">
                <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No nodes yet</h3>
                <p>
                  Add your first organization member using the form on the left
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
