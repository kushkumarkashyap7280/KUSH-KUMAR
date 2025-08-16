import { useRef } from "react";

const GlowCard = ({ children }) => {
  // single ref for this card instance
  const cardRef = useRef(null);

  // when mouse moves over a card, rotate the glow effect
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;

    // get the mouse position relative to the card
    const rect = card.getBoundingClientRect();
    const mouseX = e.clientX - rect.left - rect.width / 2;
    const mouseY = e.clientY - rect.top - rect.height / 2;

    // calculate the angle from the center of the card to the mouse
    let angle = Math.atan2(mouseY, mouseX) * (180 / Math.PI);

    // adjust the angle so that it's between 0 and 360
    angle = (angle + 360) % 360;

    // set the angle as a CSS variable
    card.style.setProperty("--start", angle + 60);
  };

  // return the card component with the mouse move event
  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      className="card card-border timeline-card rounded-xl p-10 mb-5 break-inside-avoid-column"
    >
      <div className="glow"></div>
      {children}
    </div>
  );
};

export default GlowCard;
