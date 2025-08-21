"use client";

import { Handle, Position } from "@xyflow/react";
import { Users } from "lucide-react";
import Image from "next/image";

// TODO: Change this type and refer this type from the database
export type OrganizationCoreMember = {
  id: string;
  name: string;
  position: string;
  image?: string;
  email?: string;
  phone?: string;
};

export default function MemberNode({ data }: { data: OrganizationCoreMember }) {
  return (
    <div className="bg-white border-2 border-gray-200 rounded-lg p-4 min-w-[200px] shadow-lg">
      {/* Add handles for connecting */}
      <Handle
        type="target"
        position={Position.Top}
        style={{ background: "#555" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        style={{ background: "#555" }}
      />

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
}
