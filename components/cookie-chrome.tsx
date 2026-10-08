"use client"

import { useCallback, useEffect, useState } from "react"

import { CookieBanner } from "@/components/cookie-banner"
import { LeadPopup } from "@/components/lead-popup"

type CookieChromeProps = {
  showLeadPopup?: boolean
}

/** Cookie bar plus the homepage lead popup, stacked so they do not overlap. */
export function CookieChrome({ showLeadPopup = false }: CookieChromeProps) {
  const [cookieBarOpen, setCookieBarOpen] = useState(false)

  const onCookieVisibleChange = useCallback((visible: boolean) => {
    setCookieBarOpen(visible)
  }, [])

  useEffect(() => {
    const root = document.documentElement
    const reset = () => {
      root.style.setProperty("--hnedpenize-popup-bottom-mob", "0px")
      root.style.setProperty("--hnedpenize-popup-bottom-lg", "1.5rem")
      root.style.setProperty("--hnedpenize-cookie-bar-offset", "0px")
    }

    if (!cookieBarOpen) {
      reset()
      return
    }

    const bar = document.getElementById("cookie-banner")
    if (!bar) {
      reset()
      return
    }

    const apply = () => {
      const height = Math.ceil(bar.getBoundingClientRect().height)
      const px = `${height}px`
      root.style.setProperty("--hnedpenize-popup-bottom-mob", px)
      root.style.setProperty("--hnedpenize-popup-bottom-lg", px)
      root.style.setProperty("--hnedpenize-cookie-bar-offset", px)
    }

    apply()
    const observer = new ResizeObserver(apply)
    observer.observe(bar)
    return () => {
      observer.disconnect()
      reset()
    }
  }, [cookieBarOpen])

  return (
    <>
      {showLeadPopup ? <LeadPopup /> : null}
      <CookieBanner onVisibleChange={onCookieVisibleChange} />
    </>
  )
}
