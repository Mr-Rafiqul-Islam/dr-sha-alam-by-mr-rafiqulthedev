import ScrollReveal from '@/components/ScrollReveal';
import {
  faqCategories,
  getFaqsForCategory,
  searchFaqs,
  type FAQAnswer,
  type FAQSearchResult,
} from '@/components/faq/faqData';

function FAQAnswerContent({ answer }: { answer: FAQAnswer }) {
  const hasBullets = answer.bullets && answer.bullets.length > 0;
  const [intro, ...rest] = answer.paragraphs;

  return (
    <>
      {hasBullets && answer.paragraphs.length > 1 ? (
        <>
          <p>{intro}</p>
          <ul className="space-y-2 pt-1">
            {answer.bullets!.map((item) => (
              <li key={item} className="flex items-start gap-2">
                <span className="text-accent mt-0.5 shrink-0">✔</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>
          {rest.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </>
      ) : (
        <>
          {answer.paragraphs.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
          {hasBullets && (
            <ul className="space-y-2 pt-1">
              {answer.bullets!.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-accent mt-0.5 shrink-0">✔</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}

type FAQListProps = {
  activeCategoryId: string;
  searchQuery: string;
};

export default function FAQList({ activeCategoryId, searchQuery }: FAQListProps) {
  const isSearching = searchQuery.trim().length > 0;
  const activeCategory =
    faqCategories.find((category) => category.id === activeCategoryId) ??
    faqCategories[0];

  const displayedFaqs: FAQSearchResult[] = isSearching
    ? searchFaqs(searchQuery)
    : getFaqsForCategory(activeCategoryId);

  const heading = isSearching
    ? `Search Results (${displayedFaqs.length})`
    : activeCategory.name;

  return (
    <section className="py-12 md:py-24 bg-background-light dark:bg-background-dark min-h-[600px]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <ScrollReveal direction="up" className="text-center mb-8">
          <h2 className="text-2xl md:text-3xl font-extrabold text-primary dark:text-white">
            {heading}
          </h2>
          {isSearching && (
            <p className="text-text-sub text-sm mt-2">
              Showing matches for &quot;{searchQuery.trim()}&quot; across all categories
            </p>
          )}
        </ScrollReveal>

        {displayedFaqs.length === 0 ? (
          <ScrollReveal direction="up">
            <div className="bg-white dark:bg-surface-dark rounded-2xl p-8 text-center border border-gray-100 dark:border-gray-800">
              <p className="text-text-main dark:text-white font-semibold mb-2">
                No matching questions found
              </p>
              <p className="text-text-sub text-sm">
                Try a different keyword such as PLID, sciatica, surgery, yoga, or appointment.
              </p>
            </div>
          </ScrollReveal>
        ) : (
          displayedFaqs.map((faq, index) => (
            <ScrollReveal
              key={`${faq.categoryId}-${faq.question}`}
              direction="up"
              delay={index * 0.05}
            >
              <details className="group bg-white dark:bg-surface-dark rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-800 hover:shadow-md transition-all duration-300 open:ring-2 open:ring-primary/20">
                <summary className="flex justify-between items-center gap-4 cursor-pointer font-bold text-lg text-text-main dark:text-white">
                  <span className="text-left">
                    {isSearching && (
                      <span className="block text-xs font-semibold uppercase tracking-wide text-accent mb-1">
                        {faq.categoryName}
                      </span>
                    )}
                    {faq.question}
                  </span>
                  <span className="material-symbols-outlined text-gray-400 group-open:text-primary group-open:rotate-180 transition-transform duration-300 shrink-0">
                    expand_more
                  </span>
                </summary>
                <div className="mt-4 text-text-sub dark:text-gray-300 leading-relaxed space-y-4">
                  <FAQAnswerContent answer={faq.answer} />
                </div>
              </details>
            </ScrollReveal>
          ))
        )}
      </div>
    </section>
  );
}
