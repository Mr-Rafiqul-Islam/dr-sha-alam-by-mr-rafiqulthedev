import Image from "next/image";
import { CiCalendar, CiHeart, CiUser } from "react-icons/ci";
import { IoEyeOutline } from "react-icons/io5";
import { notFound } from "next/navigation";

// Input sanitization function to prevent injection attacks
function sanitizeSlug(slug) {
  if (!slug || typeof slug !== "string") {
    return null;
  }
  // Only allow alphanumeric characters, hyphens, and underscores
  // Remove any potentially dangerous characters
  const sanitized = slug.replace(/[^a-zA-Z0-9-_]/g, "");
  // Limit length to prevent DoS
  return sanitized.length > 100 ? null : sanitized;
}

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
    category: "Health",
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
    category: "Health",
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
    category: "Health",
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
    category: "Health",
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
    category: "Health",
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
    category: "Health",
  },
];

export async function generateMetadata({ params }) {
  const Params = await params;
  // Sanitize and validate slug input
  const rawSlug = Params?.slug;
  const sanitizedSlug = sanitizeSlug(rawSlug);
  
  if (!sanitizedSlug) {
    return {
      title: "News Not Found | Doctor Sha Alam",
      description: "Doctor Sha Alam",
      category: "Health",
    };
  }

  const news = newses.find((s) => s.slug === sanitizedSlug);

  return {
    title: news ? news?.title + " | Doctor Sha Alam" : "News Not Found | Doctor Sha Alam",
    description: news ? news?.desc : "Doctor Sha Alam",
    category: news ? news?.category : "Health",
  };
}

export default async function NewsDetailsPage({ params }) {
  const Params = await params;
  // Sanitize and validate slug input to prevent injection attacks
  const rawSlug = Params?.slug;
  const sanitizedSlug = sanitizeSlug(rawSlug);
  
  if (!sanitizedSlug) {
    notFound();
  }

  const news = newses.find((item) => item.slug === sanitizedSlug);
  
  if (!news) {
    notFound();
  }

  return (
    <div className="py-9 md:py-24">
      <div className="container mx-auto px-4 lg:px-0">
        <div className="relative overflow-hidden w-full h-[300px] md:h-[400px]">
          <Image
            src={news?.image}
            alt={news?.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 300px, 500px"
            priority
          />
        </div>
        <div className="flex justify-between items-center mt-5">
          <div className="flex gap-6 flex-wrap">
            <div className="flex gap-2 items-center">
              <CiCalendar className="text-primary" />
              <span>{news?.date}</span>
            </div>
            <div className="flex gap-2 items-center">
              <CiUser className="text-secondary" />
              <span>{news?.author}</span>
            </div>
            <div className="flex gap-2 items-center">
              <IoEyeOutline className="text-primary" />
              <span>{news?.views}</span>
            </div>
            <div className="flex gap-2 items-center">
              <CiHeart className="text-red-400" />
              <span>{news?.likes}</span>
            </div>
          </div>
          <div className="border border-primary rounded-full px-3 py-2 flex items-center justify-center font-medium font-montserrat">
            <span>{news?.category}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
