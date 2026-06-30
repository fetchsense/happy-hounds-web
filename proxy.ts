import { NextRequest, NextResponse } from "next/server";

export function proxy(request: NextRequest) {
  const secret = process.env.ADMIN_SECRET;

  // No secret configured → allow in development; block in production as a safety net
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      return new NextResponse("Admin access is not configured.", { status: 503 });
    }
    return NextResponse.next();
  }

  const authHeader = request.headers.get("authorization") ?? "";
  const [scheme, credentials] = authHeader.split(" ");

  if (scheme === "Basic" && credentials) {
    const decoded = Buffer.from(credentials, "base64").toString("utf8");
    // username is ignored; only the password is checked against ADMIN_SECRET
    const colonIdx = decoded.indexOf(":");
    const password = colonIdx >= 0 ? decoded.slice(colonIdx + 1) : decoded;
    if (password === secret) return NextResponse.next();
  }

  return new NextResponse("Authentication required", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Happy Hounds Admin"' },
  });
}

export const config = {
  matcher: ["/admin/:path*"],
};
