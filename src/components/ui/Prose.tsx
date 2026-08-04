import { PortableText, type PortableTextComponents } from 'next-sanity';
import type { PortableTextBlock } from 'next-sanity';
import Link from 'next/link';

/**
 * Long-form body copy from the CMS.
 *
 * Portable text elsewhere on the site is a couple of paragraphs and renders
 * fine with a `space-y` wrapper. A guide is a 1.500 word document with real
 * structure, so the block types are mapped explicitly: headings have to come
 * out as genuine h2/h3 in the markup, in order, because heading hierarchy is
 * how a search engine reads the outline of a page. Styling them with sized
 * paragraphs would look identical and mean nothing.
 *
 * Headings inherit the sitewide caps treatment from globals.css, so nothing
 * here sets case or weight.
 */
const components: PortableTextComponents = {
  block: {
    // h1 is never used: the page owns the single h1, and the body must not
    // introduce a second one.
    h2: ({ children }) => (
      <h2 className="mt-16 font-display text-2xl leading-tight text-navy md:text-3xl">
        {children}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-10 font-display text-xl leading-snug text-navy">
        {children}
      </h3>
    ),
    h4: ({ children }) => (
      <h4 className="mt-8 font-display text-lg leading-snug text-navy">
        {children}
      </h4>
    ),
    blockquote: ({ children }) => (
      <blockquote className="my-10 border-l-2 border-gold pl-6 font-display text-xl leading-snug text-navy md:text-2xl">
        {children}
      </blockquote>
    ),
    normal: ({ children }) => (
      <p className="mt-5 text-base leading-relaxed text-muted md:text-lg">
        {children}
      </p>
    ),
  },
  list: {
    bullet: ({ children }) => (
      <ul className="mt-5 space-y-3 text-base leading-relaxed text-muted md:text-lg">
        {children}
      </ul>
    ),
    number: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-3 pl-6 text-base leading-relaxed text-muted md:text-lg">
        {children}
      </ol>
    ),
  },
  listItem: {
    bullet: ({ children }) => (
      <li className="relative pl-6 before:absolute before:left-0 before:top-[0.7em] before:h-px before:w-3 before:bg-gold">
        {children}
      </li>
    ),
    number: ({ children }) => <li>{children}</li>,
  },
  marks: {
    strong: ({ children }) => (
      <strong className="font-semibold text-navy">{children}</strong>
    ),
    link: ({ children, value }) => {
      const href = String(value?.href ?? '');
      // Internal links keep the crawlable relative form; only genuinely
      // external ones get target/rel, and no link is ever nofollowed by
      // default — outbound links to real sources are a quality signal.
      const external = /^https?:\/\//.test(href);
      return external ? (
        <a
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="border-b border-gold text-navy transition-colors hover:border-navy"
        >
          {children}
        </a>
      ) : (
        <Link
          href={href}
          className="border-b border-gold text-navy transition-colors hover:border-navy"
        >
          {children}
        </Link>
      );
    },
  },
};

export function Prose({ value }: { value: PortableTextBlock[] }) {
  return (
    <div className="max-w-2xl">
      <PortableText value={value} components={components} />
    </div>
  );
}
