

export const WhatsAppFloat = () => {
    return (
        <a
            href="https://wa.me/972512461800?text=%D7%A9%D7%9C%D7%95%D7%9D%20%D7%A6%D7%95%D7%95%D7%AA%20%D7%90%D7%9C%D7%98%D7%A8%D7%95%D7%91%D7%99%D7%96%2C%20%D7%A4%D7%A0%D7%99%D7%99%D7%94%20%D7%96%D7%95%20%D7%A0%D7%A2%D7%A9%D7%99%D7%AA%20%D7%93%D7%A8%D7%9A%20%D7%94%D7%90%D7%AA%D7%A8%20%D7%95%D7%90%D7%A9%D7%9E%D7%97%20%D7%9C%D7%9E%D7%A2%D7%A0%D7%94."
            className="fixed bottom-5 left-5 flex items-center z-[9999] font-sans no-underline group"
            target="_blank"
            rel="noopener noreferrer"
        >
            <div className="bg-[#25d366] text-white px-4 py-2.5 rounded-full mr-2.5 text-sm shadow-md whitespace-nowrap group-hover:bg-[#20bd5a] transition-colors">
                💬 דברו איתנו בוואטסאפ
            </div>
            <img
                src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
                alt="WhatsApp"
                className="w-[45px] h-[45px] rounded-full shadow-lg group-hover:scale-110 transition-transform"
            />
        </a>
    );
};
