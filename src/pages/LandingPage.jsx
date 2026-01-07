import { useNavigate } from "react-router-dom";
import "../assets/style/LandingPage.css";
import {
  MessageCircle,
  Users,
  Library,
  ArrowRight,
  Sparkles,
  Sun,
  Moon,
} from "lucide-react";
import { IMAGES } from "../services/Constants";
import { useTheme } from "../context/ThemeContext";

const features = [
  {
    icon: Users,
    title: "Shared Workspaces",
    description:
      "Create spaces for your team, friends, or community to collaborate together.",
  },
  {
    icon: MessageCircle,
    title: "Group Chat",
    description:
      "Real-time messaging with everyone in your workspace. Stay connected always.",
  },
  {
    icon: Library,
    title: "Collections with Comments",
    description:
      "Save and organize content. Add comments and discuss with your group.",
  },
];

const LandingPage = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="landing-page-root">
      <nav className="landing-page-navbar">
        <div className="landing-page-navbar-container">
          <div className="landing-page-navbar-logo">
            <img src={IMAGES.SiteLogo} alt="" />
            <h3>
              Buddy
              <span>Space</span>
            </h3>
          </div>
          <div className="landing-page-navbar-actions">
            <button
              className="landing-page-btn landing-page-btn-primary"
              onClick={() => navigate("/signin")}
            >
              Get Started
            </button>
            <button
              className="landing-page-btn landing-page-btn-theme"
              onClick={toggleTheme}
            >
              {theme === "light" ? <Sun size={18} /> : <Moon size={18} />}
            </button>
          </div>
        </div>
      </nav>

      <section className="landing-page-hero">
        <div className="landing-page-hero-container">
          <div className="landing-page-hero-grid">
            <div className="landing-page-hero-content">
              <div className="landing-page-badge">
                <Sparkles size={16} />
                <span>Collaboration made simple</span>
              </div>

              <h1 className="landing-page-title">
                Create shared spaces.
                <br />
                <span className="landing-page-highlight-primary"> Chat.</span>
                <span className="landing-page-highlight-secondary">
                  {" "}
                  Collect.
                </span>{" "}
                <br />
                Collaborate.
              </h1>

              <p className="landing-page-description">
                BuddySpace brings your team together in one place. Create
                workspaces, chat in real-time, and build collections that
                everyone can enjoy.
              </p>

              <div className="landing-page-cta-group">
                <button
                  className="landing-page-btn landing-page-btn-hero"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Free
                  <ArrowRight size={20} />
                </button>

                <button
                  className="landing-page-btn landing-page-btn-outline"
                  onClick={() => navigate("/signin")}
                >
                  Sign In
                </button>
              </div>
            </div>

            <div className="landing-page-hero-image-wrapper">
              <img
                src={IMAGES.heroIllustration}
                alt="People collaborating together"
                className="landing-page-hero-image"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="landing-page-features">
        <div className="landing-page-features-container">
          <div className="landing-page-features-header">
            <h2>Everything you need to collaborate</h2>
            <p>
              BuddySpace gives you all the tools to work together, share ideas,
              and build collections as a team.
            </p>
          </div>

          <div className="landing-page-features-grid">
            {features.map((feature) => (
              <div key={feature.title} className="landing-page-feature-card">
                <div className="landing-page-feature-icon">
                  <feature.icon size={28} />
                </div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-page-cta">
        <div className="landing-page-cta-container">
          <h2>Ready to bring your team together?</h2>
          <p>
            Join thousands of teams already using BuddySpace to collaborate
            better.
          </p>
          <button
            className="landing-page-btn landing-page-btn-hero"
            onClick={() => navigate("/signup")}
          >
            Start for Free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p>© {new Date().getFullYear()} BuddySpace. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LandingPage;
