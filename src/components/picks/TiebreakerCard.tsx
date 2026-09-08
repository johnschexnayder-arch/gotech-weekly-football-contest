type TiebreakerCardProps = {
  awayTeam: string;
  homeTeam: string;
  winner?: string;
  totalPoints?: string;
  homePoints?: string;
  onWinnerChange: (team: string) => void;
  onTotalPointsChange: (score: string) => void;
  onHomePointsChange: (score: string) => void;
  disabled?: boolean;
};

export default function TiebreakerCard({
  awayTeam,
  homeTeam,
  winner = "",
  totalPoints = "",
  homePoints = "",
  onWinnerChange,
  onTotalPointsChange,
  onHomePointsChange,
  disabled = false,
}: TiebreakerCardProps) {
  const buttonClasses = (team: string) =>
    winner === team
      ? `
        rounded-xl
        border-2
        border-yellow-400
        bg-gradient-to-r
        from-yellow-400
        to-yellow-600
        px-6
        py-3
        text-sm
        font-black
        uppercase
        text-green-950
        shadow-lg
      `
      : `
        rounded-xl
        border
        border-green-900
        px-6
        py-3
        text-sm
        font-black
        uppercase
        text-green-900
        transition
        hover:bg-green-900
        hover:text-white
      `;

  return (
    <section className="overflow-hidden rounded-3xl border border-yellow-500/20 bg-white shadow-xl">
      <div className="bg-gradient-to-r from-green-950 via-green-900 to-green-800 px-6 py-5 text-white">
        <h2 className="text-xl font-black tracking-tight">
          🏆 Tiebreaker Challenge
        </h2>

        <p className="mt-1 text-sm font-medium text-yellow-200">
          Predict the total points and home-team points
        </p>
      </div>

      <div className="space-y-6 p-6">
        <div className="rounded-2xl border-2 border-red-200 bg-red-50 p-4">
          <p className="text-sm leading-6 text-red-700">
            <span className="font-black uppercase">
              Important:
            </span>{" "}
            Total Points means the{" "}
            <span className="font-black">
              combined score of BOTH teams
            </span>
            , NOT the away team&apos;s score.
          </p>

          <p className="mt-1 text-xs font-bold text-red-600">
            Please enter your tiebreaker predictions carefully.
          </p>
        </div>

        <div>
          <div className="mb-3 text-sm font-black uppercase tracking-wide text-green-700">
            Who wins?
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              disabled={disabled}
              onClick={() => onWinnerChange(awayTeam)}
              className={buttonClasses(awayTeam)}
            >
              {awayTeam}
            </button>

            <button
              type="button"
              disabled={disabled}
              onClick={() => onWinnerChange(homeTeam)}
              className={buttonClasses(homeTeam)}
            >
              {homeTeam}
            </button>
          </div>
        </div>

        <div>
          <div className="mb-3 text-sm font-black uppercase tracking-wide text-green-700">
            Predict the Points
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="text-sm font-black text-red-600">
                Total Points — Both Teams Combined
              </label>

              <p className="mt-1 text-xs font-semibold leading-5 text-red-600">
                Enter the combined points scored by BOTH teams.
              </p>

              <input
                type="number"
                min="0"
                value={totalPoints}
                disabled={disabled}
                onChange={(e) =>
                  onTotalPointsChange(e.target.value)
                }
                placeholder="61"
                className="mt-2 w-full rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 text-center text-xl font-black text-green-950 outline-none transition focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="text-sm font-black text-slate-700">
                Home Team Points
              </label>

              <p className="mt-1 text-xs font-semibold leading-5 text-red-600">
                Enter the points scored by the HOME team only.
              </p>

              <input
                type="number"
                min="0"
                value={homePoints}
                disabled={disabled}
                onChange={(e) =>
                  onHomePointsChange(e.target.value)
                }
                placeholder="51"
                className="mt-2 w-full rounded-xl border-2 border-green-100 bg-green-50 px-4 py-3 text-center text-xl font-black text-green-950 outline-none transition focus:border-yellow-400"
              />
            </div>
          </div>

          <div className="mt-4 rounded-xl bg-slate-50 p-4 text-sm font-semibold text-slate-700">
            <span className="font-black text-green-950">
              Example:
            </span>{" "}
            If the final score is 51–10, enter{" "}
            <span className="font-black text-green-950">
              Total Points = 61
            </span>{" "}
            and{" "}
            <span className="font-black text-green-950">
              Home Team Points = 51
            </span>
            .
          </div>
        </div>

        <div className="rounded-2xl border border-yellow-400/30 bg-gradient-to-r from-green-50 to-yellow-50 p-5 text-sm font-semibold text-green-950">
          <div className="mb-2 font-black uppercase tracking-wide text-green-800">
            Tiebreaker Rules
          </div>

          1. Correct tiebreaker game winner
          <br />
          2. Closest to total points scored
          <br />
          3. Closest to home team&apos;s points
          <br />
          4. Previous week&apos;s tiebreaker if still tied
        </div>
      </div>
    </section>
  );
}
