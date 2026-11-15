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
      src: "/images/books/covers/sapiens.jpg",
      width: 316,
      height: 499,
      alt: "Sapiens by Yuval Noah Harari, cream cover with red lettering",
    },
    sourceUrl: "https://www.harpercollins.com/products/sapiens-yuval-noah-harari",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg",
    spine: { src: "/images/books/sapiens-spine.svg", height: 256, width: 40 },
    order: 0,
  },
  {
    id: "atomic-habits",
    title: "Atomic Habits",
    author: "James Clear",
    cover: {
      src: "/images/books/covers/atomic-habits.jpg",
      width: 331,
      height: 500,
      alt: "Atomic Habits by James Clear, cream cover with dotted amber lettering",
    },
    sourceUrl: "https://jamesclear.com/atomic-habits",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg",
    spine: { src: "/images/books/atomic-habits-spine.svg", height: 252, width: 36 },
    order: 1,
  },
  {
    id: "steve-jobs",
    title: "Steve Jobs",
    author: "Walter Isaacson",
    cover: {
      src: "/images/books/covers/steve-jobs.jpg",
      width: 329,
      height: 500,
      alt: "Steve Jobs by Walter Isaacson, black and white portrait cover",
    },
    sourceUrl:
      "https://www.simonandschuster.com/books/Steve-Jobs/Walter-Isaacson/9781451648539",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9781451648546-L.jpg",
    spine: { src: "/images/books/steve-jobs-spine.svg", height: 268, width: 44 },
    order: 2,
  },
  {
    id: "crime-and-punishment",
    title: "Crime and Punishment",
    author: "Fyodor Dostoevsky",
    cover: {
      src: "/images/books/covers/crime-and-punishment.jpg",
      width: 335,
      height: 500,
      alt: "Crime and Punishment by Fyodor Dostoevsky, Penguin Classics cover",
    },
    sourceUrl: "https://www.penguinrandomhouse.com/books/286518/crime-and-punishment-by-fyodor-dostoevsky/",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780140449136-L.jpg",
    spine: {
      src: "/images/books/crime-and-punishment-spine.svg",
      height: 260,
      width: 41,
    },
    order: 3,
  },
  {
    id: "meditations",
    title: "Meditations",
    author: "Marcus Aurelius",
    cover: {
      src: "/images/books/covers/meditations.jpg",
      width: 320,
      height: 500,
      alt: "Meditations by Marcus Aurelius, black cover with a red bird and a white wing",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/6367/meditations-by-marcus-aurelius/9780812968255/",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780812968255-L.jpg",
    spine: { src: "/images/books/meditations-spine.svg", height: 254, width: 35 },
    order: 4,
  },
  {
    id: "12-rules",
    title: "12 Rules for Life",
    author: "Jordan B. Peterson",
    cover: {
      src: "/images/books/covers/12-rules.jpg",
      width: 331,
      height: 500,
      alt: "12 Rules for Life by Jordan B. Peterson, cream cover with amber rules",
    },
    sourceUrl: "https://www.penguinrandomhouse.com/books/562916/12-rules-for-life-by-jordan-b-peterson/",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780345816023-L.jpg",
    spine: { src: "/images/books/12-rules-spine.svg", height: 258, width: 39 },
    order: 5,
  },
  {
    id: "beyond-order",
    title: "Beyond Order",
    author: "Jordan B. Peterson",
    cover: {
      src: "/images/books/covers/beyond-order.jpg",
      width: 331,
      height: 500,
      alt: "Beyond Order by Jordan B. Peterson, black cover with amber rules",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/623911/beyond-order-by-jordan-b-peterson/9780593084649/",
    coverSourceUrl: "https://covers.openlibrary.org/b/isbn/9780593084649-L.jpg",
    spine: { src: "/images/books/beyond-order-spine.svg", height: 258, width: 39 },
    order: 6,
  },
  {
    id: "ddia",
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    cover: {
      src: "/images/books/ddia.svg",
      width: 381,
      height: 500,
      alt: "Designing Data-Intensive Applications by Martin Kleppmann",
    },
    sourceUrl:
      "https://www.oreilly.com/library/view/designing-data-intensive-applications/9781491903063/",
    coverSourceUrl: "https://yashank.site/img/now/ddia.jpg",
    spine: { src: "/images/books/ddia-spine.svg", height: 262, width: 42 },
    order: 7,
  },
  {
    id: "sun-and-steel",
    title: "Sun and Steel",
    author: "Yukio Mishima",
    cover: {
      src: "/images/books/sun-and-steel.svg",
      width: 314,
      height: 500,
      alt: "Sun and Steel by Yukio Mishima",
    },
    sourceUrl:
      "https://www.penguinrandomhouse.com/books/57915/sun-and-steel-by-yukio-mishima/",
    coverSourceUrl: "https://yashank.site/img/now/sun-and-steel.jpg",
    spine: { src: "/images/books/sun-and-steel-spine.svg", height: 254, width: 38 },
    order: 8,
  },
  {
    id: "industrial-society",
    title: "Industrial Society and Its Future",
    author: "Theodore Kaczynski",
    cover: {
      src: "/images/books/industrial-society.svg",
      width: 323,
      height: 500,
      alt: "Industrial Society and Its Future by Theodore Kaczynski",
    },
    sourceUrl:
      "https://www.goodreads.com/book/show/3070764-industrial-society-and-its-future",
    coverSourceUrl: "https://yashank.site/img/now/industrial-society.jpg",
    spine: {
      src: "/images/books/industrial-society-spine.svg",
      height: 260,
      width: 40,
    },
    order: 9,
  },
];

export function getEnabledBooks() {
  return booksConfig
    .filter((book) => book.enabled !== false)
    .sort((a, b) => a.order - b.order);
}
