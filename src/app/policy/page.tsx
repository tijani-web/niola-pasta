export const metadata = {
  title: 'Our Policies | Niola\'s Pasta',
}

export default function PolicyPage() {
  return (
    <div className="bg-white min-h-screen py-12 md:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold text-primary font-serif mb-8 text-center border-b border-primary/10 pb-8">
          Our Policies
        </h1>
        
        <div className="prose prose-primary max-w-none prose-headings:font-serif prose-headings:text-primary">
          <section className="mb-10">
            <h3>1. Order Confirmation</h3>
            <p>Orders are confirmed only after full payment for the food is received via Paystack. Once paid, you will receive an order tracking link. We will also contact you to confirm delivery details.</p>
          </section>

          <section className="mb-10">
            <h3>2. Payment Policy</h3>
            <p>All payments must be made securely online. <strong>The delivery fee is included in your online payment</strong> at checkout based on your selected zone. Dispatch riders are already paid for their service and will not request payment from you.</p>
          </section>

          <section className="mb-10">
            <h3>3. Delivery Policy</h3>
            <p>We outsource our deliveries to third-party dispatch riders. While we strive to ensure timely delivery, wait times depend on rider availability and distance. We will give you an estimated delivery time when we confirm your order.</p>
          </section>

          <section className="mb-10">
            <h3>4. Delivery Waiting Policy</h3>
            <p>Dispatch riders will wait a maximum of <strong>10 minutes</strong> at your location. If you are unreachable or unavailable within this timeframe, the rider will leave, and you will be responsible for paying another delivery fee online for a second attempt.</p>
          </section>

          <section className="mb-10">
            <h3>5. Cancellation Policy</h3>
            <p>You may cancel your order <strong>only before preparation begins</strong> (i.e., while your order is in "Pending Confirmation" status). Once your order status changes to "Preparing," cancellations are strictly not allowed.</p>
          </section>

          <section className="mb-10">
            <h3>6. Refund & Replacement Policy</h3>
            <p>We do not offer refunds once food is prepared. If there is a genuine issue with your order (e.g., wrong item delivered), please contact us immediately on WhatsApp with a photo, and we will arrange a replacement.</p>
          </section>

          <section className="mb-10">
            <h3>7. Pickup Policy</h3>
            <p>If you prefer to pick up your order at our location (Uniosun second gate, opposite VIP Lodge), please contact us on WhatsApp immediately after placing your order to notify us.</p>
          </section>

          <section className="mb-10">
            <h3>8. Allergen Policy</h3>
            <p>Our food may contain traces of allergens (e.g., dairy, eggs, gluten). If you have a severe food allergy, please contact us before placing your order.</p>
          </section>
        </div>
      </div>
    </div>
  )
}
