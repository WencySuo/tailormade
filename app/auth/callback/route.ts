import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const requestUrl = new URL(request.url)
    const code = requestUrl.searchParams.get('code')

    if (code) {
      const response = NextResponse.next()

      const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
          cookies: {
            get(name: string) {
              return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value,
                ...options,
              })
            },
            remove(name: string, options: CookieOptions) {
              response.cookies.set({
                name,
                value: '',
                ...options,
              })
            },
          },
        }
      )

      const { error } = await supabase.auth.exchangeCodeForSession(code)
      
      if (error) {
        // If there's an error, redirect to auth page with error
        return NextResponse.redirect(new URL('/auth?error=Unable to verify email', request.url))
      }

      // Successful verification, redirect to dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    // No code provided, redirect to auth page
    return NextResponse.redirect(new URL('/auth', request.url))
  } catch (error) {
    // Handle any unexpected errors
    console.error('Auth callback error:', error)
    return NextResponse.redirect(new URL('/auth?error=Authentication failed', request.url))
  }
}
