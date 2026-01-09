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

      <section className="landing-page-hero padd-duo-60-30-and-16-12">
        <div className="landing-page-hero-container">
          <div className="landing-page-hero-grid">
            <div className="landing-page-hero-content">
              <div className="landing-page-badge padd-duo-4-8-and-16-12 font-12-16">
                <Sparkles size={16} className="icon-12-16" />
                <span>Collaboration made simple</span>
              </div>

              <h1 className="landing-page-title font-56-25">
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

              <p className="landing-page-description font-14-18">
                BuddySpace brings your team together in one place. Create
                workspaces, chat in real-time, and build collections that
                everyone can enjoy.
              </p>

              <div className="landing-page-cta-group">
                <button
                  className="landing-page-btn landing-page-btn-hero mar-t-20-40 padd-duo-10-14-and-14-28 font-12-16"
                  onClick={() => navigate("/signup")}
                >
                  Get Started Free
                  <ArrowRight size={20} className="icon-14-20" />
                </button>

                <button
                  className="landing-page-btn landing-page-btn-outline padd-duo-7-15-and-20-40"
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

      <section className="landing-page-features padd-duo-60-30-and-16-12">
        <div className="landing-page-features-container">
          <div className="landing-page-features-header mar-b-32-64">
            <h2 className="font-15-20">Everything you need to collaborate</h2>
            <p className="font-12-16">
              BuddySpace gives you all the tools to work together, share ideas,
              and build collections as a team.
            </p>
          </div>

          <div className="landing-page-features-grid">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="landing-page-feature-card padd-14-32"
              >
                <div className="landing-page-feature-icon icon-24-56 mar-b-14-20">
                  <feature.icon size={28} className="icon-14-20" />
                </div>
                <h3 className="font-15-20">{feature.title}</h3>
                <p className="font-12-16">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="landing-page-cta">
        <div className="landing-page-cta-container">
          <h2 style={{ marginBottom: "3px" }} className="font-15-20">
            Ready to bring your team together?
          </h2>
          <p className="font-12-16">
            Join thousands of teams already using BuddySpace to collaborate
            better.
          </p>
          <button
            className="landing-page-btn landing-page-btn-hero mar-t-20-40 padd-duo-10-14-and-14-28 font-12-16"
            onClick={() => navigate("/signup")}
          >
            Start for Free
            <ArrowRight size={20} />
          </button>
        </div>
      </section>

      <footer className="landing-page-footer">
        <p className="font-12-16">
          © {new Date().getFullYear()} BuddySpace. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default LandingPage;
