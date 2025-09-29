import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateComplaintRequest, ApiResponse } from "@/types/api";

export async function PUT(
  request: NextRequest,
  context: { params: { id: string } }
): Promise<Response> {
  // ✅ explicitly type the return
  try {
    const { id } = context.params;
    const body: UpdateComplaintRequest = await request.json();

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

    const updateData: any = {};

    // Work details
    if (body.workDescription) updateData.workDescription = body.workDescription;
    if (body.materialsUsed) updateData.materialsUsed = body.materialsUsed;
    if (body.workNotes) updateData.workNotes = body.workNotes;

    // Media
    if (body.beforeImages) updateData.beforeImages = body.beforeImages;
    if (body.afterImages) updateData.afterImages = body.afterImages;
    if (body.beforeVideos) updateData.beforeVideos = body.beforeVideos;
    if (body.afterVideos) updateData.afterVideos = body.afterVideos;

    // Status and timestamps
    if (body.status) {
      updateData.status = body.status;

      if (body.status === "IN_PROGRESS" && !complaint.startedAt) {
        updateData.startedAt = new Date();
      } else if (body.status === "RESOLVED" && !complaint.resolvedAt) {
        updateData.resolvedAt = new Date();
      }
    }

    const updatedComplaint = await prisma.complaint.update({
      where: { id },
      data: updateData,
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
      message: "Complaint updated successfully",
      data: updatedComplaint,
    });
  } catch (error) {
    console.error("Update complaint error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
