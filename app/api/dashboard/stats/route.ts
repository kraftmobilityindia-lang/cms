import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";

export async function GET(): Promise<NextResponse<ApiResponse>> {
  try {
    const [
      totalUsers,
      totalProperties,
      totalComplaints,
      openComplaints,
      inProgressComplaints,
      resolvedComplaints,
      closedComplaints,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.complaint.count(),
      prisma.complaint.count({ where: { status: "OPEN" } }),
      prisma.complaint.count({ where: { status: "IN_PROGRESS" } }),
      prisma.complaint.count({ where: { status: "RESOLVED" } }),
      prisma.complaint.count({ where: { status: "CLOSED" } }),
    ]);

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Dashboard stats retrieved successfully",
      data: {
        totalUsers,
        totalProperties,
        totalComplaints,
        complaintsByStatus: {
          open: openComplaints,
          inProgress: inProgressComplaints,
          resolved: resolvedComplaints,
          closed: closedComplaints,
        },
      },
    });
  } catch (error) {
    console.error("Get dashboard stats error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
