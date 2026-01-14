import React from 'react';

const LegalPage = () => {
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
                        Política de <span className="text-primary-500">Privacidad</span>
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
                            Introducción
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Bienvenido a OpiCar. En OpiCar respetamos su privacidad y estamos comprometidos a proteger sus datos personales. Esta política de privacidad le informará sobre cómo cuidamos sus datos cuando visita nuestro sitio web y le informará sobre sus derechos de privacidad.
                        </p>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">2</span>
                            Los datos que recopilamos sobre usted
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>Para brindar nuestro servicio de reseñas y comunidad automotriz, podemos recopilar, usar, almacenar y transferir diferentes tipos de datos personales:</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li><strong className="text-white">Datos de Identidad:</strong> Incluye nombre de usuario o apodo.</li>
                                <li><strong className="text-white">Datos de Contacto:</strong> Incluye su dirección de correo electrónico (necesaria para el registro y recuperación de cuenta).</li>
                                <li><strong className="text-white">Datos de Contenido (Crucial):</strong> Incluye las fotografías de vehículos, reseñas, comentarios y etiquetas de fallas que usted sube voluntariamente a la plataforma.</li>
                                <li><strong className="text-white">Datos Técnicos:</strong> Dirección IP, tipo de navegador y versión, sistema operativo y plataforma que utiliza para acceder a este sitio web.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">3</span>
                            Cómo usamos sus datos
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>Solo utilizaremos sus datos personales cuando la ley lo permita. OpiCar utiliza sus datos para:</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li>Gestionar su registro como usuario.</li>
                                <li>Publicar sus reseñas y fotos: Entienda que al subir una reseña o foto de un auto, esta información se vuelve pública para ayudar a otros usuarios de la comunidad.</li>
                                <li>Permitirle participar en funciones interactivas (como guardar favoritos o dar "me gusta").</li>
                                <li>Mejorar nuestro sitio web y la experiencia del usuario.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">4</span>
                            Sobre las Fotos y la Privacidad de Terceros
                        </h2>
                        <div className="pl-11 space-y-4">
                            <p>Al subir fotografías a OpiCar, usted garantiza que tiene el derecho de compartirlas.</p>
                            <div className="bg-orange-900/20 border border-orange-500/20 p-4 rounded-xl">
                                <p className="text-orange-200 text-sm">
                                    <strong className="text-orange-400 block mb-1">⚠️ Patentes/Matrículas</strong>
                                    Recomendamos encarecidamente difuminar o tapar las patentes (placas) de los vehículos antes de subirlas para proteger su privacidad y la de otros.
                                </p>
                            </div>
                            <p>OpiCar no se hace responsable por la información personal visible en las fotografías cargadas por los usuarios, aunque nos reservamos el derecho de eliminar contenido que infrinja normas de seguridad.</p>
                        </div>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">5</span>
                            Divulgación de sus datos (Terceros)
                        </h2>
                        <div className="pl-11">
                            <p className="mb-4">OpiCar no vende sus datos personales. Sin embargo, compartimos datos con proveedores de servicios técnicos necesarios para operar:</p>
                            <ul className="list-disc ml-5 space-y-2 marker:text-primary-500">
                                <li>Proveedores de alojamiento en la nube (ej. base de datos).</li>
                                <li>Servicios de almacenamiento de imágenes (ej. Cloudinary) para alojar las fotos que usted sube.</li>
                            </ul>
                        </div>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">6</span>
                            Seguridad de los datos
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Hemos implementado medidas de seguridad apropiadas para evitar que sus datos personales se pierdan accidentalmente, se usen o se acceda a ellos de forma no autorizada. Las contraseñas se almacenan encriptadas (hasheadas) y nunca son visibles para los administradores.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">7</span>
                            Sus derechos legales
                        </h2>
                        <p className="leading-relaxed pl-11">
                            Dependiendo de su ubicación, usted tiene derechos sobre sus datos personales, incluyendo el derecho a solicitar acceso, corrección, borrado o transferencia de sus datos. Si desea eliminar su cuenta y todas sus fotos/reseñas, puede contactarnos.
                        </p>
                    </section>

                    {/* Section 8 */}
                    <section>
                        <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-3">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-900/50 text-primary-500 text-sm font-black border border-primary-500/20">8</span>
                            Contacto
                        </h2>
                        <div className="pl-11 bg-slate-800 rounded-xl p-6 border border-slate-700">
                            <p className="mb-2">Si tiene alguna pregunta sobre esta política de privacidad, por favor contáctenos en:</p>
                            <ul className="space-y-2 text-slate-300">
                                <li><strong className="text-white">Correo electrónico:</strong> opicarcontact@gmail.com</li>
                                <li><strong className="text-white">Sitio Web:</strong> OpiCar</li>
                            </ul>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default LegalPage;
