import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { DeliveryCard } from './DeliveryCard'
import type { DeliveryResponse } from '../types/delivery'

const baseDelivery: DeliveryResponse = {
  title: 'Your next delivery for Dorian and Ocie',
  message: "Hey Kayleigh! In two days' time, we'll be charging you.",
  totalPrice: 134,
  freeGift: false,
}

describe('DeliveryCard', () => {
  it('renders the title, message and formatted price', () => {
    render(<DeliveryCard delivery={baseDelivery} />)

    expect(screen.getByText(baseDelivery.title)).toBeInTheDocument()
    expect(screen.getByText(baseDelivery.message)).toBeInTheDocument()
    expect(screen.getByText('£134.00')).toBeInTheDocument()
  })

  it('formats non-integer prices to two decimal places', () => {
    render(<DeliveryCard delivery={{ ...baseDelivery, totalPrice: 9.5 }} />)

    expect(screen.getByText('£9.50')).toBeInTheDocument()
  })

  it('hides the FREE GIFT sticker when freeGift is false', () => {
    render(<DeliveryCard delivery={baseDelivery} />)

    expect(screen.queryByTestId('free-gift')).not.toBeInTheDocument()
  })

  it('shows the FREE GIFT sticker when freeGift is true', () => {
    render(<DeliveryCard delivery={{ ...baseDelivery, freeGift: true }} />)

    expect(screen.getByTestId('free-gift')).toBeInTheDocument()
    expect(screen.getByText(/free gift/i)).toBeInTheDocument()
  })
})
