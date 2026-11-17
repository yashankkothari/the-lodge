import type { Book } from "@/config/types";

export const bookshelfConfig = {
  title: "Bookshelf",
  href: "/#bookshelf",
  defaultBookId: "sapiens",
  coverUnavailable: "Cover unavailable",
  empty: "More books will find their way here.",
};

export const booksConfig: Book[] = [
  {
    id: "sapiens",
    title: "Sapiens",
    author: "Yuval Noah Harari",
    cover: {
      src: "/images/books/covers/sapiens-scan.webp",
      width: 653,
      height: 1000,
      alt: "Sapiens by Yuval Noah Harari, cream Vintage paperback cover with red lettering",
    },
    sourceUrl: "https://hermiene.net/literature/library/book/sapiens--harari",
    coverSourceUrl: "https://hermiene.net/images/books/display/sapiens--harari_front.jpg",
    spine: {
      src: "/images/books/spines/sapiens.webp",
      height: 256,
      width: 47,
      sourceUrl: "https://hermiene.net/literature/library/book/sapiens--harari",
    },
    order: 0,
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    cover: {
      src: "/images/books/covers/atomic-habits-scan.webp",
      width: 653,
      height: 1000,
      alt: "Atomic Habits by James Clear, cream Random House paperback cover with dotted brown lettering",
    },
    sourceUrl: "https://hermiene.net/literature/library/book/atomic-habits--clear",
    coverSourceUrl: "https://hermiene.net/images/books/display/atomic-habits--clear_front.jpg",
    spine: {
      src: "/images/books/spines/atomic-habits.webp",
      height: 252,
      width: 25,
      sourceUrl: "https://hermiene.net/literature/library/book/atomic-habits--clear",
    },
    order: 1,
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    cover: {
      src: "/images/books/covers/steve-jobs-hd.jpg",
      width: 1399,
      height: 2131,
      alt: "Steve Jobs by Walter Isaacson, black and white portrait cover",
    },
    sourceUrl:
      "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539",
    coverSourceUrl: "https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781451648539/steve-jobs-9781451648539_hr.jpg",
    spine: {
      src: "/images/books/spines/steve-jobs.webp",
      height: 268,
      width: 38,
      sourceUrl: "https://www.iclarified.com/16502/front-and-back-cover-of-the-upcoming-steve-jobs-biography-photo",
    },
    order: 2,
  },
  {
    id: "crime-and-punishment",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    cover: {
      src: "/images/books/covers/crime-and-punishment-scan.webp",
      width: 634,
      height: 1000,
      alt: "Crime and Punishment by Fyodor Dostoevsky, Wordsworth Classics cover with a stylized figure",
    },
    sourceUrl: "https://hermiene.net/literature/library/book/crime-and-punishment--dostoevsky",
    coverSourceUrl: "https://hermiene.net/images/books/display/crime-and-punishment--dostoevsky_front.jpg",
    spine: {
      src: "/images/books/spines/crime-and-punishment.webp",
      height: 260,
      width: 31,
      sourceUrl: "https://hermiene.net/literature/library/book/crime-and-punishment--dostoevsky",
    },
    order: 3,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    cover: {
      src: "/images/books/covers/meditations-scan.webp",
      width: 650,
      height: 1000,
      alt: "Meditations by Marcus Aurelius, beige cloth Classics Club cover with a red and gold emblem",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/6367/meditations-by-marcus-aurelius/9780812968255/",
    coverSourceUrl: "https://www.ebay.com/itm/226548908960",
    spine: {
      src: "/images/books/spines/meditations.webp",
      height: 254,
      width: 36,
      sourceUrl: "https://www.ebay.com/itm/226548908960",
    },
    order: 4,
  },
  {
    id: "12-rules",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    cover: {
      src: "/images/books/covers/12-rules-scan.webp",
      width: 648,
      height: 1000,
      alt: "12 Rules for Life by Jordan B. Peterson, cream Penguin paperback cover with orange lettering",
    },
    sourceUrl: "https://hermiene.net/literature/library/book/12-rules-for-life--peterson",
    coverSourceUrl: "https://hermiene.net/images/books/display/12-rules-for-life--peterson_front.jpg",
    spine: {
      src: "/images/books/spines/12-rules.webp",
      height: 258,
      width: 28,
      sourceUrl: "https://hermiene.net/literature/library/book/12-rules-for-life--peterson",
    },
    order: 5,
  },
  {
    id: "beyond-order",
    title: "Beyond Order",
    author: "Jordan B. Peterson",
    cover: {
      src: "/images/books/covers/beyond-order-scan.webp",
      width: 645,
      height: 1000,
      alt: "Beyond Order by Jordan B. Peterson, black Penguin paperback cover with orange lettering",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/623911/beyond-order-by-jordan-b-peterson/9780593084649/",
    coverSourceUrl: "https://hermiene.net/images/books/display/beyond-order--peterson_front.jpg",
    spine: {
      src: "/images/books/spines/beyond-order.webp",
      height: 258,
      width: 28,
      sourceUrl: "https://hermiene.net/literature/library/book/beyond-order--peterson",
    },
    order: 6,
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    cover: {
      src: "/images/books/covers/ddia-scan.webp",
      width: 690,
      height: 1000,
      alt: "Designing Data-Intensive Applications by Martin Kleppmann, red and white O’Reilly cover with a wild boar",
    },
    sourceUrl:
      "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
    coverSourceUrl: "https://bookbot.com/g/518366",
    spine: {
      src: "/images/books/spines/ddia.webp",
      height: 262,
      width: 42,
      sourceUrl: "https://bookbot.com/g/518366",
    },
    order: 7,
  },
  {
    id: "sun-and-steel",
    title: "Sun and Steel",
    author: "Yukio Mishima",
    cover: {
      src: "/images/books/covers/sun-and-steel-scan.webp",
      width: 620,
      height: 1000,
      alt: "Sun and Steel by Yukio Mishima, Kodansha paperback cover with Mishima and an illustrated wave pattern",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/57915/sun-and-steel-by-yukio-mishima/",
    coverSourceUrl: "https://www.secondstorybooks.com/pages/books/1384666/yukio-mishima-john-bester/sun-and-steel?soldItem=true",
    spine: {
      src: "/images/books/spines/sun-and-steel.webp",
      height: 254,
      width: 13,
      sourceUrl: "https://www.secondstorybooks.com/pages/books/1384666/yukio-mishima-john-bester/sun-and-steel?soldItem=true",
    },
    order: 8,
  },
  {
    id: "industrial-society",
    title: "Industrial Society and Its Future",
    author: "Theodore Kaczynski",
    cover: {
      src: "/images/books/covers/industrial-society-scan.webp",
      width: 660,
      height: 1000,
      alt: "Industrial Society and Its Future by Theodore John Kaczynski, black Graphyco edition cover with red lettering",
    },
    sourceUrl:
      "https://www.goodreads.com/book/show/3070764-industrial-society-and-its-future",
    coverSourceUrl: "https://knihobot.cz/g/5483465",
    spine: {
      src: "/images/books/spines/industrial-society.webp",
      height: 260,
      width: 13,
      sourceUrl: "https://knihobot.cz/g/5483465",
    },
    order: 9,
  },
];

export function getEnabledBooks() {
  return booksConfig
    .filter((book) => book.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
