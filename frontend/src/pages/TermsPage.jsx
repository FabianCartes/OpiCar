import React from 'react';

const TermsPage = () => {
    const currentDate = new Date().toLocaleDateString('es-ES', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    return (
        <div className="min-h-screen bg-slate-900 text-slate-300 py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-slate-800/50 rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-700/50 backdrop-blur-sm">

                {/* Header */}
                <div className="mb-12 text-center">
                    <h1 className="text-3xl md:text-4xl font-black text-white italic uppercase mb-4 tracking-tight">
                        Términos de <span className="text-primary-500">Servicio</span>
                    </h1>
                    <p className="text-slate-400">
                        Última actualización: {currentDate}
                    </p>
                </div>

                <div className="space-y-10">
                    {/* Section 1 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">1</span>
                            Aceptación de los Términos
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Al acceder y utilizar OpiCar, usted acepta cumplir con estos Términos de Servicio. Si no está de acuerdo con alguna parte de los términos, no podrá acceder al servicio.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">2</span>
                            Descripción del Servicio
                        </h2>
                        <p className="leading-relaxed pl-11">
                            OpiCar es una plataforma comunitaria que permite a los usuarios buscar información sobre vehículos, compartir reseñas, reportar fallas comunes y subir fotografías de sus propios automóviles.
                        </p>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">3</span>
                            Cuentas de Usuario
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Para utilizar ciertas funciones (como publicar reseñas), debe registrarse. Usted es responsable de mantener la confidencialidad de su contraseña. OpiCar no se hace responsable de ninguna pérdida o daño derivado del incumplimiento de esta seguridad.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">4</span>
                            Contenido Generado por el Usuario
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>Esta es la sección más importante referente a sus fotos y reseñas:</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li><strong className="text-white">Propiedad:</strong> Usted conserva todos los derechos de propiedad sobre las fotos y textos que suba a OpiCar.</li>
                                <li><strong className="text-white">Licencia:</strong> Al subir contenido, usted otorga a OpiCar una licencia mundial, no exclusiva y gratuita para usar, reproducir y mostrar dicho contenido en nuestra plataforma (necesitamos esto legalmente para poder mostrar tu foto en la web).</li>
                                <li><strong className="text-white">Responsabilidad:</strong> Usted declara que posee los derechos de las fotos que sube y que estas no infringen derechos de terceros (copyright).</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">5</span>
                            Conducta Prohibida
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>Al usar OpiCar, usted se compromete a <strong>NO</strong>:</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li>Publicar contenido ofensivo, difamatorio, pornográfico o que incite al odio.</li>
                                <li>Subir fotografías de vehículos ajenos donde la patente (matrícula) sea claramente visible, sin el consentimiento del dueño.</li>
                                <li>Utilizar bots o "scrapers" para extraer datos de nuestra web.</li>
                                <li>Intentar dañar o saturar nuestros servidores.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">6</span>
                            Exención de Responsabilidad
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>El contenido en OpiCar (reseñas, etiquetas de fallas, puntuaciones) se basa en la opinión de los usuarios.</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li><strong className="text-white">No somos mecánicos:</strong> OpiCar no garantiza la exactitud técnica de las reseñas.</li>
                                <li><strong className="text-white">Uso bajo su propio riesgo:</strong> No nos hacemos responsables de decisiones de compra o venta de vehículos basadas en la información encontrada en este sitio. Siempre recomendamos la inspección de un mecánico profesional.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">7</span>
                            Moderación y Terminación
                        </h2>
                        <p className="leading-relaxed pl-11">
                            OpiCar se reserva el derecho de eliminar cualquier contenido (fotos o reseñas) que considere inapropiado y de suspender o banear cuentas de usuarios que violen estos términos, sin previo aviso.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">8</span>
                            Cambios en los Términos
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Podemos modificar estos términos en cualquier momento. Se le notificará sobre cambios importantes, pero es su responsabilidad revisarlos periódicamente.
                        </p>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsPage;
