import { stitch } from "@google/stitch-sdk";

const projectId = process.env.STITCH_PROJECT_ID || "srikarfolio";
const apiKey = process.env.STITCH_API_KEY;

if (!apiKey) {
  console.error("Missing STITCH_API_KEY. Add it to your environment before running this script.");
  process.exit(1);
}

const prompt = `
Build a minimalist black-and-white cinematic one-page video-editor portfolio named ADyFolio.
Use the provided screenshots as source of truth for hierarchy and spacing, but use a cleaner
monochrome visual language. Use bg1.png as the hero background behind the main title, with
subtle blur, grayscale treatment, dark overlay, grid/noise texture, glass panels, a large serif
outlined ADy title, a moving category marquee, horizontal Instagram-reel-style Vimeo cards,
contact cards, and a minimal footer. Do not invent credentials, clients, awards, metrics,
testimonials, or claims.
Use only these visible copy elements: "VIDEO EDITOR - AVAILABLE FOR PROJECTS", "ADy",
"cuts that hit different.", "Frame by frame. Story by story.", "WATCH MY WORK",
"GET IN TOUCH", "SELECTED WORK", "Curated Work.", "REACH ME OUT", "Hit me up.",
"Got a project in mind? A story to tell? Let's talk cuts, color, and creativity.",
Email, Discord, WhatsApp, Instagram, and "Currently available for new projects - response time
within 24 hours." Contact details: bsrikar.official@gmail.com, ady_edits, +91 7981397674,
@ady_.edits. Vimeo videos in this exact order: 1190517419, 1190793591, 1190793617,
1190516845, 1190516847. Keep responsive mobile composition faithful to the references.
`;

const project = stitch.project(projectId, { apiKey });
const screen = await project.generate(prompt);

console.log("HTML:", await screen.getHtml());
console.log("Image:", await screen.getImage());
