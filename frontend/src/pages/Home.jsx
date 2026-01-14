import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShieldCheck, Zap, Award, ChevronRight, Gauge, Flame, Trophy } from 'lucide-react';
import CarCard from '../components/CarCard';
import { getPopularCars } from '../services/car.service';

import FloatingDecorations from '../components/FloatingDecorations';

const Home = () => {
    const [cars, setCars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);
    const [cardsVisible, setCardsVisible] = useState(false);
    const cardsRef = useRef(null);

    useEffect(() => {
        const fetchCars = async () => {
            try {
                const data = await getPopularCars(3);
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

                    {/* Animated gradient orbs with Rising Smoke Effect */}
                    {/* Top Left - Red Smoke */}
                    <div className="absolute top-0 left-0 w-96 h-96 pointer-events-none">
                        {/* Base Core */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-60' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--color-primary-600) 0%, transparent 70%)',
                                filter: 'blur(80px)',
                                animation: isLoaded ? 'smoke-blob 20s ease-in-out infinite alternate' : 'none'
                            }}
                        ></div>
                        {/* Rising Puff 1 */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-40' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                animation: isLoaded ? 'smoke-rise 4s ease-out infinite' : 'none',
                                animationDelay: '0s'
                            }}
                        ></div>
                        {/* Rising Puff 2 */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-30' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--color-primary-400) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                animation: isLoaded ? 'smoke-rise 5s ease-out infinite' : 'none',
                                animationDelay: '2.5s'
                            }}
                        ></div>
                    </div>

                    {/* Bottom Right - White Smoke */}
                    <div className="absolute bottom-0 right-0 w-96 h-96 pointer-events-none">
                        {/* Base Core */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-40 dark:opacity-20' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--smoke-white) 0%, transparent 70%)',
                                filter: 'blur(80px)',
                                animation: isLoaded ? 'smoke-blob 25s ease-in-out infinite alternate-reverse' : 'none'
                            }}
                        ></div>
                        {/* Rising Puff 1 */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-30 dark:opacity-10' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--smoke-white) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                animation: isLoaded ? 'smoke-rise 6s ease-out infinite' : 'none',
                                animationDelay: '1s'
                            }}
                        ></div>
                        {/* Rising Puff 2 */}
                        <div
                            className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-20 dark:opacity-5' : 'opacity-0'}`}
                            style={{
                                background: 'radial-gradient(circle, var(--smoke-white) 0%, transparent 70%)',
                                filter: 'blur(60px)',
                                animation: isLoaded ? 'smoke-rise 7s ease-out infinite' : 'none',
                                animationDelay: '4s'
                            }}
                        ></div>
                    </div>
                </div>

                {/* Floating Parallax Decorations - removed from here */}

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
                            {React.useMemo(() => <AnimatedText text="La voz de los " delay={0.3} />, [isLoaded])}
                        </div>
                        <div className="inline-block overflow-visible pr-6">
                            {React.useMemo(() => <AnimatedText text="Conductores" delay={0.7} gradient={true} />, [isLoaded])}
                        </div>
                    </h1>

                    {/* Description */}
                    <p
                        className={`text-xl md:text-2xl mb-10 text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-light leading-relaxed transition-all duration-1000 delay-[1200ms] ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
                    >
                        Conoce la realidad antes de comprar. Accede a reseñas honestas, fotos de usuarios y reportes de fallas detallados por la comunidad más activa.
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

            {/* Bento Grid Features Section */}
            <section ref={cardsRef} className="py-24 bg-white dark:bg-[#0a0a0a] relative overflow-hidden">
                {/* Floating Decorations Background */}
                <FloatingDecorations />

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white italic uppercase mb-4">
                            Tu Guía en el Mundo <span className="text-primary-600">Automotriz</span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 h-auto md:h-[600px]">
                        {/* Large Feature - Community (Spans 2 cols, 2 rows) */}
                        <div className={`md:col-span-2 md:row-span-2 group relative rounded-[2rem] overflow-hidden bg-slate-100 dark:bg-[#121212] border border-slate-200 dark:border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/30 delay-100 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                            <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity transform group-hover:scale-110 duration-700">
                                <Trophy className="h-64 w-64 text-primary-600" />
                            </div>
                            <div className="relative h-full flex flex-col justify-end p-8 md:p-12">
                                <div className="h-16 w-16 rounded-2xl bg-primary-100 dark:bg-primary-900/30 flex items-center justify-center mb-6 text-primary-600 dark:text-primary-400 group-hover:scale-110 transition-transform duration-300">
                                    <Trophy className="h-8 w-8" />
                                </div>
                                <h3 className="text-3xl font-black text-slate-900 dark:text-white mb-4 italic uppercase">Experiencias Reales</h3>
                                <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed mb-6">
                                    No compres a ciegas. Lee reseñas honestas de propietarios reales, conoce las fallas comunes y descubre la verdad sobre cada auto antes de invertir tu dinero.
                                </p>
                            </div>
                        </div>

                        {/* Tall Feature - Information (Spans 1 col, 2 rows) */}
                        <div className={`md:col-span-1 md:row-span-2 group relative rounded-[2rem] overflow-hidden bg-slate-900 text-white shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl delay-200 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80"></div>
                            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4f46e5 1px, transparent 1px)', backgroundSize: '20px 20px' }}></div>

                            <div className="relative h-full flex flex-col p-8">
                                <div className="flex-1 flex items-center justify-center">
                                    <div className="relative h-40 w-40 rounded-full border-4 border-white/10 flex items-center justify-center group-hover:scale-105 transition-transform duration-500">
                                        <div className="absolute inset-0 border-4 border-t-primary-500 border-r-primary-500 border-b-transparent border-l-transparent rounded-full rotate-45 group-hover:rotate-90 transition-transform duration-700"></div>
                                        <span className="text-4xl font-black italic">INFO</span>
                                    </div>
                                </div>
                                <div>
                                    <h3 className="text-2xl font-black mb-2 italic uppercase">Información</h3>
                                    <p className="text-slate-300 text-sm">
                                        Datos técnicos precisos para que sepas exactamente qué estás comprando.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Small Feature - Trust (Spans 1 col, 1 row) */}
                        <div className={`md:col-span-1 md:row-span-1 group relative rounded-[2rem] overflow-hidden bg-primary-100 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-900/20 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/30 delay-300 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity duration-300">
                                <ShieldCheck className="h-32 w-32 text-primary-600" />
                            </div>
                            <div className="relative h-full p-8 flex flex-col justify-center">
                                <ShieldCheck className="h-10 w-10 text-primary-600 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 italic uppercase">Seguridad</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Evita estafas y autos problemáticos con nuestra guía.
                                </p>
                            </div>
                        </div>

                        {/* Small Feature - Community (Spans 1 col, 1 row) */}
                        <div className={`md:col-span-1 md:row-span-1 group relative rounded-[2rem] overflow-hidden bg-slate-50 dark:bg-[#121212] border border-slate-200 dark:border-white/5 shadow-xl transition-all duration-500 hover:-translate-y-1 hover:shadow-2xl hover:border-primary-500/30 delay-400 ${cardsVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>
                            <div className="relative h-full p-8 flex flex-col justify-center">
                                <Award className="h-10 w-10 text-orange-500 mb-4 group-hover:scale-110 transition-transform duration-300" />
                                <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 italic uppercase">Comunidad</h3>
                                <p className="text-sm text-slate-600 dark:text-slate-400">
                                    Comparte, pregunta y aprende de otros apasionados.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Infinite Marquee Strip */}
            <div className="bg-primary-500/90 py-4 overflow-hidden rotate-1 transform scale-105 shadow-lg relative z-20">
                <div className="flex animate-marquee whitespace-nowrap w-max">
                    {[...Array(20)].map((_, i) => (
                        <span key={i} className="text-white font-black italic uppercase text-2xl mx-8 flex items-center gap-4">
                            CONFIABLE <span className="h-2 w-2 bg-white rounded-full"></span>
                            INFORMATIVO <span className="h-2 w-2 bg-white rounded-full"></span>
                            ACTUALIZADO <span className="h-2 w-2 bg-white rounded-full"></span>
                        </span>
                    ))}
                </div>
            </div>

            {/* Featured Cars Section with Patterned Background */}
            <section className="py-32 relative bg-gray-100 dark:bg-dark-bg overflow-hidden">
                {/* Subtle Rising Smoke Effects for Borders */}
                {/* Top Right - Subtle Gray/White Smoke */}
                <div className="absolute top-[-10%] right-[-5%] w-80 h-80 pointer-events-none z-0">
                    <div
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-20 dark:opacity-5' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle, rgba(200,200,200,0.8) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            animation: isLoaded ? 'smoke-blob 25s ease-in-out infinite alternate' : 'none'
                        }}
                    ></div>
                    <div
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-10 dark:opacity-0' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle, rgba(200,200,200,0.6) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                            animation: isLoaded ? 'smoke-rise 8s ease-out infinite' : 'none',
                            animationDelay: '2s'
                        }}
                    ></div>
                </div>

                {/* Bottom Left - Subtle Primary Smoke */}
                <div className="absolute bottom-[-10%] left-[-5%] w-80 h-80 pointer-events-none z-0">
                    <div
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-10 dark:opacity-5' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle, var(--color-primary-500) 0%, transparent 70%)',
                            filter: 'blur(80px)',
                            animation: isLoaded ? 'smoke-blob 22s ease-in-out infinite alternate-reverse' : 'none'
                        }}
                    ></div>
                    <div
                        className={`absolute inset-0 transition-all duration-[2000ms] ease-out ${isLoaded ? 'opacity-5 dark:opacity-0' : 'opacity-0'}`}
                        style={{
                            background: 'radial-gradient(circle, var(--color-primary-400) 0%, transparent 70%)',
                            filter: 'blur(60px)',
                            animation: isLoaded ? 'smoke-rise 9s ease-out infinite' : 'none',
                            animationDelay: '1s'
                        }}
                    ></div>
                </div>

                {/* Dot Pattern Background */}
                <div className="absolute inset-0 opacity-[0.03] dark:opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#000 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
                        <div>
                            <span className="text-primary-600 font-bold tracking-wider uppercase text-sm mb-2 block">Selección Popular</span>
                            <h2 className="text-5xl font-black text-slate-900 dark:text-white italic uppercase">
                                Autos Preferidos
                            </h2>
                        </div>
                        <Link to="/search" className="group flex items-center gap-3 px-6 py-3 bg-white dark:bg-white/5 rounded-full shadow-md hover:shadow-lg transition-all border border-gray-100 dark:border-white/10">
                            <span className="font-bold text-slate-900 dark:text-white group-hover:text-primary-600 transition-colors">Ver Todo el Inventario</span>
                            <div className="h-8 w-8 rounded-full bg-primary-50 dark:bg-primary-900/30 flex items-center justify-center group-hover:bg-primary-600 transition-colors">
                                <ChevronRight className="h-4 w-4 text-primary-600 dark:text-primary-400 group-hover:text-white transition-colors" />
                            </div>
                        </Link>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-64">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {cars.map((car, index) => (
                                <div
                                    key={car.id}
                                    className={`transform transition-all duration-700 hover:-translate-y-2 ${isLoaded ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}
                                    style={{
                                        transitionDelay: `${0.2 + index * 0.1}s`
                                    }}
                                >
                                    <CarCard car={car} />
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="mt-20 text-center">
                        <div className="inline-block p-1 rounded-full bg-gradient-to-r from-gray-200 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                            <Link to="/search" className="block px-12 py-4 bg-white dark:bg-[#121212] rounded-full text-slate-900 dark:text-white font-bold hover:bg-gray-50 dark:hover:bg-gray-900 transition-colors">
                                ¿No encuentras lo que buscas? <span className="text-primary-600 ml-2">Explorar más autos</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Home;
