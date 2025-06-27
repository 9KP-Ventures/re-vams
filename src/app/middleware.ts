import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  // Check auth for API routes
  if (request.nextUrl.pathname.startsWith('/api/')) {
    // Skip auth check for public endpoints
    const publicEndpoints = [
      '/api/students/verify',
      '/api/events/:id/attendance/self',
      '/api/search'
    ];

    const isPublicEndpoint = publicEndpoints.some(endpoint => {
      const pattern = endpoint.replace(':id', '[^/]+');
      return new RegExp(`^${pattern}$`).test(request.nextUrl.pathname);
    });

    if (!isPublicEndpoint) {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        return NextResponse.json(
          { error: { code: 401, message: 'Unauthorized' } },
          { status: 401 }
        )
      }

      // Add user info to headers for use in API routes
      const requestHeaders = new Headers(request.headers)
      requestHeaders.set('x-user-id', user.id)
      requestHeaders.set('x-user-email', user.email || '')

      supabaseResponse = NextResponse.next({
        request: {
          headers: requestHeaders,
        },
      })
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}