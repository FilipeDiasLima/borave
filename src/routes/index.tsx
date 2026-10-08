import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { EventDetails } from '#/components/home/event-details'
import { EventsListing } from '#/components/home/events-listing'
import type { ListingOrigin } from '#/components/home/events-listing'
import { PosterWall } from '#/components/home/poster-wall'
import { SiteFooter } from '#/components/home/site-footer'
import { SiteHeader } from '#/components/home/site-header'
import { TicketBooth } from '#/components/home/ticket-booth'
import { allEvents } from '#/data/all-events'
import { featuredEvents } from '#/data/featured-events'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [listingOpen, setListingOpen] = useState(false)
  const [origin, setOrigin] = useState<ListingOrigin>({ x: 0, y: 0 })
  const event = featuredEvents[activeIndex]

  // A listagem abre crescendo a partir do botão que foi clicado.
  const openAll = (from: HTMLElement) => {
    const rect = from.getBoundingClientRect()
    setOrigin({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 })
    setListingOpen(true)
  }

  return (
    <>
      <SiteHeader onOpenAll={openAll} />
      <main>
        <PosterWall
          events={featuredEvents}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
          allEventsCount={allEvents.length}
          onOpenAll={openAll}
        />
        <EventDetails event={event} />
        {/* key: trocar de evento zera o pedido */}
        <TicketBooth key={event.id} event={event} />
      </main>
      <SiteFooter events={allEvents} />
      <EventsListing
        open={listingOpen}
        origin={origin}
        events={allEvents}
        onClose={() => setListingOpen(false)}
      />
    </>
  )
}
