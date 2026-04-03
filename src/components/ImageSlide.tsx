import { motion } from 'framer-motion';

interface Props {
  src: string;
  title: string;
  subtitle: string;
  darkMode: boolean;
}

export function ImageSlide({ src, title, subtitle, darkMode: d }: Props) {
  return (
    <div className="flex flex-col items-center gap-6 py-8">
      <div className="text-center">
        <h2 className={`text-2xl font-bold ${d ? 'text-slate-100' : 'text-slate-900'}`}>{title}</h2>
        <p className={`text-sm mt-1 ${d ? 'text-slate-400' : 'text-slate-500'}`}>{subtitle}</p>
      </div>
      <motion.div
        className="glass-card overflow-hidden"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <img
          src={src}
          alt={title}
          className="max-w-full max-h-[60vh] object-contain"
        />
      </motion.div>
    </div>
  );
}
