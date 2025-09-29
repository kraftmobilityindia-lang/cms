import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  try {
    const { id } = context.params;

    if (!id) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User ID is required",
        },
        { status: 400 }
      );
    }

    // Get user with complete property details and complaint statistics
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        property: true,
        complaints: {
          select: {
            id: true,
            title: true,
            description: true,
            category: true,
            status: true,
            priority: true,
            createdAt: true,
            updatedAt: true,
            startedAt: true,
            resolvedAt: true,
            closedAt: true,
          },
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: { complaints: true },
        },
      },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found",
        },
        { status: 404 }
      );
    }

    // Calculate complaint statistics
    const complaintStats = {
      total: user._count.complaints,
      open: user.complaints.filter((c) => c.status === "OPEN").length,
      inProgress: user.complaints.filter((c) => c.status === "IN_PROGRESS")
        .length,
      resolved: user.complaints.filter((c) => c.status === "RESOLVED").length,
      closed: user.complaints.filter((c) => c.status === "CLOSED").length,
      cancelled: user.complaints.filter((c) => c.status === "CANCELLED").length,
    };

    // Calculate average resolution time for closed complaints
    const closedComplaints = user.complaints.filter(
      (c) => c.status === "CLOSED" && c.closedAt
    );
    const avgResolutionTime =
      closedComplaints.length > 0
        ? closedComplaints.reduce((sum, complaint) => {
            const created = new Date(complaint.createdAt).getTime();
            const closed = new Date(complaint.closedAt!).getTime();
            return sum + (closed - created);
          }, 0) / closedComplaints.length
        : 0;

    // Format the response
    const userDetails = {
      // User information
      id: user.id,
      mobile: user.mobile,
      name: user.name,
      email: user.email,
      isActive: user.isActive,
      isVerified: user.isVerified,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,

      // Property information
      property: {
        id: user.property.id,
        address: user.property.address,
        fullAddress: user.property.fullAddress,
        city: user.property.city,
        state: user.property.state,
        pincode: user.property.pincode,
        bedrooms: user.property.bedrooms,
        bathrooms: user.property.bathrooms,
        hasLivingArea: user.property.hasLivingArea,
        hasDiningArea: user.property.hasDiningArea,
        hasKitchen: user.property.hasKitchen,
        hasUtility: user.property.hasUtility,
        hasGarden: user.property.hasGarden,
        hasPowderRoom: user.property.hasPowderRoom,
        propertyType: user.property.propertyType,
        area: user.property.area,
        floor: user.property.floor,
        totalFloors: user.property.totalFloors,
        createdAt: user.property.createdAt,
        updatedAt: user.property.updatedAt,
      },

      // Complaint statistics
      complaintStats,

      // Recent complaints (last 5)
      recentComplaints: user.complaints.slice(0, 5),

      // All complaints
      allComplaints: user.complaints,

      // Additional metrics
      metrics: {
        avgResolutionTimeMs: avgResolutionTime,
        avgResolutionTimeDays: Math.round(
          avgResolutionTime / (1000 * 60 * 60 * 24)
        ),
        memberSince: user.createdAt,
        lastComplaint:
          user.complaints.length > 0 ? user.complaints[0].createdAt : null,
      },
    };

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User details retrieved successfully",
      data: userDetails,
    });
  } catch (error) {
    console.error("Get user details error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
