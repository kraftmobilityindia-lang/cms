import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateOTP, getOTPExpiry } from "@/lib/otp";
import { sendSMS } from "@/lib/sms";
import { SendOTPRequest, ApiResponse } from "@/types/api";

export async function POST(request: NextRequest): Promise<Response> {
  try {
    const { mobile }: SendOTPRequest = await request.json();

    if (!mobile) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Mobile number is required",
        },
        { status: 400 }
      );
    }

    // Validate mobile format (Indian format)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Invalid mobile number format",
        },
        { status: 400 }
      );
    }

    // Check if user exists and is active
    const user = await prisma.user.findUnique({
      where: { mobile },
      include: { property: true },
    });

    if (!user) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "User not found. Please contact admin.",
        },
        { status: 404 }
      );
    }

    if (!user.isActive) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Account is deactivated. Please contact admin.",
        },
        { status: 403 }
      );
    }

    const otpCode = generateOTP();
    const otpExpiry = getOTPExpiry();

    // Save OTP to database
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          otpCode,
          otpExpiry,
          isVerified: false,
        },
      }),
      prisma.oTP.create({
        data: {
          mobile,
          code: otpCode,
          expiresAt: otpExpiry,
        },
      }),
    ]);

    // Send SMS
    const message = `Your OTP for Tenancy App is: ${otpCode}. Valid for 10 minutes. Do not share.`;
    const smsSent = await sendSMS(mobile, message);

    if (!smsSent) {
      return NextResponse.json<ApiResponse>(
        {
          success: false,
          message: "Failed to send OTP. Please try again.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      message: "OTP sent successfully",
      data: {
        mobile: mobile.replace(/(\d{2})\d{6}(\d{2})/, "$1******$2"),
      },
    });
  } catch (error) {
    console.error("Send OTP error:", error);
    return NextResponse.json<ApiResponse>(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
