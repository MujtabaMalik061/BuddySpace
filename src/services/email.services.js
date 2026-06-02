const htmlContent = `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;border:1px solid #ddd;padding:20px;">
        <h2 style="text-align:center;">Thank you for your order</h2>
        <p>Hi ${user.name},</p>
        <p>We’ve received your order on ${orderDate}, and it’s now being processed.</p>

        <h3 style="margin-top:30px;">Order Summary</h3>
        <table width="100%" style="border-collapse:collapse;">
          ${productsHtml}
        </table>

        <hr style="margin:20px 0;">
        <p><b>Total:</b> Rs ${total}</p>
        <p><b>Payment Method:</b> ${paymentMethod}</p>

        <h3 style="margin-top:30px;">Billing Address</h3>
        <p>${user.name}<br>${address.location}, ${address.city}, ${address.country}</p>
        <p>${user.email}</p>

        <h3>Shipping Address</h3>
        <p>${user.name}<br>${address.location}, ${address.city}, ${address.country}</p>

        <p style="margin-top:30px;">If you have any questions about your order, contact us at 
          <a href="mailto:CartSense@gmail.com">CartSense@gmail.com</a>.
        </p>

        <p style="text-align:center;margin-top:30px;">— The Cart Sense Team</p>
      </div>
    `;
