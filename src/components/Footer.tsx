

export const Footer = () => {
    return (
        <footer id="footer" className="py-12 bg-white text-center border-t border-gray-100" dir="rtl">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center">
                <img
                    className="h-12 w-auto mb-6"
                    src="https://storage.googleapis.com/msgsndr/O8tlYEQIUn4z3qPCt1FX/media/688019c09a4c2d4b4398bf3c.png"
                    alt="לוגו אלטרוביז CRM"
                />

                <p className="text-gray-600 mb-6 font-medium">
                    אלטרוביז CRM. כל מה שצריך כדי להכניס את השיטה לסיסטם.
                </p>

                <div className="flex gap-6 mb-6">
                    <a href="https://altrubiz.co.il/privacy" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                        מדיניות פרטיות
                    </a>
                    <a href="https://altrubiz.co.il/termsofuse" target="_blank" rel="noopener noreferrer" className="text-gray-500 hover:text-primary transition-colors">
                        תנאי שימוש
                    </a>
                </div>

                <p className="text-gray-400 text-sm">
                    © AltruBiz CRM
                </p>
            </div>
        </footer>
    );
};
