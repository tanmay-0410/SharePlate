import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const followerRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    const follower = followerRef.current;
    if (!dot || !follower) return;

    let mouseX = -9999;
    let mouseY = -9999;
    let fx = -9999;
    let fy = -9999;
    let rafId;

    const onMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.setProperty('--cx', `${mouseX}px`);
      dot.style.setProperty('--cy', `${mouseY}px`);
    };

    const loop = () => {
      // follower smoothly lerps towards mouse
      fx += (mouseX - fx) * 0.12;
      fy += (mouseY - fy) * 0.12;
      follower.style.setProperty('--fx', `${fx}px`);
      follower.style.setProperty('--fy', `${fy}px`);
      rafId = requestAnimationFrame(loop);
    };

    const enter = () => {
      dot.classList.add('custom-cursor--hover');
      follower.classList.add('custom-cursor--hover');
    };
    const leave = () => {
      dot.classList.remove('custom-cursor--hover');
      follower.classList.remove('custom-cursor--hover');
    };

    window.addEventListener('mousemove', onMove);
    rafId = requestAnimationFrame(loop);

    const hoverSelectors = 'a, button, input, textarea, select, label, [role="button"], .btn-primary, .btn-secondary';
    const attach = (el) => {
      if (el.__cc_attached) return;
      el.addEventListener('mouseenter', enter);
      el.addEventListener('mouseleave', leave);
      el.__cc_attached = true;
    };

    document.querySelectorAll(hoverSelectors).forEach(attach);
    const obs = new MutationObserver(() => document.querySelectorAll(hoverSelectors).forEach(attach));
    obs.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', onMove);
      cancelAnimationFrame(rafId);
      obs.disconnect();
      document.querySelectorAll(hoverSelectors).forEach((el) => {
        if (el.__cc_attached) {
          el.removeEventListener('mouseenter', enter);
          el.removeEventListener('mouseleave', leave);
          delete el.__cc_attached;
        }
      });
    };
  }, []);

  return (
    <>
      <div ref={followerRef} className="custom-cursor-follower" aria-hidden="true" />
      <div ref={dotRef} className="custom-cursor" aria-hidden="true" />
    </>
  );
}
