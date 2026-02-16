"use client";

import Link from "next/link";
import { useEffect } from "react";
import "./categories.css";

const CATEGORIES = [
  { id: "school", label: "School", descriptor: "Finding clarity in your academic path.", href: "/reframe?category=school" },
  { id: "internships", label: "Internships", descriptor: "Breaking into your next opportunity.", href: "/reframe?category=internships" },
  { id: "career", label: "Career", descriptor: "Repositioning where you're headed.", href: "/reframe?category=career" },
  { id: "life", label: "Life / Adulting", descriptor: "Balancing growth with real life.", href: "/reframe?category=life" },
];

export default function CategoriesPage() {
  useEffect(() => {
    const elements = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
          }
        });
      },
      { threshold: 0.2 }
    );
    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div className="categories-screen">
      <div className="categories-bg" aria-hidden />
      <div className="categories-overlay" aria-hidden />

      <header className="categories-header">
        <Link href="/" className="categories-back" aria-label="Back to home">
          ← Back
        </Link>
      </header>

      <section className="categories">
        <div className="categories-title-block reveal">
          <p className="step-label">STEP 1 OF 3</p>
          <div className="step-progress">
            <div className="step-progress-fill step-progress-33" aria-hidden />
          </div>
          <h1 className="categories-title">What area are you navigating?</h1>
          <p className="categories-subtitle">Start where it feels most unclear.</p>
        </div>

        <div className="card-grid">
          {CATEGORIES.map((cat, i) => (
            <Link
              key={cat.id}
              href={cat.href}
              className="category-card reveal"
              style={{ transitionDelay: `${0.3 + i * 0.1}s` }}
            >
              <h3>{cat.label}</h3>
              <p>{cat.descriptor}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
