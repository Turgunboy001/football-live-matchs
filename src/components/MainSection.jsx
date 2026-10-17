import {
  Fixtures,
  LiveScores,
  MatchCenter,
  MatchDetailsPanel,
  Standings,
} from "./MainSectionParts";
import { getMatchLocation, getTeams, venuePaths } from "./MainSectionUtiles";
import {
  fetchFixturesByDate,
  formatFootballDate,
  getMatchEventId,
  getMatchStatus,
  getMatchValue,
  hasFootballApiKey,
  loadFootballDashboard,
} from "../services/footballApi";
import { mainSectionStyles as s } from "../assets/dummyStyles";
import { useEffect, useMemo, useState } from "react";
import { useRef } from "react";
import { Hero } from "./Hero";

const MainSection = () => {
  const [data, setData] = useState({ live: [], leagues: [], fixtures: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dateOffset, setDateOffset] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [fixturesLoading, setFixturesLoading] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("Venue TBC");
  const isFirstMount = useRef(true);

  useEffect(() => {
    const loadFootball = async () => {
      if (!hasFootballApiKey) {
        setError(
          "Missing VITE_RAPIDAPI_KEY. Add it to .env.local and restart Vite.",
        );
        setLoading(false);
        return;
      }
      try {
        const result = await loadFootballDashboard();
        setData(result.data);
        if (result.hasPartialFailure) {
          setError(
            "Some API sections could not load. Check your key or quota.",
          );
        }
      } catch (error) {
        setError(
          "Could not load API data. Check your network and RapidAPI setup.",
        );
      } finally {
        setLoading(false);
      }
    };
    loadFootball();
  }, []);

  useEffect(() => {
    if (isFirstMount.current) {
      isFirstMount.current = false;
      return;
    }
    const updateFixtures = async () => {
      setFixturesLoading(true);
      const fixtures = await fetchFixturesByDate(
        formatFootballDate(dateOffset),
      );
      setData((prev) => ({ ...prev, fixtures }));
      setFixturesLoading(false);
    };
    if (hasFootballApiKey) updateFixtures();
  }, [dateOffset]);

  useEffect(() => {
    if (!selectedMatch) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === "Escape") setSelectedMatch(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [selectedMatch]);

  useEffect(() => {
    if (!selectedMatch?.match) return undefined;
    const eventId = getMatchEventId(selectedMatch.match);
    if (!eventId) return undefined;
    let active = true;
    const fallBackVenue = getMatchValue(
      selectedMatch.match,
      venuePaths,
      "Venue TBC",
    );
    getMatchLocation(eventId, fallBackVenue, () => active).then((location) => {
      if (location) setSelectedLocation(location);
    });

    return () => {
      active = false;
    };
  }, [selectedMatch]);

  const openMatchDetails = (match, statusLabel = getMatchStatus(match)) => {
    const fallbackVenue = getMatchValue(match, venuePaths, "Venue TBC");
    setSelectedLocation(
      getMatchEventId(match) ? "Loading location" : fallbackVenue,
    );
    setSelectedMatch({ match, statusLabel });
  };

  const closeMatchDetails = () => {
    setSelectedMatch(null);
    setSelectedLocation("Venue TBC");
  };

  const empty = (text, isLoading = loading) => (
    <div className={s.emptyBase}>
      {isLoading ? "Loading fresh football data..." : text}
    </div>
  );
  const matchcenterItems = useMemo(
    () => [...data.live, ...data.fixtures].slice(0, 5),
    [data.live, data.fixtures],
  );

  const filteredFixtures = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return data.fixtures;

    return data.fixtures.filter((match) =>
      Object.values(getTeams(match)).some((team) =>
        String(team ?? "").toLowerCase().includes(query),
      ),
    );
  }, [data.fixtures, searchQuery]);

  return (
    <>
      <Hero matches={matchcenterItems} loading={loading} />
      <main className={s.mainContainer}>
        <div className={s.glowLeft} />
        <div className={s.glowRight} />
        <div className={s.innerWrapper}>
          {error && <div className={s.errorBanner}>{error}</div>}
          <MatchCenter
            matches={data.live}
            loading={loading}
            onViewMatch={openMatchDetails}
          />
          <LiveScores matches={data.live} loading={loading} empty={empty} />
          <Standings leagues={data.leagues} loading={loading} empty={empty} />
          <Fixtures
            dateOffset={dateOffset}
            fixtures={filteredFixtures}
            loading={fixturesLoading}
            searchQuery={searchQuery}
            setDateOffset={setDateOffset}
            setSearchQuery={setSearchQuery}
            onViewMatch={openMatchDetails}
            empty={empty}
          />
        </div>
      </main>
      <MatchDetailsPanel
        selection={selectedMatch}
        location={selectedLocation}
        onClose={closeMatchDetails}
      />
    </>
  );
};

export default MainSection;
