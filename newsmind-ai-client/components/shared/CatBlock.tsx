
import { FaRegLightbulb } from 'react-icons/fa6';
import { Button } from '../ui/button';
import Link from 'next/link';

const CatBlock = () => {
    return (
        <section className="relative rounded-2xl bg-zinc-900 border border-zinc-800 text-white p-8 md:p-12 overflow-hidden shadow-xl">
          <div className="absolute top-0 right-0 h-48 w-48 bg-teal-500/10 rounded-full blur-3xl -z-10" />
          <div className="absolute bottom-0 left-0 h-48 w-48 bg-zinc-800/20 rounded-full blur-2xl -z-10" />

          <div className="max-w-2xl mx-auto text-center space-y-6">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-500 text-zinc-950 mx-auto shadow-md">
              <FaRegLightbulb className="size-6" />
            </div>
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Unlock the Power of AI-News Intelligence
            </h2>
            <p className="text-zinc-300 text-base md:text-lg leading-relaxed">
              Join thousands of researchers, media analysts, and decision-makers. Recieve real-time summaries, personalized recommendation streams, and advanced sentiment modeling for all global trends.
            </p>
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="default" render={<Link href="/register">Get Started Free</Link>} className="rounded-md bg-teal-500 text-zinc-950 font-bold hover:bg-teal-400 px-6 h-11 cursor-pointer" />
              <Button variant="outline" render={<Link href="/about">Learn More</Link>} className="rounded-md border-zinc-700 hover:bg-zinc-800 text-white h-11 px-6 font-semibold cursor-pointer" />
            </div>
          </div>
        </section>
    );
};

export default CatBlock;