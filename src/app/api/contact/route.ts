// app/api/contact/route.ts
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  const { navn, epost, telefon, melding } = await req.json();

  if (!navn || !epost || !telefon || !melding) {
    return new Response("Ufullstendig data", { status: 400 });
  }

  // Transport for Gmail
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: `"Nettside henvendelse" <${process.env.EMAIL_USER}>`,
    to: "massagevika24@gmail.com",
    subject: "Ny melding fra kontaktskjema",
    html: `
      <h2>Ny melding fra nettsiden</h2>
      <p><strong>Navn:</strong> ${navn}</p>
      <p><strong>E-post:</strong> ${epost}</p>
      <p><strong>Telefon:</strong> ${telefon}</p>
      <p><strong>Melding:</strong></p>
      <p>${melding}</p>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return new Response("Melding sendt!", { status: 200 });
  } catch (error) {
    console.error("Feil ved sending av e-post:", error);
    return new Response("Feil ved sending av e-post", { status: 500 });
  }
}
