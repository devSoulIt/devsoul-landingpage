const PRIMARY = "#BDF61D";

// Top del día. `large` es la versión para la pantalla del stand.
export default function RankingList({ rows, large = false }) {
  if (!rows?.length) {
    return <p className={`text-center text-zinc-500 ${large ? "text-2xl mt-10" : "text-sm mt-8"}`}>Todavía no hay puntajes hoy. ¡Sé el primero!</p>;
  }
  return (
    <div className={large ? "" : "mt-8"}>
      {!large && <p className="text-xs uppercase tracking-widest text-zinc-500 mb-3">Ranking de hoy</p>}
      <ol className={large ? "space-y-3" : "space-y-2"}>
        {rows.map((r) => (
          <li
            key={r.position}
            className={`flex items-center gap-4 rounded-xl border ${large ? "px-6 py-4" : "px-4 py-3"} ${r.me ? "border-[rgba(77,124,15,0.5)]" : "border-zinc-200 bg-white"}`}
            style={r.me ? { backgroundColor: "rgba(189,246,29,0.25)" } : undefined}
          >
            <span
              className={`flex-shrink-0 rounded-lg flex items-center justify-center font-black ${large ? "w-12 h-12 text-xl" : "w-8 h-8 text-sm"}`}
              style={r.position <= 3 ? { backgroundColor: PRIMARY, color: "#080808" } : { backgroundColor: "#F4F4F5", color: "#52525B" }}
            >
              {r.position}
            </span>
            <span className={`flex-1 min-w-0 truncate font-semibold ${large ? "text-2xl" : "text-sm"}`}>
              {r.name}
              {r.me && " (vos)"}
            </span>
            <span className={`font-black ${large ? "text-3xl" : "text-lg"}`}>{r.floors}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
