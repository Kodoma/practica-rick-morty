import { type AnchorHTMLAttributes, createElement, type MouseEventHandler, type Ref, useSyncExternalStore } from 'react'

const NAVIGATE_EVENT = 'app:navigate'

const getHref = () => window.location.pathname + window.location.search

function subscribe(onChange: () => void) {
  window.addEventListener('popstate', onChange)
  window.addEventListener(NAVIGATE_EVENT, onChange)
  return () => {
    window.removeEventListener('popstate', onChange)
    window.removeEventListener(NAVIGATE_EVENT, onChange)
  }
}

export function navigate(to: string, { replace = false }: { replace?: boolean } = {}) {
  if (to === getHref()) return
  if (replace) window.history.replaceState(null, '', to)
  else window.history.pushState(null, '', to)
  window.dispatchEvent(new Event(NAVIGATE_EVENT))
}

export function useLocation() {
  const href = useSyncExternalStore(subscribe, getHref)
  const url = new URL(href, window.location.origin)
  return { pathname: url.pathname, searchParams: url.searchParams }
}

export const paths = {
  list: (search = '') => `/${search ? `?${search}` : ''}`,
  favorites: () => '/favorites',
  detail: (id: number) => `/characters/${id}`,
  edit: (id: number) => `/characters/${id}/edit`,
}

type RouterLinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  href: string
  ref?: Ref<HTMLAnchorElement>
}

export function RouterLink({ href, onClick, ref, ...rest }: RouterLinkProps) {
  const handleClick: MouseEventHandler<HTMLAnchorElement> = (event) => {
    onClick?.(event)
    const isModified = event.metaKey || event.ctrlKey || event.shiftKey || event.altKey
    if (event.defaultPrevented || isModified || event.button !== 0) return
    event.preventDefault()
    navigate(href)
  }

  return createElement('a', { href, onClick: handleClick, ref, ...rest })
}