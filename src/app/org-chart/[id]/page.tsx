"use client";

import { useEffect, useState, useCallback } from "react";
import { ReactFlow, Node, Edge, Background, Controls } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, ArrowLeft, Calendar, Share2, Download } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";

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
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[200px] shadow-lg hover:shadow-xl transition-shadow">
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
          <div className="w-16 h-16 rounded-full mx-auto mb-2 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
            <Users className="w-8 h-8 text-white" />
          </div>
        )}
        <h3 className="font-semibold text-sm">{data.name}</h3>
        <p className="text-xs text-gray-600 mt-1">{data.position}</p>
        {data.email && (
          <p className="text-xs text-blue-600 mt-1">{data.email}</p>
        )}
        {data.phone && (
          <p className="text-xs text-gray-500 mt-1">{data.phone}</p>
        )}
      </div>
    </div>
  );
};

const nodeTypes = {
  orgNode: CustomOrgNode,
};

export default function PublicOrgChartPage() {
  const params = useParams();
  const chartId = params.id as string;
  
  const [chart, setChart] = useState<OrgChart | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadChart = useCallback(() => {
    try {
      const saved = localStorage.getItem('org-charts');
      if (saved) {
        const charts: OrgChart[] = JSON.parse(saved);
        const foundChart = charts.find(c => c.id === chartId && c.published);
        
        if (foundChart) {
          setChart(foundChart);
        } else {
          setError("Chart not found or not published");
        }
      } else {
        setError("No charts found");
      }
    } catch (error) {
      console.error('Error loading chart:', error);
      setError("Error loading chart");
    } finally {
      setLoading(false);
    }
  }, [chartId]);

  useEffect(() => {
    loadChart();
  }, [loadChart]);

  const shareChart = () => {
    if (navigator.share) {
      navigator.share({
        title: chart?.name || 'Organizational Chart',
        url: window.location.href,
      });
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      // You might want to show a toast here
    }
  };

  const downloadChart = () => {
    // This would implement chart download functionality
    // For now, we'll just show an alert
    alert("Download functionality would be implemented here");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading organizational chart...</p>
        </div>
      </div>
    );
  }

  if (error || !chart) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="max-w-md w-full shadow-lg">
          <CardContent className="pt-6 pb-8 px-6">
            <div className="flex flex-col items-center text-center space-y-6">
              <div className="rounded-full bg-red-100 p-5 mb-2">
                <Users className="h-12 w-12 text-red-600" />
              </div>
              
              <div className="space-y-2">
                <h1 className="text-lg sm:text-2xl font-bold tracking-tight">
                  Chart Not Found
                </h1>
                <p className="text-sm sm:text-base text-muted-foreground max-w-sm">
                  {error || "The organizational chart you&apos;re looking for doesn&apos;t exist or hasn&apos;t been published yet."}
                </p>
              </div>

              <Button asChild className="w-full">
                <Link href="/">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Go Home
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-4">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{chart.name}</h1>
              <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Updated: {new Date(chart.updatedAt).toLocaleDateString()}
                </div>
                <div className="flex items-center">
                  <Users className="w-4 h-4 mr-1" />
                  {chart.nodes.length} member(s)
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button variant="outline" onClick={shareChart}>
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button variant="outline" onClick={downloadChart}>
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Chart Display */}
      <div className="h-[calc(100vh-100px)]">
        {chart.nodes.length > 0 ? (
          <ReactFlow
            nodes={chart.nodes}
            edges={chart.edges}
            nodeTypes={nodeTypes}
            fitView
            style={{ background: '#f8fafc' }}
            panOnDrag={true}
            zoomOnScroll={true}
            zoomOnPinch={true}
            preventScrolling={false}
          >
            <Background />
            <Controls />
          </ReactFlow>
        ) : (
          <div className="h-full flex items-center justify-center">
            <div className="text-center text-gray-500">
              <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <h3 className="text-lg font-medium mb-2">No organization members</h3>
              <p>This chart doesn&apos;t have any members yet.</p>
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="bg-white border-t py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <p>© 2025 Organizational Chart. All rights reserved.</p>
            <div className="flex space-x-4">
              <Link href="/" className="hover:text-gray-700">
                Home
              </Link>
              <Link href="/admin" className="hover:text-gray-700">
                Admin
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}