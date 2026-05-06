import { useEffect, useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'

export function ScrollToTop() {
  const { pathname, search } = useLocation()

  // Stop the browser from restoring previous scroll position on Link navigations.
  useEffect(() => {
    if ('scrollRestoration' in window.history) {
      window.history.scrollRestoration = 'manual'
    }
  }, [])

  // useLayoutEffect runs before paint, so the new page never flashes
  // mid-scroll before snapping back to top.
  useLayoutEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname, search])

  return null
}
