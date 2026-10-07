"use client";

const clients = [
  { mark: "N", name: "Northstar Labs" },
  { mark: "A", name: "Aster House" },
  { mark: "F", name: "Fieldnote" },
  { mark: "M", name: "Morrow" },
  { mark: "K", name: "Kiteworks" },
  { mark: "O", name: "Orbit Works" },
];

function ClientItem({ mark, name }: { mark: string; name: string }) {
  return (
    <div className="flex shrink-0 items-center gap-3 pr-10 md:pr-16">
      <div className="grid h-11 w-11 place-items-center rounded-full border border-[#D9DADD] bg-white font-sora text-[13px] font-bold text-[#040404]">
        {mark}
      </div>
      <span className="whitespace-nowrap font-sora text-[15px] font-semibold tracking-[-0.02em] text-[#343638] md:text-[17px]">
        {name}
      </span>
    </div>
  );
}

export function TrustedClients() {
  return (
    <section
      id="trusted-clients"
      className="px-4 py-10 md:px-8 md:py-14"
    >
      <div className="mx-auto max-w-[1440px] border-y border-[#E1E2E4] py-7 md:py-9">
        <div className="mb-6 flex flex-col gap-2 px-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="font-sora text-[11px] font-semibold uppercase tracking-[0.18em] text-[#818084]">
              Trusted clients
            </p>
            <h2 className="mt-1 font-sora text-[22px] font-bold tracking-[-0.03em] text-[#040404] md:text-[28px]">
              Teams we move with.
            </h2>
          </div>
          <p className="max-w-[360px] font-sora text-[11px] leading-relaxed text-[#818084]">
            Placeholder client identities for the prototype — replace with verified client logos before launch.
          </p>
        </div>

        <div className="client-marquee" aria-label="Placeholder client roster">
          <div className="client-marquee-track">
            {[...clients, ...clients].map((client, index) => (
              <ClientItem
                key={`${client.name}-${index}`}
                mark={client.mark}
                name={client.name}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
