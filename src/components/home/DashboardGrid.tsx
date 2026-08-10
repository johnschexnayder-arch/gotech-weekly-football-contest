type DashboardGridProps = {
  hero: React.ReactNode;
  picks: React.ReactNode;
  standings: React.ReactNode;
  trends: React.ReactNode;
  activity: React.ReactNode;
  tiebreaker: React.ReactNode;
};

export default function DashboardGrid({
  hero,
  picks,
  standings,
  trends,
  activity,
  tiebreaker,
}: DashboardGridProps) {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">

      <div className="space-y-6">

        {hero}

        {picks}

        {tiebreaker}

      </div>


      <div className="space-y-6">

        {standings}

        {trends}

        {activity}

      </div>


    </div>
  );
}