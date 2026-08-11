import HeroBanner from "@/components/home/HeroBanner";
import YourPicksCard from "@/components/home/YourPicksCard";
import YourResultsCard from "@/components/home/YourResultsCard";
import LeaderboardCard from "@/components/home/LeaderboardCard";
import LastWeekTop10Card from "@/components/home/LastWeekTop10Card";

import { getDashboard } from "@/lib/dashboard";

export default async function HomePage() {
  const dashboard = await getDashboard();

  return (
    <main className="space-y-8">
      <HeroBanner
        weekNumber={dashboard.hero.weekNumber}
        deadline={dashboard.hero.deadline}
        gameCount={dashboard.hero.gameCount}
      />

      <section className="grid gap-8 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="space-y-8">
          <YourPicksCard games={dashboard.games} />

          <YourResultsCard />
        </div>

        <aside className="space-y-8">
          <LeaderboardCard players={dashboard.leaderboard} />

          <LastWeekTop10Card
            weekNumber={dashboard.lastWeekTop10.weekNumber}
            players={dashboard.lastWeekTop10.players}
          />
        </aside>
      </section>
    </main>
  );
}