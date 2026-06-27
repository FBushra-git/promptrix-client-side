import Link from "next/link";

export default function Pagination({
  currentPage,
  total,
  perPage,
  basePath,
  searchParams = {},
}) {
  const totalPages = Math.ceil(total / perPage);

  if (totalPages <= 1) return null;

  const createHref = (page) => {
    const params = new URLSearchParams();

    Object.entries(searchParams).forEach(([key, value]) => {
      if (key !== "page" && value) {
        params.set(key, value);
      }
    });

    params.set("page", page.toString());

    return `${basePath}?${params.toString()}`;
  };

  return (
    <div className="mt-10 flex justify-center">
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-white/[0.04] p-2">
        <Link
          href={createHref(Math.max(currentPage - 1, 1))}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            currentPage === 1
              ? "pointer-events-none bg-white/5 text-white/25"
              : "bg-[#121322] text-white hover:bg-[#967bb6]"
          }`}
        >
          Prev
        </Link>

        {Array.from({ length: totalPages }).map((_, index) => {
          const page = index + 1;

          return (
            <Link
              key={page}
              href={createHref(page)}
              className={`rounded-xl px-4 py-2 text-sm font-bold ${
                page === currentPage
                  ? "bg-[#967bb6] text-white"
                  : "bg-[#121322] text-white/60 hover:text-white"
              }`}
            >
              {page}
            </Link>
          );
        })}

        <Link
          href={createHref(Math.min(currentPage + 1, totalPages))}
          className={`rounded-xl px-4 py-2 text-sm font-bold ${
            currentPage === totalPages
              ? "pointer-events-none bg-white/5 text-white/25"
              : "bg-[#121322] text-white hover:bg-[#967bb6]"
          }`}
        >
          Next
        </Link>
      </div>
    </div>
  );
}