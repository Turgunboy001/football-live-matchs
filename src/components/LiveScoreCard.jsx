import React from "react";
import { liveScoreCardStyles as s } from "../assets/dummyStyles";
import {
  getMatchLeague,
  getMatchStatus,
  getMatchValue,
  getTeamLogo,
  scorePaths,
} from "../services/footballApi";
const teamPath = {
  home: ["home-name", "homeTema.name", "teams.home.name", "homeTeam", "home"],
  away: ["away-name", "awayTema.name", "teams.away.name", "awayTeam", "away"],
};

const TeamLogo = ({ logo, name }) => {
  return (
    <div className={s.teamLogoContainer}>
      {logo ? (
        <img src={logo} alt={name || "Team logo"} className={s.teamLogoImg} />
      ) : (
        <span className="text-[9px] font-black uppercase tracking-wide">
          {(name || "T").slice(0, 3).toUpperCase()}
        </span>
      )}
    </div>
  );
};

const LiveScoreCard = ({ match }) => {
  const homeTeam = getMatchValue(match, teamPath.home, "Home");
  const awayTeam = getMatchValue(match, teamPath.away, "Away");
  const homeLogo = getTeamLogo(match, "home");
  const awayLogo = getTeamLogo(match, "away");
  const homeScore = getMatchValue(match, scorePaths.home, "0");
  const awayScore = getMatchValue(match, scorePaths.away, "0");
  const league = getMatchLeague(match);
  const matchStatus = getMatchStatus(match);
  const statusLabel =
    matchStatus === "live" || matchStatus === "Live" ? "LIVE" : "FULL TIME";

  return (
    <article className={s.card}>
      <div className={s.glowRed} />
      <div className={s.glowBlue} />

      <div className="relative z-10 flex flex-col gap-3">
        <div className="flex items-center justify-between gap-3">
          <p className={s.leagueText}>{league }</p>
          <div className={s.liveBadge}>
            <span className={s.liveDot} />
            <span className={s.liveText}>{statusLabel}</span>
          </div>
        </div>

        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamLogo logo={homeLogo} name={homeTeam} />
            <p className={s.teamName}>{homeTeam}</p>
          </div>

          <div className="flex items-center justify-center gap-2 rounded-xl bg-white/10 px-3 py-2 sm:px-4">
            <span className={s.scoreText}>{homeScore}</span>
            <span className={s.colon}>:</span>
            <span className={s.scoreText}>{awayScore}</span>
          </div>

          <div className="flex min-w-0 flex-col items-center gap-2 text-center">
            <TeamLogo logo={awayLogo} name={awayTeam} />
            <p className={s.teamName}>{awayTeam}</p>
          </div>
        </div>

        <div className={s.divider} />
        <p className={s.footerText}>FULL TIME • MATCH DAY</p>
      </div>
    </article>
  );
};

export default LiveScoreCard;
