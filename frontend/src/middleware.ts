import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define your public and protected routes
const PUBLIC_ROUTES = ['/'];
const PROTECTED_ROUTES = ['/survey', '/songs'];

export function middleware(request: NextRequest) {
    const acceptedTerms = request.cookies.get('accepted-terms');

    const { pathname } = request.nextUrl;

    const isPublicRoute =
        PUBLIC_ROUTES.some(route => pathname.startsWith(route))
        && !PROTECTED_ROUTES.some(route => pathname.startsWith(route));

    console.log(isPublicRoute)
    if (!acceptedTerms?.value === true && !isPublicRoute) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    return NextResponse.next();
}

export const config = {
    matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"]
};
