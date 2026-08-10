export default function ActivityCard() {
  const activities = [
    "Players are submitting weekly picks.",
    "Scores update automatically after games finish.",
    "Season standings update every week.",
  ];


  return (
    <section className="overflow-hidden rounded-3xl bg-white shadow-lg">


      <div className="bg-green-900 px-6 py-6 text-white">


        <h2 className="text-xl font-black">
          Recent Activity
        </h2>


        <p className="mt-1 text-sm text-green-200">
          Contest updates
        </p>


      </div>




      <div className="space-y-3 p-6">


        {activities.map((activity) => (

          <div
            key={activity}
            className="flex items-start gap-3 rounded-2xl bg-slate-50 p-4"
          >


            <div className="mt-1 h-2 w-2 rounded-full bg-green-900" />


            <p className="text-sm font-semibold text-slate-600">
              {activity}
            </p>


          </div>


        ))}



      </div>



    </section>
  );
}