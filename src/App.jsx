import React, { useEffect, useRef, useState, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { createStitches, keyframes } from "@stitches/react";
import {
  ArrowRight,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Instagram,
  Mail,
  X,
  Play,
} from "lucide-react";
import "./base.css";

const { styled, globalCss } = createStitches({
  theme: {
    colors: {
      black: "#030303",
      ink: "#080808",
      panel: "rgba(12, 12, 12, 0.76)",
      panelDeep: "rgba(5, 5, 5, 0.9)",
      line: "rgba(255, 255, 255, 0.12)",
      text: "#f3f1ea",
      muted: "rgba(243, 241, 234, 0.52)",
      dim: "rgba(243, 241, 234, 0.3)",
      white: "#ffffff",
      silver: "#cfcfc9",
      gold: "#f5c542",
      lightGold: "#ffe68a",
      green: "#38e47d",
      whatsapp: "#25d366",
      discord: "#5865f2",
      instagram: "#e4405f",
      mail: "#f4c542",
    },
    fonts: {
      serif: '"Bodoni 72", "Didot", "Georgia", serif',
      sans: '"Inter", "Satoshi", "Segoe UI", "Helvetica Neue", Arial, sans-serif',
      mono: '"Space Mono", "Courier New", monospace',
    },
    shadows: {
      bloom: "0 0 34px rgba(255, 255, 255, 0.14), 0 0 90px rgba(255, 255, 255, 0.07)",
      panel: "0 34px 110px rgba(0, 0, 0, 0.72), inset 0 1px 0 rgba(255, 255, 255, 0.06)",
    },
  },
});

const heroImageUrl = `${import.meta.env.BASE_URL}assets/bg1.png`;

function DiscordMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M19.5 5.6A15.5 15.5 0 0 0 15.7 4l-.2.4c-.2.4-.4.8-.5 1.2a13.4 13.4 0 0 0-6 0 8 8 0 0 0-.7-1.6 15.5 15.5 0 0 0-3.8 1.6C2.1 9.1 1.5 12.5 1.8 15.8a15 15 0 0 0 4.7 2.4l1-1.7c-.5-.2-1-.4-1.4-.7l.3-.3a10.8 10.8 0 0 0 11.2 0l.3.3c-.5.3-.9.5-1.4.7l1 1.7a15 15 0 0 0 4.7-2.4c.4-3.9-.7-7.2-2.7-10.2ZM8.7 14.2c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8c0 1-.7 1.8-1.6 1.8Zm6.6 0c-.9 0-1.6-.8-1.6-1.8s.7-1.8 1.6-1.8 1.7.8 1.6 1.8c0 1-.7 1.8-1.6 1.8Z"
      />
    </svg>
  );
}

function WhatsAppMark(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" {...props}>
      <path
        fill="currentColor"
        d="M12 2.1a9.8 9.8 0 0 0-8.4 14.8L2.4 21.7l4.9-1.2A9.8 9.8 0 1 0 12 2.1Zm0 17.8a8 8 0 0 1-4.1-1.1l-.3-.2-2.9.7.8-2.8-.2-.3A8 8 0 1 1 12 19.9Zm4.5-6c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.6.1l-.7.9c-.1.2-.3.2-.5.1a6.5 6.5 0 0 1-3.2-2.8c-.2-.3 0-.4.1-.6l.4-.5c.1-.2.2-.3.3-.5.1-.2 0-.4 0-.5l-.8-1.9c-.2-.5-.4-.4-.6-.4h-.5c-.2 0-.5.1-.7.3-.2.2-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.9.6.3 1.1.4 1.5.5.6.2 1.2.1 1.6.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .2-1.1 0-.1-.2-.2-.4-.3Z"
      />
    </svg>
  );
}

const fadeIn = keyframes({
  from: { opacity: 0, transform: "scale(0.98)" },
  to: { opacity: 1, transform: "scale(1)" },
});

const slideUp = keyframes({
  from: { opacity: 0, transform: "translateY(20px)" },
  to: { opacity: 1, transform: "translateY(0)" },
});

const pulse = keyframes({
  "0%, 100%": { transform: "translateY(0)", opacity: 0.42 },
  "50%": { transform: "translateY(6px)", opacity: 0.9 },
});

const scan = keyframes({
  "0%": { backgroundPosition: "0 0" },
  "100%": { backgroundPosition: "0 11px" },
});

const marquee = keyframes({
  "0%": { transform: "translateX(0)" },
  "100%": { transform: "translateX(-50%)" },
});

const useGlobal = globalCss({
  "*": { boxSizing: "border-box" },
  html: {
    scrollBehavior: "smooth",
    background: "$black",
  },
  body: {
    margin: 0,
    minWidth: "320px",
    overflowX: "hidden",
    background: "$black",
    color: "$text",
    fontFamily: "$sans",
    letterSpacing: 0,
  },
  a: { color: "inherit", textDecoration: "none" },
  button: { font: "inherit" },
  "::selection": {
    background: "rgba(245, 197, 66, 0.34)",
    color: "$black",
  },
});

const AppShell = styled("main", {
  position: "relative",
  minHeight: "100vh",
  isolation: "isolate",
  overflow: "hidden",
  background:
    "radial-gradient(circle at 70% 0%, rgba(255,255,255,0.045), transparent 28%), #030303",
});

const GridVeil = styled("div", {
  position: "fixed",
  inset: 0,
  zIndex: -2,
  pointerEvents: "none",
  opacity: 0.42,
  backgroundImage:
    "linear-gradient(rgba(255,255,255,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.045) 1px, transparent 1px)",
  backgroundSize: "min(14vw, 170px) min(14vw, 170px)",
  maskImage: "linear-gradient(to bottom, rgba(0,0,0,0.9), rgba(0,0,0,0.4), rgba(0,0,0,0.8))",
});

const NoiseVeil = styled("div", {
  position: "fixed",
  inset: 0,
  zIndex: -1,
  pointerEvents: "none",
  opacity: 0.08,
  backgroundImage:
    "repeating-linear-gradient(0deg, rgba(255,255,255,0.1) 0, rgba(255,255,255,0.1) 1px, transparent 1px, transparent 4px)",
  animation: `${scan} 900ms linear infinite`,
});

const Section = styled("section", {
  width: "100%",
  position: "relative",
});

const Inner = styled("div", {
  width: "min(1120px, calc(100% - 36px))",
  margin: "0 auto",
});

const Hero = styled(Section, {
  minHeight: "100svh",
  display: "grid",
  placeItems: "center",
  textAlign: "center",
  overflow: "hidden",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  background: "#050505",

  "&::before": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 0,
    backgroundImage: `url('${heroImageUrl}')`,
    backgroundSize: "cover",
    backgroundPosition: "center",
    filter: "grayscale(1) contrast(1.08) brightness(0.46) blur(4px)",
    transform: "scale(1.04)",
  },

  "&::after": {
    content: "",
    position: "absolute",
    inset: 0,
    zIndex: 0,
    background:
      "linear-gradient(to bottom, rgba(0,0,0,0.42), rgba(0,0,0,0.58) 48%, rgba(0,0,0,0.92) 100%), radial-gradient(circle at 50% 38%, rgba(255,255,255,0.12), transparent 26%)",
  },
});

const HeroFrame = styled("div", {
  width: "min(980px, calc(100% - 34px))",
  padding: "clamp(82px, 14vh, 152px) 0 clamp(94px, 12vh, 150px)",
  position: "relative",
  zIndex: 1,

  "&::before": {
    content: "",
    position: "absolute",
    left: "50%",
    top: "50%",
    width: "min(74vw, 720px)",
    height: "min(74vw, 520px)",
    transform: "translate(-50%, -54%)",
    border: "1px solid rgba(255,255,255,0.08)",
    boxShadow: "inset 0 0 90px rgba(0,0,0,0.62)",
    background: "rgba(0,0,0,0.12)",
    backdropFilter: "blur(2px)",
  },
});

const Kicker = styled("p", {
  position: "relative",
  zIndex: 1,
  margin: "0 0 clamp(28px, 6vh, 52px)",
  display: "inline-flex",
  alignItems: "center",
  gap: "18px",
  color: "#ff3b3b",
  fontSize: "clamp(0.72rem, 1.7vw, 0.96rem)",
  fontWeight: 800,
  letterSpacing: "0.44em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",

  "&::before, &::after": {
    content: "",
    width: 9,
    height: 9,
    borderRadius: "50%",
    background: "#ff3b3b",
    boxShadow: "0 0 18px rgba(255, 59, 59, 0.62)",
    flex: "0 0 auto",
  },

  "@media (max-width: 560px)": {
    gap: 10,
    fontSize: "0.56rem",
    letterSpacing: "0.2em",
  },

  "@media (max-width: 360px)": {
    gap: 8,
    fontSize: "0.5rem",
    letterSpacing: "0.12em",
  },
});

const TitleWrap = styled("div", {
  position: "relative",
  zIndex: 1,
  display: "inline-grid",
  placeItems: "center",
  filter: "drop-shadow(0 0 24px rgba(255,255,255,0.12))",
});

const TitleGhost = styled("span", {
  gridArea: "1 / 1",
  fontFamily: "$serif",
  fontSize: "clamp(7rem, 19vw, 15rem)",
  fontWeight: 900,
  lineHeight: 0.76,
  textTransform: "uppercase",
  letterSpacing: "0.015em",
  color: "transparent",
  WebkitTextStroke: "1.4px rgba(255,255,255,0.34)",
  transform: "translate(7px, 8px)",
  opacity: 0.9,
});

const Title = styled("h1", {
  gridArea: "1 / 1",
  margin: 0,
  fontFamily: "$serif",
  fontSize: "clamp(7rem, 19vw, 15rem)",
  fontWeight: 900,
  lineHeight: 0.76,
  letterSpacing: "0.015em",
  textTransform: "none",
  color: "rgba(255,255,255,0.08)",
  WebkitTextStroke: "2px rgba(255,255,255,0.92)",
  textShadow:
    "1px 0 0 rgba(255,255,255,0.5), -1px 0 0 rgba(80,80,80,0.7), 0 0 34px rgba(255,255,255,0.2), 0 0 70px rgba(0,0,0,0.85)",

  "&::after": {
    content: "ADy",
    position: "absolute",
    inset: 0,
    color: "transparent",
    WebkitTextStroke: "1px rgba(255,255,255,0.18)",
    transform: "translate(-3px, -3px)",
    pointerEvents: "none",
  },
});

const Tagline = styled("p", {
  position: "relative",
  zIndex: 1,
  margin: "-18px 0 0",
  fontFamily: "$serif",
  fontStyle: "italic",
  fontSize: "clamp(1.5rem, 4vw, 3rem)",
  fontWeight: 800,
  lineHeight: 1,
  color: "$gold",
  textShadow: "0 0 28px rgba(245,197,66,0.24), 0 2px 0 rgba(0,0,0,0.7)",
});

const Quote = styled("p", {
  position: "relative",
  zIndex: 1,
  margin: "clamp(36px, 7vh, 60px) auto 0",
  color: "$lightGold",
  fontSize: "clamp(1rem, 2vw, 1.28rem)",
  fontStyle: "italic",
  fontWeight: 600,
  letterSpacing: "0.06em",
});

const ButtonStack = styled("div", {
  position: "relative",
  zIndex: 1,
  width: "min(430px, 100%)",
  margin: "clamp(42px, 7vh, 64px) auto 0",
  display: "grid",
  gap: 22,
});

const Button = styled("a", {
  minHeight: 76,
  display: "inline-flex",
  alignItems: "center",
  justifyContent: "center",
  gap: 24,
  borderRadius: 8,
  border: "1px solid rgba(255,255,255,0.16)",
  fontWeight: 900,
  letterSpacing: "0.18em",
  textTransform: "uppercase",
  transition: "transform 240ms ease, border-color 240ms ease, background 240ms ease, box-shadow 240ms ease",
  boxShadow: "$panel",

  "& svg": { width: 24, height: 24, transition: "transform 240ms ease" },
  "&:hover": {
    transform: "translateY(-2px)",
    boxShadow: "$bloom",
  },
  "&:hover svg": { transform: "translateX(4px)" },

  variants: {
    tone: {
      primary: {
        background: "$white",
        color: "#050505",
        borderColor: "rgba(255,255,255,0.9)",
      },
      secondary: {
        background: "rgba(4,4,4,0.42)",
        color: "$text",
        borderColor: "rgba(255,255,255,0.2)",
        backdropFilter: "blur(10px)",
      },
    },
  },
});

const ScrollCue = styled("a", {
  position: "relative",
  zIndex: 1,
  marginTop: 12,
  display: "inline-grid",
  gap: 6,
  justifyItems: "center",
  color: "rgba(255,255,255,0.46)",
  fontSize: "0.72rem",
  letterSpacing: "0.44em",
  textTransform: "uppercase",
  animation: `${pulse} 1.9s ease-in-out infinite`,

  "& svg": { width: 28, height: 28, color: "rgba(255,255,255,0.78)" },
});

const CategoryRail = styled("div", {
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  zIndex: 2,
  minHeight: 52,
  display: "flex",
  alignItems: "center",
  overflow: "hidden",
  borderBottom: "1px solid rgba(255,255,255,0.12)",
  borderTop: "1px solid rgba(255,255,255,0.06)",
  background: "rgba(0,0,0,0.68)",
  backdropFilter: "blur(16px)",
});

const CategoryTrack = styled("div", {
  display: "flex",
  minWidth: "max-content",
  gap: "clamp(58px, 9vw, 128px)",
  paddingRight: "clamp(58px, 9vw, 128px)",
  color: "rgba(255,255,255,0.52)",
  fontSize: "clamp(0.64rem, 1.4vw, 0.82rem)",
  fontWeight: 900,
  letterSpacing: "0.38em",
  textTransform: "uppercase",
  animation: `${marquee} 30s linear infinite`,
  willChange: "transform",

  "& span": { whiteSpace: "nowrap" },
});

const WorkSection = styled(Section, {
  padding: "clamp(86px, 12vw, 148px) 0 clamp(88px, 13vw, 170px)",
  background: "linear-gradient(to bottom, #030303 0%, rgba(8,8,8,0.98) 44%, #030303 100%)",
});

const Label = styled("p", {
  margin: 0,
  display: "flex",
  alignItems: "center",
  gap: 26,
  color: "$silver",
  fontSize: "clamp(0.84rem, 2vw, 1rem)",
  fontWeight: 900,
  letterSpacing: "0.42em",
  textTransform: "uppercase",

  "&::before": {
    content: "",
    width: "clamp(74px, 8vw, 102px)",
    height: 2,
    background: "$silver",
  },
});

const SectionTitle = styled("h2", {
  margin: "clamp(28px, 5vw, 44px) 0 0",
  fontFamily: "$serif",
  fontSize: "clamp(4.1rem, 11vw, 7.9rem)",
  lineHeight: 0.86,
  fontWeight: 900,
  letterSpacing: 0,
  color: "$text",

  variants: {
    tone: {
      gold: {
        color: "$gold",
        textShadow: "0 0 34px rgba(245,197,66,0.14)",
      },
    },
  },
});

const WorkTop = styled("div", {
  display: "block",
  marginBottom: "clamp(40px, 6vw, 72px)",
});

/* ── Full-bleed showcase ── */
const ShowcaseWrap = styled("div", {
  position: "relative",
  width: "100%",
});

const ShowcaseTitleBelow = styled("h3", {
  marginTop: 24,
  fontFamily: "$serif",
  fontSize: "clamp(1.5rem, 3vw, 2.5rem)",
  fontWeight: 800,
  color: "$text",
  textAlign: "center",
  textShadow: "0 4px 12px rgba(0,0,0,0.6)",
});

const ShowcaseStage = styled("div", {
  position: "relative",
  width: "100%",
  aspectRatio: "16 / 9",
  background: "#000",
  overflow: "hidden",
  borderRadius: 0,
  border: "none",
  borderTop: "2px solid rgba(255,255,255,0.12)",
  borderBottom: "2px solid rgba(255,255,255,0.12)",
  boxShadow: "0 60px 180px rgba(0,0,0,0.9)",

  "& video": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "contain",
    background: "#000",
    animation: `${fadeIn} 600ms ease-out`,
  },
});

const ShowcaseVignette = styled("div", {
  position: "absolute",
  inset: 0,
  zIndex: 1,
  pointerEvents: "none",
  boxShadow: "inset 0 0 150px rgba(0,0,0,0.8)",
  background: "radial-gradient(circle at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
});

const ShowcaseProgress = styled("div", {
  position: "absolute",
  bottom: 0,
  left: 0,
  height: 3,
  background: "$gold",
  zIndex: 10,
  transition: "width 8000ms linear",
  boxShadow: "0 0 12px $gold",
});

const ShowcaseOverlay = styled("div", {
  position: "absolute",
  inset: 0,
  zIndex: 2,
  pointerEvents: "none",
  background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 30%, transparent 70%, rgba(0,0,0,0.4) 100%)",
});

const ShowcaseInfo = styled("div", {
  position: "absolute",
  left: 0,
  right: 0,
  bottom: 0,
  zIndex: 3,
  padding: "clamp(24px, 4vw, 48px) clamp(24px, 4vw, 56px)",
  display: "flex",
  alignItems: "flex-end",
  justifyContent: "space-between",
  gap: 24,
  pointerEvents: "none",
});

const ShowcaseTitle = styled("h3", {
  margin: 0,
  fontFamily: "$serif",
  fontSize: "clamp(2rem, 5vw, 4.2rem)",
  fontWeight: 900,
  color: "$text",
  textShadow: "0 4px 32px rgba(0,0,0,0.95)",
  lineHeight: 1,
  animation: `${slideUp} 700ms ease-out`,
});

const ShowcaseCounter = styled("span", {
  fontFamily: "$mono",
  fontSize: "clamp(0.9rem, 2vw, 1.2rem)",
  fontWeight: 700,
  color: "rgba(255,255,255,0.5)",
  whiteSpace: "nowrap",
  textShadow: "0 2px 12px rgba(0,0,0,0.8)",
});

const ShowcaseNav = styled("button", {
  position: "absolute",
  top: "50%",
  transform: "translateY(-50%)",
  zIndex: 5,
  width: "clamp(48px, 5vw, 64px)",
  height: "clamp(48px, 5vw, 64px)",
  display: "grid",
  placeItems: "center",
  borderRadius: "50%",
  border: "1px solid rgba(255,255,255,0.2)",
  background: "rgba(0,0,0,0.5)",
  backdropFilter: "blur(12px)",
  color: "$text",
  cursor: "pointer",
  transition: "all 220ms ease",
  "& svg": { width: 28, height: 28 },
  "&:hover": {
    background: "rgba(255,255,255,0.14)",
    borderColor: "rgba(255,255,255,0.5)",
    transform: "translateY(-50%) scale(1.1)",
  },
  variants: {
    side: {
      left: { left: "clamp(12px, 2vw, 28px)" },
      right: { right: "clamp(12px, 2vw, 28px)" },
    },
  },
});

/* ── Filmstrip thumbnails ── */
const Filmstrip = styled("div", {
  marginTop: "clamp(16px, 2vw, 28px)",
  padding: "0 clamp(12px, 2vw, 28px)",
  display: "flex",
  gap: "clamp(8px, 1.2vw, 16px)",
  justifyContent: "center",
  flexWrap: "wrap",
});

const FilmThumb = styled("button", {
  position: "relative",
  width: "clamp(160px, 18vw, 240px)",
  aspectRatio: "16 / 9",
  borderRadius: 14,
  overflow: "hidden",
  border: "3px solid transparent",
  background: "#111",
  cursor: "pointer",
  transition: "all 400ms cubic-bezier(0.2, 0.8, 0.2, 1)",
  opacity: 0.44,
  transform: "scale(0.92)",

  "&.active": {
    opacity: 1,
    borderColor: "$gold",
    transform: "scale(1.1)",
    boxShadow: "0 0 50px rgba(245,197,66,0.45), 0 16px 64px rgba(0,0,0,0.8)",
    zIndex: 5,
  },

  "&:hover:not(.active)": {
    opacity: 0.9,
    transform: "scale(1.02)",
    borderColor: "rgba(255,255,255,0.45)",
    boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
  },

  "& video": {
    position: "absolute",
    inset: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    pointerEvents: "none",
  },
});

const ThumbLabel = styled("span", {
  position: "absolute",
  bottom: 12,
  left: "50%",
  transform: "translateX(-50%)",
  zIndex: 2,
  background: "rgba(0,0,0,0.72)",
  backdropFilter: "blur(8px)",
  color: "$text",
  fontSize: "0.68rem",
  fontWeight: 800,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  textAlign: "center",
  padding: "4px 12px",
  borderRadius: 100,
  border: "1px solid rgba(255,255,255,0.15)",
  transition: "all 300ms ease",
  whiteSpace: "nowrap",
  ".active &": { 
    background: "$gold", 
    color: "$black",
    borderColor: "$gold",
    boxShadow: "0 0 15px rgba(245,197,66,0.4)",
  },
});


const ContactSection = styled(Section, {
  padding: "clamp(92px, 13vw, 170px) 0 clamp(58px, 9vw, 112px)",
  background: "#030303",
});

const ContactIntro = styled("div", {
  maxWidth: 850,
});

const Lead = styled("p", {
  margin: "clamp(32px, 5vw, 48px) 0 0",
  maxWidth: 780,
  color: "$muted",
  fontSize: "clamp(1.45rem, 4vw, 2.45rem)",
  lineHeight: 1.65,
  fontWeight: 400,
});

const ContactGrid = styled("div", {
  marginTop: "clamp(72px, 9vw, 106px)",
  display: "grid",
  gap: 28,
});

const ContactCard = styled("a", {
  minHeight: 214,
  display: "grid",
  gridTemplateColumns: "132px 1fr",
  alignItems: "start",
  gap: 28,
  padding: "clamp(28px, 5vw, 54px)",
  borderRadius: 30,
  border: "1px solid rgba(255,255,255,0.14)",
  background: "$panel",
  boxShadow: "$panel",
  backdropFilter: "blur(18px)",
  transition: "transform 260ms ease, border-color 260ms ease, background 260ms ease",

  "&:hover": {
    transform: "translateY(-4px)",
    borderColor: "rgba(255,255,255,0.36)",
    background: "rgba(18,18,18,0.82)",
  },

  "@media (max-width: 680px)": {
    gridTemplateColumns: "1fr",
    gap: 24,
    minHeight: 0,
    borderRadius: 28,
  },
});

const ContactIcon = styled("span", {
  width: 94,
  height: 94,
  display: "grid",
  placeItems: "center",
  borderRadius: 28,
  background: "rgba(255,255,255,0.08)",
  color: "$text",

  "& svg": { width: 50, height: 50, strokeWidth: 1.9 },

  variants: {
    tone: {
      mail: {
        color: "$mail",
        background: "rgba(244,197,66,0.11)",
      },
      discord: {
        color: "$discord",
        background: "rgba(88,101,242,0.14)",
      },
      whatsapp: {
        color: "$whatsapp",
        background: "rgba(37,211,102,0.13)",
      },
      instagram: {
        color: "$white",
        background:
          "linear-gradient(135deg, #405de6 0%, #833ab4 28%, #e1306c 58%, #fd1d1d 78%, #fcb045 100%)",
        boxShadow: "0 0 28px rgba(228,64,95,0.18)",
      },
    },
  },
});

const ContactCopy = styled("div", {
  display: "grid",
  gap: 18,
});

const CardTitle = styled("h3", {
  margin: 0,
  color: "$text",
  fontSize: "clamp(1.55rem, 4vw, 2.05rem)",
  lineHeight: 1,
  fontWeight: 850,
});

const ContactHandle = styled("p", {
  margin: 0,
  color: "$silver",
  fontFamily: "$mono",
  fontSize: "clamp(1.08rem, 3.5vw, 1.55rem)",
  lineHeight: 1.2,
  overflowWrap: "anywhere",
});

const CardText = styled("p", {
  margin: 0,
  maxWidth: 640,
  color: "$muted",
  fontSize: "clamp(1.04rem, 2.5vw, 1.55rem)",
  lineHeight: 1.7,
});

const Availability = styled("p", {
  margin: "clamp(58px, 9vw, 90px) 0 0",
  display: "flex",
  alignItems: "flex-start",
  gap: 32,
  color: "$muted",
  fontSize: "clamp(1.1rem, 2.8vw, 1.72rem)",
  lineHeight: 1.5,

  "&::before": {
    content: "",
    width: 20,
    height: 20,
    marginTop: "0.35em",
    borderRadius: "50%",
    background: "$green",
    boxShadow: "0 0 22px rgba(56, 228, 125, 0.55)",
    flex: "0 0 auto",
  },
});

const Footer = styled("footer", {
  padding: "clamp(70px, 10vw, 104px) 0",
  borderTop: "1px solid rgba(255,255,255,0.13)",
  background: "rgba(3,3,3,0.88)",
  textAlign: "center",
});

const Brand = styled("div", {
  display: "inline-flex",
  alignItems: "center",
  gap: 28,
  fontFamily: "$serif",
  color: "$text",
  fontSize: "clamp(1.5rem, 4vw, 2.05rem)",
  fontWeight: 900,
  letterSpacing: "0.27em",
  textTransform: "none",

  "&::before": {
    content: "",
    width: 20,
    height: 16,
    display: "block",
    borderRadius: 2,
    border: "1px solid rgba(255,255,255,0.82)",
    background: "linear-gradient(90deg, rgba(255,255,255,0.9), rgba(90,90,90,0.65))",
    boxShadow: "0 0 12px rgba(255,255,255,0.22)",
  },
});

const Copyright = styled("p", {
  margin: "clamp(34px, 5vw, 44px) 0 0",
  color: "$muted",
  fontSize: "clamp(1rem, 2.5vw, 1.38rem)",
});

const FooterLinks = styled("nav", {
  marginTop: 34,
  display: "flex",
  justifyContent: "center",
  gap: "clamp(28px, 5vw, 54px)",
  color: "$muted",
  fontSize: "clamp(1rem, 2.5vw, 1.25rem)",

  "& a": { transition: "color 220ms ease" },
  "& a:hover": { color: "$text" },
});

const marqueeItems = [
  "Looking for Projects",
  "Cinematic Reels",
  "Brand Films",
  "Social Crush",
  "Color Cuts",
  "Short Form",
  "YouTube Edits",
  "Music Videos",
  "Commercial Cuts",
  "Trailer Edits",
  "Motion Rhythm",
];

const videos = [
  {
    src: `${import.meta.env.BASE_URL}assets/videos/01-football-mogtr-reel.mp4`,
    label: "Football Mogrt Reel",
  },
  {
    src: `${import.meta.env.BASE_URL}assets/videos/02-spotify-ai-saas.mp4`,
    label: "Spotify AI SaaS",
  },
  {
    src: `${import.meta.env.BASE_URL}assets/videos/03-real-estate.mp4`,
    label: "Real Estate Edit",
  },
  {
    src: `${import.meta.env.BASE_URL}assets/videos/04-batman-edit.mp4`,
    label: "Batman Edit",
  },
  {
    src: `${import.meta.env.BASE_URL}assets/videos/05-spiderman-edit.mp4`,
    label: "Spiderman Edit",
  },
];

const contactCards = [
  {
    title: "Email",
    handle: "bsrikar.official@gmail.com",
    text: "For detailed project briefs, contracts, and formal collaborations.",
    icon: Mail,
    tone: "mail",
    href: "mailto:bsrikar.official@gmail.com",
  },
  {
    title: "Discord",
    handle: "ady_edits",
    text: "Open Discord and message me for creative projects and feedback.",
    icon: DiscordMark,
    tone: "discord",
    href: "https://discord.com/app",
  },
  {
    title: "WhatsApp",
    handle: "+91 7981397674",
    text: "Fastest way to reach me for project inquiries and quick chats.",
    icon: WhatsAppMark,
    tone: "whatsapp",
    href: "https://wa.me/917981397674",
  },
  {
    title: "Instagram",
    handle: "@ady_.edits",
    text: "For reels, edits, visual references, and quick creative direction.",
    icon: Instagram,
    tone: "instagram",
    href: "https://www.instagram.com/ady_.edits/",
  },
];

function Portfolio() {
  useGlobal();
  const [activeIdx, setActiveIdx] = useState(0);
  const [progressWidth, setProgressWidth] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const videoRef = useRef(null);

  const goTo = useCallback((idx) => {
    const next = ((idx % videos.length) + videos.length) % videos.length;
    setActiveIdx(next);
    setProgressWidth(0);
  }, []);

  // Keyboard nav
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "ArrowRight") goTo(activeIdx + 1);
      if (e.key === "ArrowLeft") goTo(activeIdx - 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [activeIdx, goTo]);

  // Auto-advance logic
  useEffect(() => {
    if (isPaused) return;
    const progressTimer = setTimeout(() => setProgressWidth(100), 50);
    const advanceTimer = setInterval(() => {
      goTo(activeIdx + 1);
    }, 8000);
    return () => {
      clearTimeout(progressTimer);
      clearInterval(advanceTimer);
      setProgressWidth(0);
    };
  }, [activeIdx, goTo, isPaused]);

  // Autoplay on switch
  useEffect(() => {
    const v = videoRef.current;
    if (v) { 
      v.currentTime = 0; 
      v.play().catch(() => undefined); 
    }
  }, [activeIdx]);

  return (
    <AppShell>
      <GridVeil />
      <NoiseVeil />

      <Hero id="top">
        <HeroFrame>
          <Kicker>Video Editor - Available for Projects</Kicker>
          <TitleWrap aria-label="ADy">
            <TitleGhost aria-hidden="true">ADy</TitleGhost>
            <Title>ADy</Title>
          </TitleWrap>
          <Tagline>cuts that hit different.</Tagline>
          <Quote>"Frame by frame. Story by story."</Quote>

          <ButtonStack>
            <Button tone="primary" href="#work">
              Watch My Work <ArrowRight aria-hidden="true" />
            </Button>
            <Button tone="secondary" href="#contact">
              Get In Touch
            </Button>
            <ScrollCue href="#work" aria-label="Scroll to selected work">
              <span>Scroll</span>
              <ChevronDown aria-hidden="true" />
            </ScrollCue>
          </ButtonStack>
        </HeroFrame>

        <CategoryRail aria-hidden="true">
          <CategoryTrack>
            {[...marqueeItems, ...marqueeItems].map((item, index) => (
              <span key={`${item}-${index}`}>{item}</span>
            ))}
          </CategoryTrack>
        </CategoryRail>
      </Hero>

      <WorkSection id="work">
        <Inner>
          <WorkTop>
            <div>
              <Label>Selected Work</Label>
              <SectionTitle tone="gold">Curated Work.</SectionTitle>
            </div>
          </WorkTop>
          <ShowcaseWrap 
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            <ShowcaseStage>
              <video
                ref={videoRef}
                key={videos[activeIdx].src}
                src={videos[activeIdx].src}
                muted
                loop
                playsInline
                autoPlay
                controls
              />
              <ShowcaseVignette />
              <ShowcaseOverlay />
              <ShowcaseProgress style={{ width: `${progressWidth}%`, transition: isPaused ? 'none' : 'width 8000ms linear' }} />
              <ShowcaseInfo>
                <div /> {/* Spacer */}
                <ShowcaseCounter>
                  {String(activeIdx + 1).padStart(2, "0")} / {String(videos.length).padStart(2, "0")}
                </ShowcaseCounter>
              </ShowcaseInfo>
              <ShowcaseNav side="left" onClick={() => goTo(activeIdx - 1)} aria-label="Previous">
                <ChevronLeft aria-hidden="true" />
              </ShowcaseNav>
              <ShowcaseNav side="right" onClick={() => goTo(activeIdx + 1)} aria-label="Next">
                <ChevronRight aria-hidden="true" />
              </ShowcaseNav>
            </ShowcaseStage>

            <ShowcaseTitleBelow>{videos[activeIdx].label}</ShowcaseTitleBelow>

            <Filmstrip>
              {videos.map((video, i) => (
                <FilmThumb
                  key={video.src}
                  className={i === activeIdx ? "active" : ""}
                  onClick={() => goTo(i)}
                  aria-label={video.label}
                >
                  <video src={video.src} muted preload="metadata" />
                </FilmThumb>
              ))}
            </Filmstrip>
          </ShowcaseWrap>
        </Inner>
      </WorkSection>

      <ContactSection id="contact">
        <Inner>
          <ContactIntro>
            <Label>Reach Me Out</Label>
            <SectionTitle tone="gold">Hit me up.</SectionTitle>
            <Lead>
              Got a project in mind? A story to tell? Let's talk cuts, color, and creativity.
            </Lead>
          </ContactIntro>

          <ContactGrid>
            {contactCards.map(({ title, handle, text, icon: Icon, tone, href }) => (
              <ContactCard key={title} href={href} target="_blank" rel="noreferrer">
                <ContactIcon tone={tone}>
                  <Icon aria-hidden="true" />
                </ContactIcon>
                <ContactCopy>
                  <CardTitle>{title}</CardTitle>
                  <ContactHandle>{handle}</ContactHandle>
                  <CardText>{text}</CardText>
                </ContactCopy>
              </ContactCard>
            ))}
          </ContactGrid>

          <Availability>
            Currently available for new projects - response time within 24 hours.
          </Availability>
        </Inner>
      </ContactSection>

      <Footer>
        <Inner>
          <Brand>ADyFolio</Brand>
          <Copyright>© 2026 ADy · Video Editor · All Rights Reserved</Copyright>
          <FooterLinks aria-label="Footer links">
            <a href="#top">Back to Top</a>
            <a href="#contact">Privacy</a>
          </FooterLinks>
        </Inner>
      </Footer>
    </AppShell>
  );
}

createRoot(document.getElementById("root")).render(<Portfolio />);
