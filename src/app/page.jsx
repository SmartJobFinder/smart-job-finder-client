import React from "react";
import HeroSection from "@/components/home/HeroSection";
import StatsSection from "@/components/home/StatsSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import VacanciesSection from "@/components/home/VacanciesSection";
import HowItWorksSection from "@/components/home/HowItWorksSection";
import FeaturedJobsSection from "@/components/home/FeaturedJobsSection";
import TopCompaniesSection from "@/components/home/TopCompaniesSection";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import CallToActionSection from "@/components/home/CallToActionSection";
import AboutUsSection from "@/components/home/AboutUsSection";
import EventsSection from "@/components/home/EventsSection";

export default function HomePage() {
    return (
        <div className="container px-2 py-6 mx-auto sm:px-4 sm:py-8">
            <section id="hero">
                <HeroSection />
            </section>
            <section id="featured-jobs">
                <FeaturedJobsSection />
            </section>
            <section id="top-companies">
                <TopCompaniesSection />
            </section>
            <section id="events">
                <EventsSection />
            </section>
            <section id="how-it-works">
                <HowItWorksSection />
            </section>
            <section id="call-to-action">
                <CallToActionSection />
            </section>
            {/* <section id="stats">
                <StatsSection />
            </section> */}
            <section id="categories">
                <CategoriesSection />
            </section>
            {/* <VacanciesSection /> */}
            <TestimonialsSection />
            <section id="aboutUs">
                <AboutUsSection />
            </section>
        </div>
    );
}
