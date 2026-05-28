import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';

const DASHBOARD_ROUTES = [
  '/overview', '/banks', '/balance-sheet', '/pnl', '/macro', '/risk',
];
const ADMIN_ROUTES = ['/admin'];

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          supabaseResponse = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const { pathname } = request.nextUrl;

  // Redirect logged-in user away from /login
  if (pathname === '/login' && user) {
    return NextResponse.redirect(new URL('/overview', request.url));
  }

  // Protect dashboard routes
  const isDashboard = DASHBOARD_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (isDashboard && !user) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('next', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Protect admin routes — require admin role
  const isAdmin = ADMIN_ROUTES.some(r => pathname === r || pathname.startsWith(r + '/'));
  if (isAdmin) {
    if (!user) {
      const loginUrl = new URL('/login', request.url);
      loginUrl.searchParams.set('next', pathname);
      return NextResponse.redirect(loginUrl);
    }
    // Check role from profiles table
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return NextResponse.redirect(new URL('/overview', request.url));
    }
  }

  return supabaseResponse;
}

export const proxyConfig = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|icon.tsx|opengraph-image.tsx|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
