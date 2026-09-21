import Image from "next/image"

export function HeroHousePhoto() {
  return (
    <div className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
      <div className="hero-house-fade absolute inset-x-0 top-0 h-[19.5rem] sm:h-[24rem] lg:inset-y-0 lg:right-auto lg:h-full lg:w-[min(72%,48rem)] xl:w-[min(70%,54rem)]">
        <Image
          src="/hero-house.webp"
          alt="Moderní rodinný dům"
          fill
          priority
          sizes="(max-width: 1023px) 100vw, 70vw"
          className="object-cover object-[46%_40%] sm:object-[42%_42%]"
        />
        <div
          className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-primary/45 to-primary/80 lg:from-blue-400/20 lg:via-primary/40 lg:to-primary"
          aria-hidden
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-blue-700/60 via-transparent to-blue-400/25"
          aria-hidden
        />
      </div>
    </div>
  )
}
