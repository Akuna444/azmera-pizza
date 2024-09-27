import { NextRequest, NextResponse } from "next/server";

// Public and private routes
const publicRoutes = ["/signin", "/add-admin", "/signup"];
const restaurantPrivateRoutes = ["/dashboard", "/add-menu", "users", "roles"]; // Private for restaurant
const userPrivateRoutes = ["/"]; // Private for regular users

export default function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Get tokens from cookies
  const restaurantUserToken = req.cookies.get("restaurantUser");
  const userToken = req.cookies.get("user");

  // Check if it's a public route
  const isPublicRoute = publicRoutes.includes(path);

  // Check if it's a restaurant private route
  const isRestaurantPrivateRoute = restaurantPrivateRoutes.includes(path);

  // Check if it's a user private route
  const isUserPrivateRoute = userPrivateRoutes.includes(path);

  // 1. Public route access
  if (isPublicRoute) {
    // If the user is already logged in, redirect to appropriate private route
    if (restaurantUserToken) {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    if (userToken) {
      return NextResponse.redirect(new URL("/", req.nextUrl));
    }
    return NextResponse.next(); // Allow access to public routes
  }

  // 2. Restaurant private route access
  if (isRestaurantPrivateRoute) {
    if (!restaurantUserToken) {
      return NextResponse.redirect(new URL("/signin", req.nextUrl)); // Redirect to signin if no restaurant token
    }
    return NextResponse.next(); // Allow access if authenticated as restaurant
  }

  // 3. User private route access
  if (isUserPrivateRoute) {
    if (!userToken) {
      return NextResponse.redirect(new URL("/signin", req.nextUrl)); // Redirect to signin if no user token
    }
    return NextResponse.next(); // Allow access if authenticated as user
  }

  // 4. If no conditions match, allow the request to proceed
  return NextResponse.next();
}

// Specify the matcher configuration
export const config = {
  matcher: "/((?!api|_next/static|_next/image|favicon.ico).*)",
};
