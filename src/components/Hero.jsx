import { heroStyles as s } from "../assets/dummyStyles";
import { getMatchValue, getTeamLogo } from "../services/footballApi";
import { ArrowRight, Loader2 } from "lucide-react";
const HERO_VIDEO_URL =
  "https://res.cloudinary.com/difec9hcv/video/upload/v1781251693/kling_20260612_Image_to_Video__870_0_ws177m.mp4";

const teamNamePaths = {
  home: ["home.name", "homeTeam.name", "teams.home.name", "homeTeam", "home"],
  away: ["away.name", "awayTeam.name", "teams.away.name", "awayTeam", "away"],
};

export function RealTeamBadge({ logo, name, featured }) {
  return (
    <div
      className={`${s.badgeBase} ${
        featured ? s.badgeFeatured : s.badgeDefault
      }`}
    >
      {logo ? (
        <img src={logo} alt={`${name} logo`} className={s.badgeLogo} />
      ) : (
        <span
          className={
            featured ? s.badgeFallbackFeatured : s.badgeFallbackDefault
          }
        >
          {name.slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
}

const MatchRow = ({ match, featured = false }) => {
  if (!match) return null;

  const home = getMatchValue(match, teamNamePaths.home);
  const away = getMatchValue(match, teamNamePaths.away);
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const matchDate = getMatchValue(
    match,
    ["time", "status.long", "status", "date"],
    "Upcoming",
  );

  return (
    <div className={featured ? s.matchRowFeatured : s.matchRowDefault}>
      {!featured && <p className={s.matchDate}>{matchDate}</p>}

      <div className="flex items-center justify-between gap-2">
        <div className={s.teamColumn}>
          <RealTeamBadge logo={homeLogo} name={home} featured={featured} />
          <span
            className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}
          >
            {home}
          </span>
        </div>
        <span
          className={`${s.vsBase} ${featured ? s.vsFeatured : s.vsDefault}`}
        >
          vs
        </span>
        <div className={s.teamColumn}>
          <RealTeamBadge logo={awayLogo} name={away} featured={featured} />
          <span
            className={`${s.teamNameBase} ${featured ? s.teamNameFeatured : s.teamNameDefault}`}
          >
            {away}
          </span>
        </div>
        {!featured && (
          <button className={s.matchButton}>
            <ArrowRight size={14} />
          </button>
        )}
      </div>
    </div>
  );
};

const Stat = ({ value, label, loading }) => (
  <div className="min-w-0">
    <p className={s.statValue}>
      {loading ? <Loader2 className="size-8 animate-ping" /> : value}
    </p>
    <p className={s.statLabel}>{label}</p>
  </div>
);

export const Hero = ({ matches, matchs = [], loading = false }) => {
  const displayMatches = Array.isArray(matches)
    ? matches
    : Array.isArray(matchs)
      ? matchs
      : [];
  const featuredMatch = displayMatches[0];

  return (
    <section className={s.section} id="top">
      <div className={s.innerBg}>
        <video
          aria-hidden="true"
          autoPlay
          loop
          muted
          playsInline
          className={s.heroVideo}
        >
          <source src={HERO_VIDEO_URL} type="video/mp4" />
        </video>

        <div className={s.overlayGradient} />

        <div className={s.gridContainer}>
          <aside className={s.statsAside}>
            <Stat value="8.4" label="Match Rating" loading={loading} />
            <Stat value="$9.57" label="Market Value" loading={loading} />
            <Stat value="97%" label="Pass Accuracy" loading={loading} />
          </aside>
          <div className={s.headingWrapper}>
            <h1 className={s.heading}>
              Lucas <br /> Moretti
            </h1>
          </div>
          <aside className={s.rightPanel}>
            {featuredMatch ? (
              <div className={s.featuredMatchCard}>
                <div className={s.featuredMatchHeader}>
                  <p className={s.featuredMatchHeaderText}>
                    Featured
                    <br />
                    Match
                  </p>
                  <span aria-hidden="true" className={s.featuredMatchButton}>
                    <ArrowRight size={17} />
                  </span>
                </div>
                <MatchRow match={featuredMatch} featured />
              </div>
            ) : (
              <div className={s.emptyState}>
                {loading ? (
                  <Loader2 className="mx-auto size-6 animate-ping" />
                ) : (
                  "No matches available"
                )}
              </div>
            )}
            {displayMatches.length > 1 && (
              <div className={s.moreMatchesRow}>
                <p className={s.moreMatchesLabel}>
                  More <br /> Matches
                </p>
                <button className={s.moreMatchesButton}>
                  <ArrowRight size={14} />
                </button>
              </div>
            )}
            <div className={s.remainingMatchesGrid}>{}</div>
          </aside>
        </div>
      </div>
    </section>
  );
};
