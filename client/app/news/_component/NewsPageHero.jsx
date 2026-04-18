import NewsCard from "./NewsCard";

const newses = [
  {
    id: 1,
    image:
      "https://images.unsplash.com/photo-1528498033373-3c6c08e93d79?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw5NXx8aGVhbHRofGVufDB8fHx8MTc2MzU1MDI0NXww&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
  {
    id: 2,
    image:
      "https://images.unsplash.com/photo-1540420773420-3366772f4999?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw5OXx8aGVhbHRofGVufDB8fHx8MTc2MzU1MDI0NXww&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
  {
    id: 3,
    image:
      "https://images.unsplash.com/photo-1530026405186-ed1f139313f8?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHwxMDB8fGhlYWx0aHxlbnwwfHx8fDE3NjM1NTAyNDV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
  {
    id: 4,
    image:
      "https://images.unsplash.com/photo-1514995669114-6081e934b693?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw5MXx8aGVhbHRofGVufDB8fHx8MTc2MzU1MDI0NXww&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
  {
    id: 5,
    image:
      "https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw0fHxoZWFsdGh8ZW58MHx8fHwxNzYzNTUwMzI3fDA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
  {
    id: 6,
    image:
      "https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHwxMHx8aGVhbHRofGVufDB8fHx8MTc2MzU1MDMyN3ww&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
    title: "A passion for putting patients first",
    desc: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque placerat scelerisque tortor ornare ornare. Quisque placerat scelerisque tortor ornare ornare Convallis felis vitae tortor augue. Velit nascetur proin massa in. Consequat faucibus porttitor enim et....",
    date: "Monday 05, September 2021",
    author: "By Author",
    views: "86",
    likes: "68",
    slug: "a-passion-for-putting-patients-first",
  },
];

export default function NewsPageHero() {
  return (
    <section className="py-9 md:py-24">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="max-w-2xl text-center mx-auto my-5 lg:my-6">
          <h1 className="text-xl md:text-3xl font-extrabold leading-tight text-gray-900">
            Latest News
          </h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {newses &&
            newses?.map((news) => (
              <NewsCard
                key={news.id}
                title={news.title}
                desc={news.desc}
                date={news.date}
                author={news.author}
                views={news.views}
                likes={news.likes}
                slug={news.slug}
                image={news.image}
              />
            ))}
        </div>
      </div>
    </section>
  );
}
