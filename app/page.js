import About from "@/components/About";
import Appointment from "@/components/Appointment";
import Expertise from "@/components/Expertise";
import Hero from "@/components/Hero";
import News from "@/components/News";
import Portfolio from "@/components/Portfolio";
import Service from "@/components/Service";
import Testimonial from "@/components/Testimonial";

export default function Home() {
  return (
    <div>
      <Hero />
      <About />
      <Service />
      <Expertise />
      <Testimonial />
      <Appointment />
      <Portfolio />
      <News />
    </div>
  );
}
