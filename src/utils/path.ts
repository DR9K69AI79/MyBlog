/**
 * Get the base path for the application
 * This is used to ensure links work correctly in production (GitHub Pages)
 */
export function getBasePath(): string {
  if (typeof window !== 'undefined') {
    // Client-side: get base from current URL or import.meta.env
    const baseUrl = import.meta.env.BASE_URL
    if (baseUrl && baseUrl !== '/') {
      return baseUrl
    }

    // Fallback: extract base from current pathname
    const pathname = window.location.pathname
    if (pathname.startsWith('/MyBlog')) {
      return '/MyBlog'
    }
    return '/'
  }

  // Server-side: use the configured base
  return import.meta.env.BASE_URL || '/'
}

/**
 * Create a URL with the correct base path
 */
export function withBase(path: string): string {
  const base = getBasePath()

  // Remove leading slash from path if present
  const cleanPath = path.startsWith('/') ? path.slice(1) : path

  // Handle root path
  if (!cleanPath || cleanPath === '/') {
    return base === '/' ? '/' : base
  }

  // Combine base and path
  const fullPath = base === '/' ? `/${cleanPath}` : `${base}/${cleanPath}`

  return fullPath
}
