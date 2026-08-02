import { useEffect, useRef, useState } from "react";

export function CustomCursor() {
  const outerRef = useRef<HTMLDivElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [hovering, setHovering] = useState(false);

  useEffect(() => {
    // Skip on touch devices
    if (typeof window === "undefined") return;
    const isFine = window.matchMedia("(pointer: fine)").matches;
    if (!isFine) return;
    setEnabled(true);

    const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
    const outer = { x: mouse.x, y: mouse.y };
    let raf = 0;
    let visible = false;

    const onMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      if (!visible) {
        visible = true;
        if (outerRef.current) outerRef.current.style.opacity = "1";
        if (innerRef.current) innerRef.current.style.opacity = "1";
      }
      // Inner dot follows instantly
      if (innerRef.current) {
        innerRef.current.style.transform = `translate3d(${mouse.x}px, ${mouse.y}px, 0) translate(-50%, -50%)`;
      }
    };

    const onLeave = () => {
      visible = false;
      if (outerRef.current) outerRef.current.style.opacity = "0";
      if (innerRef.current) innerRef.current.style.opacity = "0";
    };

    const onDown = () => {
      if (outerRef.current) outerRef.current.style.transform += " scale(0.85)";
    };

    const isInteractive = (el: Element | null) =>
      !!el?.closest("a, button, input, textarea, select, [role='button'], label, summary");

    const onOver = (e: MouseEvent) => setHovering(isInteractive(e.target as Element));

    const tick = () => {
      // Ease outer ring toward mouse
      outer.x += (mouse.x - outer.x) * 0.18;
      outer.y += (mouse.y - outer.y) * 0.18;
      if (outerRef.current) {
        outerRef.current.style.transform = `translate3d(${outer.x}px, ${outer.y}px, 0) translate(-50%, -50%)`;
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", onMove);
    window.addEventListener("mouseover", onOver);
    window.addEventListener("mouseout", (e) => {
      if (!e.relatedTarget) onLeave();
    });
    window.addEventListener("mousedown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseover", onOver);
      window.removeEventListener("mousedown", onDown);
    };
  }, []);

  if (!enabled) return null;

  return (
    <>
      <div
        ref={outerRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] h-10 w-10 rounded-full border transition-[width,height,border-color,background-color,opacity] duration-200 ease-out ${
          hovering
            ? "h-14 w-14 border-accent bg-accent/10 backdrop-blur-[2px]"
            : "border-primary/70"
        }`}
        style={{
          opacity: 0,
          boxShadow: "0 0 20px rgba(0,191,255,.35), inset 0 0 8px rgba(0,191,255,.25)",
          mixBlendMode: "screen",
        }}
      />
      <div
        ref={innerRef}
        aria-hidden
        className={`pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-primary transition-[width,height,opacity] duration-150 ease-out ${
          hovering ? "h-1 w-1 opacity-70" : "h-2 w-2"
        }`}
        style={{
          opacity: 0,
          boxShadow: "0 0 10px rgba(25,211,255,.9)",
        }}
      />
    </>
  );
}
