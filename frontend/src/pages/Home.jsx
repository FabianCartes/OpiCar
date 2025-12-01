import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Zap, Award, ChevronRight, Gauge, Flame, Trophy } from 'lucide-react';
import CarCard from '../components/CarCard';
import { getCars } from '../services/car.service';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cardsVisible, setCardsVisible] = useState(false);
    const cardsRef = useRef(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getCars();
                setCars(data);
            } catch (error) {
                console.error("Error fetching cars:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCars();

        // Trigger animations after component mounts
        setTimeout(() => setIsLoaded(true), 100);
    }, []);

    // Intersection Observer for feature cards
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setCardsVisible(true);
                    }
                });
            },
            {
                threshold: 0.2,
                rootMargin: '0px'
            }
        );

        if (cardsRef.current) {
            observer.observe(cardsRef.current);
        }

        return () => {
            if (cardsRef.current) {
                observer.unobserve(cardsRef.current);
            }
        };
    }, []);

    // Split text into individual characters for animation - memoized to prevent re-renders
    const AnimatedText = React.memo(({ text, delay = 0, gradient = false }) => {
        return (
            <span className="inline-block">
                {text.split('').map((char, index) => (
                    <span
                        key={index}
                        className={`inline-block transition-all duration-500 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${gradient ? 'text-transparent bg-clip-text bg-gradient-to-r from-primary-600 to-primary-500 dark:from-primary-500 dark:to-primary-400' : ''}`}
                        style={{
                            transitionDelay: `${delay + index * 0.03}s`
                        }}
                    >
                        {char === ' ' ? '\u00A0' : char}
                    </span>
                ))}
            </span>
        );
    });

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
                {/* Dynamic Animated Background */}
                <div className="absolute inset-0 bg-gray-50 dark:bg-dark-bg transition-colors duration-500">
                    {/* Racing Cars Effect - Animated lines simulating highway traffic */}
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                        {/* Left to Right lanes (Headlights - Black in Light Mode / White in Dark Mode) */}
                        <div
                            className="absolute h-[2px] bg-gradient-to-r from-transparent via-black/40 dark:via-blue-100 to-transparent opacity-60 blur-[1px] shadow-[0_0_10px_rgba(0,0,0,0.5)] dark:shadow-[0_0_10px_rgba(255,255,255,0.8)]"
                            style={{
                                width: '150px',
                                top: '30%',
                                left: '0',
                                animation: 'race-left-to-right 3s linear infinite'
                            }}
                        ></div>
                        <div
                            className="absolute h-[2px] bg-gradient-to-r from-transparent via-black/60 dark:via-white to-transparent opacity-80 blur-[1px] shadow-[0_0_15px_rgba(0,0,0,0.8)] dark:shadow-[0_0_15px_rgba(255,255,255,1)]"
                            style={{
                                width: '200px',
                                top: '35%',
                                left: '0',
                                animation: 'race-left-to-right 2s linear infinite 0.5s'
                            }}
                        ></div>
                        <div
                            className="absolute h-[2px] bg-gradient-to-r from-transparent via-black/30 dark:via-blue-50 to-transparent opacity-50 blur-[1px]"
                            style={{
                                width: '100px',
                                top: '40%',
                                left: '0',
                                animation: 'race-left-to-right 4s linear infinite 1.2s'
                            }}
                        ></div>

                        {/* Right to Left lanes (Taillights - Red) */}
                        <div
                            className="absolute h-[2px] bg-gradient-to-l from-transparent via-red-500 to-transparent opacity-70 blur-[1px] shadow-[0_0_10px_rgba(239,68,68,0.8)]"
                            style={{
                                width: '150px',
                                top: '60%',
                                right: '0',
                                animation: 'race-right-to-left 2.5s linear infinite'
                            }}
                        ></div>
                        <div
                            className="absolute h-[2px] bg-gradient-to-l from-transparent via-red-600 to-transparent opacity-90 blur-[1px] shadow-[0_0_15px_rgba(220,38,38,1)]"
                            style={{
                                width: '250px',
                                top: '65%',
                                right: '0',
                                animation: 'race-right-to-left 1.8s linear infinite 0.3s'
                            }}
                        ></div>
                        <div
                            className="absolute h-[2px] bg-gradient-to-l from-transparent via-red-400 to-transparent opacity-60 blur-[1px]"
                            style={{
                                width: '120px',
                                top: '70%',
                                right: '0',
                                animation: 'race-right-to-left 3.5s linear infinite 1.5s'
                            }}
                        ></div>
                    </div>

                    {/* Animated gradient orbs */}
                    <div
                        className={`absolute top-0 left-0 w-96 h-96 rounded-full transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            animation: isLoaded ? 'float 8s ease-in-out infinite' : 'none'
                        }}
                    ></div>
                </div>

                <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    {/* Badge */}
                    <div
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary-50 dark:bg-primary-900/30 border border-primary-100 dark:border-primary-800 mb-8 transition-all duration-700 delay-200 ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-90'}`}
                    >
                        <Flame className="h-4 w-4 text-primary-600 dark:text-primary-400" />
                        <span className="text-sm font-bold text-primary-700 dark:text-primary-300 uppercase tracking-wider">La Pasión por los Autos</span>
                    </div>

                    {/* Main heading */}
                    <h1 className="text-6xl md:text-8xl font-black mb-6 tracking-tighter italic uppercase perspective-1000">
                        <div className="text-slate-900 dark:text-white">
                            {React.useMemo(() => <AnimatedText text="Descubre tu " delay={0.3} />, [isLoaded])}
                        </div>
                        <div>
                            {React.useMemo(() => <AnimatedText text="Potencial" delay={0.7} gradient={true} />, [isLoaded])}
                        </div>
                    </h1>

                    {/* Description */}
                    <p
                        className={`text-xl md:text-2xl mb-10 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-[1200ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        La plataforma definitiva para entusiastas. <span className="font-semibold text-slate-900 dark:text-white">Reseñas reales</span>, especificaciones técnicas y la comunidad más activa.
                    </p>

                    {/* CTA Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                        <Link
                            to="/search"
                            className={`group relative px-8 py-4 bg-primary-600 text-white font-bold text-lg rounded-xl overflow-hidden shadow-lg shadow-primary-600/30 hover:shadow-primary-600/50 transition-all duration-700 delay-[1400ms] hover:-translate-y-1 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 skew-y-12"></div>
                            <span className="relative flex items-center gap-2">
                                Buscar Autos <ChevronRight className="h-5 w-5" />
                            </span>
                        </Link>
                        <Link
                            to="/register"
                            className={`px-8 py-4 bg-white dark:bg-white/5 text-slate-900 dark:text-white font-bold text-lg rounded-xl border-2 border-slate-200 dark:border-white/10 hover:border-primary-500 dark:hover:border-primary-500 transition-all duration-700 delay-[1400ms] hover:-translate-y-1 ${isLoaded ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}
                        >
                            Unirse a la Comunidad
                        </Link>
                    </div>
                </div>
            </section>

            {/* Objectives / Intro Section */}
            <section ref={cardsRef} className="py-24 bg-slate-50 dark:bg-[#0a0a0a] relative overflow-hidden">
                {/* Decorative Background Element */}
                <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-20%] right-[-10%] w-[50%] h-[150%] bg-gradient-to-b from-transparent via-primary-500/5 to-transparent -rotate-12 blur-3xl"></div>
                </div>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {/* Card 1 */}
                        <div
                            className={`group relative p-8 rounded-3xl bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-primary-500/30 transition-all duration-700 delay-100 hover:-translate-y-2 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Gauge className="h-24 w-24 text-primary-600" />
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Zap className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic uppercase">Velocidad y Precisión</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Accede a datos técnicos precisos y comparativas detalladas al instante. No pierdas tiempo buscando, encuentra tu máquina ideal en segundos.
                            </p>
                        </div>

                        {/* Card 2 */}
                        <div
                            className={`group relative p-8 rounded-3xl bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-primary-500/30 transition-all duration-700 delay-300 hover:-translate-y-2 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <ShieldCheck className="h-24 w-24 text-primary-600" />
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Award className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic uppercase">Confianza Total</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Opiniones verificadas de dueños reales. Conoce los pros, los contras y las fallas comunes antes de tomar una decisión. Transparencia absoluta.
                            </p>
                        </div>

                        {/* Card 3 */}
                        <div
                            className={`group relative p-8 rounded-3xl bg-white dark:bg-[#121212] border border-slate-100 dark:border-white/5 shadow-xl hover:shadow-2xl hover:border-primary-500/30 transition-all duration-700 delay-500 hover:-translate-y-2 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                        >
                            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                <Trophy className="h-24 w-24 text-primary-600" />
                            </div>
                            <div className="h-14 w-14 rounded-2xl bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                <Award className="h-7 w-7 text-primary-600 dark:text-primary-400" />
                            </div>
                            <h3 className="text-2xl font-black text-slate-900 dark:text-white mb-4 italic uppercase">Comunidad Elite</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                                Únete a miles de apasionados por el motor. Comparte tus experiencias, sube fotos de tu nave y ayuda a otros a encontrar su camino.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Cars Section */}
            <section className="py-24 relative bg-gray-50 dark:bg-dark-bg">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-end mb-12">
                        <div>
                            <h2 className="text-4xl font-black text-slate-900 dark:text-white italic uppercase mb-2">
                                Naves Destacadas
                            </h2>
                            <div className="h-1 w-24 bg-primary-600 rounded-full"></div>
                        </div>
                        <Link to="/search" className="hidden md:flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold hover:underline">
                            Ver Todo el Garaje <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>

                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-400">Cargando naves...</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cars.map((car, index) => (
                                <div
                                    key={car.id}
                                    className={`transition-all duration-700 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                                    style={{
                                        transitionDelay: `${2.2 + index * 0.1}s`
                                    }}
                                >
                                    <CarCard car={car} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-12 text-center md:hidden">
                        <Link to="/search" className="inline-flex items-center gap-2 text-primary-600 dark:text-primary-400 font-bold">
                            Ver Todo el Garaje <ChevronRight className="h-5 w-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
