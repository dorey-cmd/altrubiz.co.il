

export const ContactForm = () => {
    return (
        <section id="contact" className="py-24 bg-gradient-to-br from-indigo-50 to-blue-50 text-right relative overflow-hidden" dir="rtl">
            {/* Decorative Elements */}
            <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 bg-accent/5 rounded-full blur-3xl"></div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <h2 className="text-3xl md:text-5xl font-bold text-dark mb-4">
                        השארת <span className="text-primary">פרטים</span>
                    </h2>
                    <p className="text-gray-600 text-lg max-w-2xl mx-auto">
                        רוצים לשמוע עוד? השאירו פרטים ונחזור אליכם בהקדם.
                    </p>
                </div>

                <div className="bg-white p-2 rounded-2xl shadow-2xl border border-gray-100 overflow-hidden h-[600px]">
                    <iframe
                        src="https://link.altrubiz.co.il/widget/form/QAHIbtkoD9k8JUIs8uKD"
                        style={{ width: '100%', height: '100%', border: 'none', borderRadius: '3px' }}
                        id="inline-QAHIbtkoD9k8JUIs8uKD"
                        data-layout="{'id':'INLINE'}"
                        data-trigger-type="alwaysShow"
                        data-trigger-value=""
                        data-activation-type="alwaysActivated"
                        data-activation-value=""
                        data-deactivation-type="neverDeactivate"
                        data-deactivation-value=""
                        data-form-name="קביעת פגישה באתר"
                        data-height="557"
                        data-layout-iframe-id="inline-QAHIbtkoD9k8JUIs8uKD"
                        data-form-id="QAHIbtkoD9k8JUIs8uKD"
                        title="קביעת פגישה באתר"
                    >
                    </iframe>
                </div>
            </div>
            {/* Script need to be loaded in index.html generally, but sticking to React standards we might need standard script loading. 
                However since the iframe src handles most logic, the script might be for resizing. 
                For now we assume the iframe works independently or we add the script to index.html if needed.
            */}
        </section>
    );
};
