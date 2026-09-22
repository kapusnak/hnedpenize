import Image from "next/image"

export function HeroHousePhoto() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="hero-house-fade absolute inset-x-0 top-0 h-[22rem] sm:h-[26rem] lg:inset-y-0 lg:right-auto lg:h-full lg:w-[min(72%,48rem)] xl:w-[min(70%,54rem)]">
        <Image
          src="/hero-house.webp"
          alt="Moderní rodinný dům"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 70vw"
          className="object-cover object-[52%_50%] sm:object-[50%_48%] lg:object-[48%_46%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/20 via-primary/35 to-primary/70 lg:from-blue-400/20 lg:via-primary/40 lg:to-primary"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-blue-700/50 via-transparent to-blue-400/15 lg:from-blue-700/60 lg:to-blue-400/25"
          aria-hidden
        />
      </div>
    </div>
  )
}
