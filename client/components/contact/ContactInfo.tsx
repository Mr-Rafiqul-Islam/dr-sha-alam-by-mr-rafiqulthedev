import Image from "next/image";
import Link from "next/link";

export default function ContactInfo() {
  return (
    <div className="space-y-10">
      <div className="bg-primary dark:bg-primary-dark p-8 md:p-10 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl"></div>
        <h2 className="text-2xl font-bold mb-8 relative z-10">Contact Information</h2>
        <div className="space-y-8 relative z-10">
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-xl">location_on</span>
            </div>
            <div>
              <p className="font-bold text-lg mb-1 text-accent">Clinic Address</p>
              <p className="text-gray-100 leading-relaxed">
                House 42, Road 7, Sector 3<br/>
                Uttara, Dhaka - 1230<br/>
                Bangladesh
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-xl">schedule</span>
            </div>
            <div>
              <p className="font-bold text-lg mb-1 text-accent">Chamber Hours</p>
              <p className="text-gray-100 leading-relaxed">
                Sat - Thu: 10:00 AM - 9:00 PM<br/>
                <span className="text-red-200 font-medium">Friday: Closed</span>
              </p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-xl">call</span>
            </div>
            <div>
              <p className="font-bold text-lg mb-1 text-accent">Phone &amp; WhatsApp</p>
              <p className="text-gray-100 mb-1 font-mono text-lg">+880 1701 313 001</p>
              <p className="text-gray-100 font-mono text-lg">+880 1312 353 577</p>
            </div>
          </div>
          <div className="flex items-start gap-5">
            <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0 backdrop-blur-sm border border-white/10">
              <span className="material-symbols-outlined text-xl">mail</span>
            </div>
            <div>
              <p className="font-bold text-lg mb-1 text-accent">Email Us</p>
              <p className="text-gray-100">info@drshahalam.com</p>
              <p className="text-gray-100">appointment@drshahalam.com</p>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full h-[400px] rounded-3xl overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700 relative group">
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800">
          <Image alt="Map Location Placeholder" className="object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" src="https://lh3.googleusercontent.com/aida-public/AB6AXuC_XhY7dbV--FNwz0DYaTdRVQBV5ha5qA3L3XmuwNFJX1yy41E10_9m10F2DQ0ABe1GjW0GeBCf629me4oyOPdwKV9vh5gRLKBkqx6OXbTWN2CmAqxR6BG7PbsPgAZ5Ot6zj6CUtcCTFxC15Xrrh3ZyIG3cTPwh06eOF6CKbuwtGd_SWTGoxjnzMowTIHoFqS3sXLeiZzdFSIZHEaSE5wAoNYUILy-fa0s7D-WIx4F33zdJvRwpDP6yUZiV2yH4hxMvuSPtnzfboRk" fill sizes="(max-width: 768px) 100vw, 50vw" />
          <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors duration-300"></div>
        </div>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 w-max max-w-[90%]">
          <Link className="bg-white text-primary hover:text-accent font-bold py-3 px-6 rounded-full shadow-lg flex items-center gap-2 hover:scale-105 transition-all duration-300" href="https://maps.app.goo.gl/5SxzDjQRYoSS7uS98" target="_blank" rel="noopener noreferrer">
            <span className="material-symbols-outlined text-accent">directions</span>
            Get Directions to Clinic
          </Link>
        </div>
      </div>
    </div>
  );
}
