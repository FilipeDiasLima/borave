import { useState } from 'react'
import { createFileRoute } from '@tanstack/react-router'

import { EventDetails } from '#/components/home/event-details'
import { PosterWall } from '#/components/home/poster-wall'
import { SiteFooter } from '#/components/home/site-footer'
import { SiteHeader } from '#/components/home/site-header'
import { TicketBooth } from '#/components/home/ticket-booth'
import { featuredEvents } from '#/data/featured-events'

export const Route = createFileRoute('/')({ component: Home })

function Home() {
  const [activeIndex, setActiveIndex] = useState(0)
  const event = featuredEvents[activeIndex]

  return (
    <>
      <SiteHeader />
      <main>
        <PosterWall
          events={featuredEvents}
          activeIndex={activeIndex}
          onChange={setActiveIndex}
        />
        <EventDetails event={event} />
        {/* key: trocar de evento zera o pedido */}
        <TicketBooth key={event.id} event={event} />
      </main>
      <SiteFooter events={featuredEvents} />
    </>
  )
}
