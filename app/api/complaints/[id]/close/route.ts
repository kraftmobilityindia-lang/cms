import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ApiResponse } from "@/types/api";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  // ✅ explicitly type the return
  try {
    const { id } = context.params;

    const complaint = await prisma.complaint.findUnique({
      where: { id },
    });

    if (!complaint) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Complaint not found",
        },
        { status: 404 }
      );
    }

    if (complaint.status !== "RESOLVED") {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Can only close resolved complaints",
        },
        { status: 400 }
      );
    }

    const closedComplaint = await prisma.complaint.update({
      where: { id },
      data: {
        status: "CLOSED",
        closedAt: new Date(),
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            mobile: true,
          },
        },
        property: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Complaint closed successfully",
      data: closedComplaint,
    });
  } catch (error) {
    console.error("Close complaint error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
