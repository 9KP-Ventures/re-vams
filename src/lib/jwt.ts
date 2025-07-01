import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.REVAMS_QR_CODE_SECRET;

if (!JWT_SECRET) {
  throw Error("No JWT Secret set for QR Code Cookie Management");
}

// Define the payload interface
export interface StudentVerificationPayload {
  student_id: string;
  verified_at: number;
  last_name: string;
}

export function signToken(payload: StudentVerificationPayload): string {
  return jwt.sign(payload, JWT_SECRET!, { expiresIn: "5m" });
}

export function verifyToken(token: string): StudentVerificationPayload | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET!) as jwt.JwtPayload;

    // Type guard to ensure payload has expected structure
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      typeof decoded.student_id === 'string' &&
      typeof decoded.verified_at === 'number' &&
      typeof decoded.last_name === 'string'
    ) {
      return decoded as StudentVerificationPayload;
    }

    return null;
  } catch {
    return null;
  }
}
