"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaRegClock } from "react-icons/fa6";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {   Carousel,  CarouselApi,  CarouselContent,  CarouselItem} from "@/components/ui/carousel";
import type { Article } from "@/schema/artcle";

const FALLBACK_IMAGE =
    "https://images.unsplash.com/photo-1504711434969-e33886168f5c?auto=format&fit=crop&q=80&w=800";

const AUTOPLAY_DELAY_MS = 4000;
const relativeTime = new Intl.RelativeTimeFormat("en", { numeric: "always" });

function formatCreatedAt(createdAt: Date) {
    const difference = Date.now() - createdAt.getTime();
    const elapsed = Math.abs(difference);
    if (elapsed >= 7 * 24 * 60 * 60 * 1000) {
        return createdAt.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    }
    if (elapsed < 60 * 1000) return "just now";

    const units = [
        ["day", 24 * 60 * 60 * 1000],
        ["hour", 60 * 60 * 1000],
        ["minute", 60 * 1000],
    ] as const;
    const [unit, duration] = units.find(([, duration]) => elapsed >= duration) ?? units[2];
    const value = Math.floor(elapsed / duration) * (difference > 0 ? -1 : 1);
    return relativeTime.format(value, unit);
}

type HeroProps = {
    articles: Article[];
};

const Hero = ({ articles }: HeroProps) => {
    const [api, setApi] = useState<CarouselApi>();

    useEffect(() => {
        if (!api) return;
        const timer = setInterval(() => {
            api.scrollNext();
        }, AUTOPLAY_DELAY_MS);

        return () => clearInterval(timer);
    }, [api]);

    return (
        <section className="relative w-full overflow-hidden bg-zinc-900 py-12 text-white md:py-20">
            <div className="mx-auto container px-4 sm:px-6 lg:px-8">
                <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
                    <CarouselContent>
                        {articles.map((article) => (
                            <CarouselItem key={article._id}>
                                <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
                                    {/* Left: article info */}
                                    <div className="space-y-6 lg:col-span-6">
                                        <div className="flex items-center gap-2">
                                            <Badge className="bg-teal-500 text-xs font-bold uppercase tracking-wider text-zinc-950 hover:bg-teal-400">
                                                {article.category || "General"}
                                            </Badge>
                                            <div className="flex items-center gap-1 text-xs text-zinc-400">
                                                <FaRegClock className="size-3" />
                                                <span>{formatCreatedAt(article.createdAt)}</span>
                                            </div>
                                        </div>

                                        <h1 className="text-3xl font-extrabold leading-tight tracking-tight text-white sm:text-4xl lg:text-5xl">
                                            {article.title}
                                        </h1>
                                        <Button variant="default" className="h-11 cursor-pointer rounded-md bg-teal-500 px-6 font-bold text-zinc-950 hover:bg-teal-600"
                                            render={<Link href={`/article/${article._id}`}>
                                                Read Full Story</Link>}
                                        />
                                    </div>

                                    {/* Right: image */}
                                    <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-800 shadow-2xl lg:col-span-6">
                                        <Image   src={article.imageUrl || FALLBACK_IMAGE} alt={article.title}  fill  priority className="object-cover brightness-95 transition-all duration-500 hover:brightness-100" />
                                    </div>
                                </div>
                            </CarouselItem>
                        ))}
                    </CarouselContent>
                </Carousel>
            </div>
        </section>
    );
};

export default Hero;