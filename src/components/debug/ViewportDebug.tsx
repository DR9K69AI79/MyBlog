import { useAtomValue } from 'jotai'
import { isMobileAtom } from '@/store/viewport'

export function ViewportDebug() {
  const isMobile = useAtomValue(isMobileAtom)
  
  if (process.env.NODE_ENV !== 'development') {
    return null
  }
  
  return (
    <div className="fixed top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded z-50">
      {isMobile ? 'Mobile' : 'Desktop'} | {typeof window !== 'undefined' ? window.innerWidth : 'SSR'}px
    </div>
  )
}
