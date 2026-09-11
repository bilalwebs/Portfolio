import { motion } from "motion/react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft, Ghost } from "lucide-react";
import { Footer } from "@/components/layout/footer";

export function NotFound() {
  return (
    <div className="dark min-h-screen bg-background text-foreground">
      <main className="flex min-h-[80vh] flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative mx-auto mb-8 grid h-32 w-32 place-items-center"
          >
            <span className="absolute inset-0 rounded-full bg-primary/10" />
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/5" />
            <Ghost className="relative text-primary" size={52} />
          </motion.div>

          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-4 block text-8xl font-bold tracking-tighter text-primary/20 sm:text-9xl"
          >
            404
          </motion.span>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-2 text-3xl font-bold sm:text-4xl"
          >
            Page not found
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mx-auto mt-4 max-w-md text-muted-foreground"
          >
            The page you're looking for doesn't exist or has been moved.
            Let's get you back on track.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="mt-8 flex items-center justify-center gap-4"
          >
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center gap-2 rounded-full border border-border bg-background/40 px-6 py-3 text-sm font-medium text-foreground transition-all duration-300 hover:border-primary hover:text-primary hover:neon-glow"
            >
              <ArrowLeft size={16} />
              Go Back
            </button>
            <Link
              to="/"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-all duration-300 hover:scale-105 hover:neon-glow"
            >
              <Home size={16} />
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </main>
      <Footer />
    </div>
  );
}
