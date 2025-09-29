import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { UpdateUserRequest, ApiResponse } from "@/types/api";

export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
): Promise<Response> {
  try {
    const { id } = await context.params;
    const body: UpdateUserRequest = await request.json();

    const user = await prisma.user.findUnique({
      where: { id },
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

    // If propertyId is being updated, verify it exists
    if (body.propertyId) {
      const property = await prisma.property.findUnique({
        where: { id: body.propertyId },
      });

      if (!property) {
        return NextResponse.json<ApiResponse>(
          {
            success: false,
            message: "Property not found",
          },
          { status: 404 }
        );
      }
    }

    const updatedUser = await prisma.user.update({
      where: { id },
      data: body,
      include: {
        property: true,
      },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const user = await prisma.user.findUnique({
      where: { id },
      include: {
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

    // Check if user has active complaints
    if (user._count.complaints > 0) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Cannot delete user with existing complaints",
        },
        { status: 409 }
      );
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Delete user error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
