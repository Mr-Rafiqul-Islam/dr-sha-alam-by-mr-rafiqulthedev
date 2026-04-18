import { MdCall, MdMarkEmailUnread } from "react-icons/md";
import { FaLocationDot, FaUserDoctor, FaSquareFacebook, FaHandsHoldingCircle } from "react-icons/fa6";
import { PiHeadCircuitLight } from "react-icons/pi";
import { GrFingerPrint } from "react-icons/gr";
import { RiWhatsappFill, RiInstagramFill } from "react-icons/ri";
import BenefitsBanner from "@/app/assets/BenefitsSingle.jpg";
import PLID from "@/app/assets/PLID.jpg";
import INJECTION from "@/app/assets/Injection.jpg";
import LifeStyle from "@/app/assets/Lifestyle.jpg";
import Yoga from "@/app/assets/Yoga.jpg";
import KneePain from "@/app/assets/KneePain.jpg";



export const HeaderTopMenu = [
    {
        info: "+8001918574590",
        icon: <MdCall />,
        link: "tel:+8001918574590",
    },
    {
        info: "dr.achiri@gmail.com",
        icon: <MdMarkEmailUnread />,
        link: "mailto:dr.achiri@gmail.com",
    },
    {
        info: "Main Crossroads, El Oued, Algeria",
        icon: <FaLocationDot />,
        link: "https://www.google.com/maps/place/%E0%A6%8F%E0%A6%B6%E0%A6%BF%E0%A7%9F%E0%A6%BE%E0%A6%9F%E0%A6%BF%E0%A6%95+%E0%A6%9F%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%A8%E0%A6%BF%E0%A6%82+%E0%A6%85%E0%A6%AB%E0%A6%BF%E0%A6%B8/@23.7665131,90.4066569,14z/data=!4m10!1m3!11m2!2sccQJzE1maGr0W3o0TqxpzU8NxRLK_Q!3e3!3m5!1s0x3755c700686c8499:0x535e686d384b7896!8m2!3d23.766494!4d90.4272444!16s%2Fg%2F11x6wkqqfl?entry=ttu&g_ep=EgoyMDI1MTAxNC4wIKXMDSoASAFQAw%3D%3D",
    },
];

export const IconsList = [
    {
        name: "facebook",
        icon: <FaSquareFacebook />,
        link: "#",
    },
    {
        name: "whatsapp",
        icon: <RiWhatsappFill />,
        link: "#",
    },
    {
        name: "instagram",
        icon: <RiInstagramFill />,
        link: "#",
    },
]

export const HeaderFooterMenu = [
    {
        title: "Home",
        link: "/",
    },
    {
        title: "About",
        link: "/about",
    },
    {
        title: "Services",
        link: "/services",
    },
    {
        title: "Testimonial",
        link: "/testimonial",
    },
    {
        title: "Portfolio",
        link: "/portfolio",
    },
    {
        title: "News",
        link: "/news",
    },
]

export const FooterMenu = [
    {
        title: "Home",
        link: "/",
    },
    {
        title: "About",
        link: "/about",
    },
    {
        title: "Services",
        link: "/services",
    },
    {
        title: "Contact",
        link: "/contact",
    },
];

export const ServiceData = [
    {
        title: "Book an Appointment",
        image: "https://images.unsplash.com/photo-1550831106-f8d5b6f1abe9?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw1OXx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "Schedule your appointment for consultation quickly and easily.",
        progressPercentage: 5
    },
    {
        title: "Visit the Chamber",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw2MHx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "Come for precise evaluation and personalised medical attention.",
        progressPercentage: 15
    },
    {
        title: "Medical & Lifestyle Evaluation",
        image: "https://images.unsplash.com/photo-1581056771107-24ca5f033842?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw1NHx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "We assess your condition, history, and lifestyle to understand the root cause.",
        progressPercentage: 30
    },
    {
        title: "Treatment Discussion with Dr Shah Alam",
        image: "https://images.unsplash.com/photo-1550831106-2747f0d6a81c?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw2OHx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMjF8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "Receive honest, clear, and evidence-based guidance — no confusion, no pressure.",
        progressPercentage: 50
    },
    {
        title: "Personalized Healing Plan",
        image: "https://images.unsplash.com/photo-1663151064065-cb334788f77d?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw2Mnx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMjF8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "A tailored plan combining medical care, yoga, and natural remedy system",
        progressPercentage: 80
    },
    {
        title: "Begin Your Pain-Free Journey",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHwyN3x8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2Njc4Njd8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        desc: "Start treatment and move towards real, lasting freedom from PLID and chronic pain.",
        progressPercentage: 100
    },
]

export const TestimonialData = {
    title: "What Our Patients Say About Their Healing Journey",
    feedback: [
        {
            name: "Aminul Haque",
            address: "El Oued",
            comment: "After years of PLID and repeated advice for surgery, Dr Shah Alam gave me a clear plan that actually worked. I can walk normally again.",
            ratting: "4.9",
            image: ""
        },
        {
            name: "Mehnaz Rahman",
            address: "El Oued",
            comment: "My chronic back pain disappeared after following the yoga + medical protocol. I got my life back.",
            ratting: "5.0",
            image: ""
        },
        {
            name: "Kamruzzaman Liton",
            address: "El Oued",
            comment: "I can pray now like other normal people and I can sit normally in Bongason position. The natural healing protocol is unbelievable for my Knee Osteoarthritis pain.",
            ratting: "4.8",
            image: ""
        },
        {
            name: "Nabiha Ahmed",
            address: "El Oued",
            comment: "Only Dr Shah Alam explained the root cause and fixed it without surgery. Best decision I made.",
            ratting: "5.0",
            image: ""
        },
        {
            name: "Farhan Siddiqui",
            address: "El Oued",
            comment: "The personalised plan reduced my disc bulge pain in weeks. Amazing results.",
            ratting: "4.9",
            image: ""
        },
    ]
}

export const BenefitsData = {
    singleCard: {
        title: "Healthcare That Fits Your Life",
        desc: "We combine science, yoga, and natural healing into one simple, accessible system — designed to restore your health without complication or financial pressure.",
        image: BenefitsBanner
    },
    gridCard: [
        {
            icon: <FaHandsHoldingCircle className="text-6xl md:text-[102px]" />,
            title: "Personalised Healing Plans",
            desc: "Every patient receives a customised treatment roadmap blending medical care, yoga, and natural remedies for fast and lasting results."
        },
        {
            icon: <PiHeadCircuitLight className="text-6xl md:text-[102px]" />,
            title: "Smart Diagnostics & Digital Care",
            desc: "Modern diagnostic tools and digital follow-up systems help us track your progress and guide your healing with accuracy."
        },
        {
            icon: <GrFingerPrint className={"w-[60px] md:w-[102px] h-[60px] md:h-[102px]"} />,
            title: "Continuous, Connected Care",
            desc: "From follow-up support to lifestyle correction, we ensure your improvement continues long after the first visit."
        },
        {
            icon: <FaUserDoctor className={"w-[60px] md:w-[102px] h-[60px] md:h-[102px]"} />,
            title: "Expert Support Without Confusion",
            desc: "Clear explanations, honest decisions, and a treatment approach that avoids unnecessary medicine, injections, or surgery."
        },
    ]
}

export const tabData = [
    {
        name: "PLID",
        expertise: "Prolapsed Lumber Intervertebral Disc (PLID)",
        ratting: "100K+ Patient Served",
        description: "PLID is a disease that results mainly from Disc Prolapse. This disease can be cured by not only medicines or surgery, but need a combined approach of Yoga, Lifestyle Modifications, Occupation Correction, Stress Management Technique and Healthy Food Habit",
        highlight: ["100M+ Support", "1000+ Surgery", "30K+ Injections", "100K+ Served"],
        image: PLID
    },
    {
        name: "Epidural Steroid Injection",
        expertise: "An alternative option for surgery in 90% patients",
        ratting: "30K+ Epidural Steroid Injections given",
        description: "Epidural Steroid Injection (ESI) is a best option for the PLID Patients who 1) Need no surgery but symptoms persist, 2) Who have very little disc prolapse, 3) Who have no time to do surgery, going to abroad recently, 4) Who are older aged",
        highlight: ["90% Symptoms Free", "90% Need No Surgery"],
        image: INJECTION
    },
    {
        name: "Knee Pain",
        expertise: "Knee Pain can be treated simply by Yoga and Injection",
        ratting: "10K+ Happy Patients",
        description: "Knee Pain has many causes like 1) Trauma, 2) Meniscus Injury, 3) Osteoarthritis, 4) Ligament Injury. But this can be minimized mostly by Yoga and Proper Mindful Stepping",
        highlight: ["10K+ Support", "1000+ Injection"],
        image: KneePain
    },
    {
        name: "Yoga",
        expertise: "Ancient Prevention Magic",
        ratting: "500K + Happy Patients",
        description: "Yoga is an ancient remedy system that can prevent and cure most of our diseaes. Our 90% patients need no surgery or no injection or no more medicine",
        highlight: ["500K+ Support", "500K+ Better Life"],
        image: Yoga
    },
    {
        name: "Lifestyle Modification",
        expertise: "A life changing approach",
        ratting: "500K + Successful People",
        description: "",
        highlight: ["500K+ Support", "500K+ Better Life"],
        image: LifeStyle
    },
]

export const NewsData = [
    {
        id: 1,
        title: "PLID & Disc Bulge: What Every Patient Must Know (2025 Update)",
        shortDesc: "Learn the real causes of PLID, why most patients don’t need surgery, and how medical science + yoga therapy can accelerate recovery naturally.",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?           Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?",
        image: "https://images.unsplash.com/photo-1550831106-f8d5b6f1abe9?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw1OXx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        date: "2023-01-01",
        category: "Health",
        author: "Dr. Sha Alam",
        views: "1000",
        comments: "10",
        isFeatured: true,
        slug: "plid-and-disc-bulge-what-every-patient-must-know-2025-update"
    },
    {
        id: 2,
        title: "Yoga Can Give You a PLID Free Life",
        shortDesc: "Millions of people follow our Yoga For PLID Program. They are now PLID Free. Now let try yourself",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?           Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?",
        image: "https://images.unsplash.com/photo-1631217868264-e5b90bb7e133?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHwyN3x8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2Njc4Njd8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        date: "2023-01-01",
        category: "Health",
        author: "Dr. Sha Alam",
        views: "1000",
        comments: "10",
        isFeatured: true,
        slug: "yoga-can-give-you-a-plid-free-life"
    },
    {
        id: 3,
        title: "Epidural Steroid Injection reduces Surgery Rate",
        shortDesc: "Most PLID Patient need no surgery and they can return to their previous healthy life without surgery in more than 80% cases",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?           Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw2MHx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        date: "2023-01-01",
        category: "Health",
        author: "Dr. Sha Alam",
        views: "1000",
        comments: "10",
        isFeatured: true,
        slug: "epidural-steroid-injection-reduces-surgery-rate"
    },
    {
        id: 4,
        title: "Knee Pain After 40: Why It Happens & How to Fix It Naturally",
        shortDesc: "From meniscus injury to weak thigh muscles — understand the root causes and explore safe, non-surgical solutions that actually work.",
        desc: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?           Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati vitae architecto commodi, maxime ex, rem deserunt velit distinctio repudiandae dolore aspernatur totam fugit voluptate nostrum ducimus sapiente perferendis qui officia deleniti rerum minima similique. Totam doloribus eaque saepe iusto necessitatibus id aut alias distinctio, esse fugiat exercitationem qui, quis quam? Lorem, ipsum dolor sit amet consectetur adipisicing elit. Sint suscipit est placeat impedit atque pariatur fuga, facere cumque perspiciatis mollitia praesentium quis molestias eveniet sapiente error aliquam earum magni natus quos quam amet quibusdam eum! Quasi inventore debitis quos, laborum numquam voluptate omnis accusantium! Aliquid ea rerum officiis consequuntur similique?",
        image: "https://images.unsplash.com/photo-1584515933487-779824d29309?ixid=M3w2Mjk0NDZ8MHwxfHNlYXJjaHw2MHx8ZG9jdG9yc3xlbnwwfHx8fDE3NjI2NjQzMzV8MA&ixlib=rb-4.1.0&fit=facearea&facepad=8&w=1024&h=1024&q=80",
        date: "2023-01-01",
        category: "Health",
        author: "Dr. Sha Alam",
        views: "1000",
        comments: "10",
        isFeatured: true,
        slug: "knee-pain-after-40-why-it-happens-and-how-to-fix-it-naturally"
    },
]