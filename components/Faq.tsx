export type FaqItem = {
  question: string;
  answer: string;
};

export default function Faq({
  items,
  heading,
}: {
  items: FaqItem[];
  heading: string;
}) {
  return (
    <section aria-labelledby="faq-heading" className="mt-16">
      <h2
        id="faq-heading"
        className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white"
      >
        {heading}
      </h2>
      <dl className="mt-6 space-y-6">
        {items.map((item) => (
          <div
            key={item.question}
            className="rounded-lg border border-zinc-200 bg-white p-5 dark:border-zinc-800 dark:bg-zinc-900"
          >
            <dt className="font-semibold text-zinc-900 dark:text-white">
              {item.question}
            </dt>
            <dd className="mt-2 text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
              {item.answer}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
