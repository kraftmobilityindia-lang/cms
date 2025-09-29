import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getUserFromRequest } from "@/lib/auth";
import { ApiResponse } from "@/types/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
): Promise<NextResponse<ApiResponse>> {
  try {
    const user = getUserFromRequest(request);
    const { id } = params;
    const url = new URL(request.url);
    const forSupervisor = url.searchParams.get("supervisor") === "true";

    const whereClause = forSupervisor ? { id } : { id, userId: user?.userId };

    const complaint = await prisma.complaint.findFirst({
      where: whereClause,
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

    if (!complaint) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Complaint not found",
        },
        { status: 404 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "Complaint retrieved successfully",
      data: complaint,
    });
  } catch (error) {
    console.error("Get complaint error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
