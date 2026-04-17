import { NextResponse } from "next/server";
 
let locales = ['en', 'ar']
 
import { match } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
 
// let headers = { 'accept-language': 'en-US,en;q=0.5' }
// let languages = new Negotiator({ headers }).languages()
let defaultLocale = 'en'
 
// match(languages, locales, defaultLocale) // -> 'en-US'

// Get the preferred locale, similar to the above or using a library
function getLocale(request) {
    let headers = { 'accept-language': request.headers.get('accept-language') }
    let languages = new Negotiator({ headers }).languages()
    return match(languages, locales, defaultLocale)
}
 
export function proxy(request) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  )

  if (pathnameHasLocale) return

  // Next.js App Router metadata routes (must not get a locale prefix)
  if (pathname === '/icon' || pathname === '/apple-icon') {
    return
  }

  // Skip static assets (files in public folder are served from root)
  if (pathname.startsWith('/assets/') || pathname.startsWith('/favicon') || pathname.startsWith('/_next/static/')) {
    return
  }

  // Redirect if there is no locale
  const locale = getLocale(request)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en-US/products
  return NextResponse.redirect(request.nextUrl)
}
 
export const config = {
  matcher: [
    // Skip all internal paths (_next), API routes, and public folder
    // Run proxy on all non-internal, non-API, non-public routes
    // Note: /icon and /apple-icon are excluded inside proxy() so /icons/* still matches
    '/((?!_next|api|public).*)',
    // Optional: only run on root (/) URL
    // '/'
  ],
}