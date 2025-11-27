import React, { useEffect, useRef, useState } from "react";
import AdsenseBanner from "./components/AdsenseBanner";
import CompressCard from "./CompressCard";
import CompressImageCard from "./CompressImageCard";
import JpgToPdfCard from "./JpgToPdfCard";
import PdfToJpgCard from "./PdfToJpgCard";
import PdfToPngCard from "./PdfToPngCard";
import SplitPdfCard from "./SplitPdfCard";
import PdfToWordCard from "./PdfToWordCard";
import WordToPdfCard from "./WordToPdfCard";
import DeletePdfPagesCard from "./DeletePdfPagesCard";
import RotatePdfPagesCard from "./RotatePdfPagesCard";
import PdfReaderCard from "./PdfReaderCard";
import ExtractPdfPagesCard from "./ExtractPdfPagesCard";

const TOOL_MENU = [
  {
    id: "merge",
    title: "Merge PDF",
    summary: "Combine multiple PDFs into one organized document.",
    accent: "#4f46e5",
  },
  {
    id: "compress",
    title: "Compress PDF",
    summary: "Shrink large PDFs while keeping them readable.",
    accent: "#0ea5e9",
  },
  {
    id: "compressImage",
    title: "Compress Image",
    summary: "Optimize JPG and PNG files for the web in seconds.",
    accent: "#10b981",
  },
  {
    id: "jpgToPdf",
    title: "Images to PDF",
    summary: "Arrange photos or scans into a clean PDF.",
    accent: "#f59e0b",
  },
  {
    id: "pdfToJpg",
    title: "PDF to JPG",
    summary: "Export every page as a high-quality JPG.",
    accent: "#f97316",
  },
  {
    id: "pdfToPng",
    title: "PDF to PNG",
    summary: "Save pages as sharp, transparency-friendly PNGs.",
    accent: "#7c3aed",
  },
  {
    id: "split",
    title: "Split PDF",
    summary: "Extract page ranges into separate files.",
    accent: "#ef4444",
  },
  {
    id: "deletePages",
    title: "Delete Pages",
    summary: "Remove unwanted pages to tidy your document.",
    accent: "#14b8a6",
  },
  {
    id: "rotatePages",
    title: "Rotate Pages",
    summary: "Fix sideways pages in bulk with one click.",
    accent: "#a855f7",
  },
  {
    id: "extractPages",
    title: "Extract Pages",
    summary: "Pull specific pages into a new PDF.",
    accent: "#0ea5e9",
  },
  {
    id: "pdfReader",
    title: "PDF Reader",
    summary: "Preview PDFs without leaving your browser.",
    accent: "#2563eb",
  },
  {
    id: "pdfToWord",
    title: "PDF to Word",
    summary: "Create editable DOCX files from PDFs.",
    accent: "#c026d3",
  },
  {
    id: "wordToPdf",
    title: "Word to PDF",
    summary: "Convert DOCX files into fixed, shareable PDFs.",
    accent: "#22c55e",
  },
];

const TOOL_DETAILS = {
  merge: {
    title: "Merge PDF guide",
    intro:
      "Bring contracts, invoices, or class notes together in one tidy PDF so it is easier to store and share.",
    paragraphs: [
      "Drag to reorder before merging, then download a single file generated right in your browser for extra privacy.",
      "Perfect for teams preparing a handoff package or students combining study material into one pack.",
    ],
    bulletTitle: "Great for",
    bullets: [
      "Creating one report from slides, drawings, and supporting PDFs.",
      "Keeping monthly statements or pay slips in one organized file.",
      "Preparing documents for e-signature with the right order.",
      "Sharing multiple scans as a single link or attachment.",
    ],
    checklistTitle: "Before you merge",
    checklist: [
      "Check file names so the order makes sense.",
      "Add a cover page or summary slide if you need a quick intro.",
      "Remove ads or blank pages first for a lighter result.",
      "Review the final size and run compression if needed.",
    ],
  },
  compress: {
    title: "Compress PDF tips",
    intro:
      "Reduce PDF size without losing clarity so you can send files quickly and stay under email limits.",
    paragraphs: [
      "Presentations, catalogs, and high-resolution scans often get heavy. Compression strips excess metadata while keeping text readable.",
      "A smaller file uploads faster and saves mobile data for your recipients.",
    ],
    bulletTitle: "Use it when",
    bullets: [
      "Submitting tenders or applications with strict file limits.",
      "Emailing brochures or portfolios that must stay sharp.",
      "Archiving lots of PDFs in limited cloud storage.",
      "Uploading assignments to LMS platforms without errors.",
    ],
    checklistTitle: "Quality checklist",
    checklist: [
      "Remove duplicate pages before compressing.",
      "Try grayscale for scan-heavy documents.",
      "Note the final size if you plan to share offline.",
      "Spot-check a few pages to ensure images still look good.",
    ],
  },
  compressImage: {
    title: "Image compression overview",
    intro:
      "Resize large photos to web-friendly weights while preserving the colors you expect.",
    paragraphs: [
      "The tool cleans unnecessary metadata and balances quality automatically for both JPG and PNG files.",
      "Great for blog covers, product photos, or social posts without juggling design software.",
    ],
    bulletTitle: "Best suited for",
    bullets: [
      "E-commerce images that must load quickly.",
      "Portfolio or blog visuals that still need to look crisp.",
      "Email attachments that risk hitting size caps.",
      "Social media graphics that should match platform guidelines.",
    ],
    checklistTitle: "Quick prep list",
    checklist: [
      "Keep a copy of the original just in case.",
      "Use PNG output if you need transparency preserved.",
      "Rename files before uploading to stay organized.",
      "For headers, keeping widths around 1200px is usually enough.",
    ],
  },
  jpgToPdf: {
    title: "Images to PDF guide",
    intro:
      "Turn photos, scans, or screenshots into a polished document ready to share or print.",
    paragraphs: [
      "Images are added in the upload order, and you can reorder them before saving.",
      "Different sizes are centered automatically so every page looks clean.",
    ],
    bulletTitle: "Ideal for",
    bullets: [
      "Freelancers compiling receipts or invoices.",
      "Students organizing lecture photos into one PDF.",
      "Artists presenting sketches to clients.",
      "Field teams reporting site photos.",
    ],
    checklistTitle: "Better PDFs, faster",
    checklist: [
      "Fix image orientation before uploading.",
      "Adjust brightness to reduce scanning artifacts.",
      "Preview edges after ordering to avoid unwanted borders.",
      "Use consistent file names when creating several PDFs for one project.",
    ],
  },
  pdfToJpg: {
    title: "PDF to JPG details",
    intro: "Convert slides or reports into high-resolution JPGs with one click.",
    paragraphs: [
      "Each page downloads as its own JPG inside a ZIP for easy sharing.",
      "Great for slideshows, infographics, or quick social posts.",
    ],
    bulletTitle: "Practical uses",
    bullets: [
      "Sharing presentation pages on LinkedIn or a blog.",
      "Posting charts or tables as single images.",
      "Turning training material into classroom-ready slides.",
      "Building carousel posts by exporting pages separately.",
    ],
    checklistTitle: "Clean JPG checklist",
    checklist: [
      "Trim excess white margins in the PDF first.",
      "Check brightness modes for colorful pages.",
      "Simplify file names in the ZIP before sending.",
      "Resize images if they will be viewed on small screens.",
    ],
  },
  pdfToPng: {
    title: "PDF to PNG guide",
    intro:
      "Export pages as PNG when you need transparency support or crisp UI mockups.",
    paragraphs: [
      "Backgrounds stay clean so layered designs are presentation-ready.",
      "Vector-heavy PDFs still render sharply after export.",
    ],
    bulletTitle: "Great for",
    bullets: [
      "Sharing UI/UX design pages.",
      "Creating slides with transparent backgrounds.",
      "Making overlays for video editors.",
      "Archiving technical drawings as images.",
    ],
    checklistTitle: "After exporting",
    checklist: [
      "Check PNG file sizes before sharing.",
      "Confirm transparent areas look correct.",
      "Resize for your slide dimensions if needed.",
      "Group images by topic to keep folders tidy.",
    ],
  },
  split: {
    title: "Split PDF guide",
    intro:
      "Break long PDFs into smaller parts so you can share only the sections people need.",
    paragraphs: [
      "Choose page ranges and get each one as its own PDF for targeted sharing.",
      "Handy for exam packs, book chapters, or review workflows.",
    ],
    bulletTitle: "Use cases",
    bullets: [
      "Sending only the relevant chapter of a report.",
      "Preparing contract appendices as separate files.",
      "Splitting study materials by topic.",
      "Assigning different sections to teammates for review.",
    ],
    checklistTitle: "Faster splits",
    checklist: [
      "Note page ranges before you start.",
      "Double-check numbering after export.",
      "Repeat the tool for multiple ranges in one file.",
      "Name outputs clearly, e.g., 'Chapter-2-Analysis.pdf'.",
    ],
  },
  deletePages: {
    title: "Delete pages overview",
    intro:
      "Remove draft or ad pages so your PDF stays focused and lightweight.",
    paragraphs: [
      "Selected pages disappear instantly and a fresh PDF is ready in moments.",
      "Cutting unnecessary pages reduces mistakes before formal submissions.",
    ],
    bulletTitle: "Why use it?",
    bullets: [
      "Clean outdated appendices from contracts.",
      "Drop blank pages from scanned documents.",
      "Hide ad-heavy pages before sharing externally.",
      "Ship shorter guides with only the essentials.",
    ],
    checklistTitle: "Quick review list",
    checklist: [
      "Confirm page numbers twice before deleting.",
      "Back up pages that contain important notes.",
      "Ensure remaining pages stay in the right order.",
      "Preview the result in a PDF reader after export.",
    ],
  },
  rotatePages: {
    title: "Rotate pages guide",
    intro:
      "Fix sideways scans or landscape diagrams in seconds with bulk rotation.",
    paragraphs: [
      "Apply 90° or 180° turns to keep every page aligned before sharing.",
      "Especially helpful for technical drawings or photo-heavy reports.",
    ],
    bulletTitle: "Where it helps",
    bullets: [
      "Correcting misaligned payroll or contract scans.",
      "Making wide posters or charts easier to read.",
      "Aligning landscape diagrams in lecture notes.",
      "Keeping all pages pointed the same way for presentations.",
    ],
    checklistTitle: "Angle checklist",
    checklist: [
      "Test the rotation on one page first.",
      "Use bulk select when every page needs the same angle.",
      "Check page numbers after rotating.",
      "If text sits near the edge, review margins before sending.",
    ],
  },
  extractPages: {
    title: "Extract pages guidance",
    intro:
      "Pull only the relevant section from a large PDF to share faster and protect sensitive info.",
    paragraphs: [
      "Selected ranges become a new PDF so you can share non-sensitive parts confidently.",
      "Speeds up collaboration when teams only need a specific slice of the file.",
    ],
    bulletTitle: "Best scenarios",
    bullets: [
      "Sending just the executive summary to a client.",
      "Sharing certain units from course materials.",
      "Omitting confidential appendices in legal docs.",
      "Breaking technical drawing sets into smaller folders.",
    ],
    checklistTitle: "Secure sharing steps",
    checklist: [
      "Mark the exact pages to include ahead of time.",
      "Name the exported file to reflect its scope.",
      "Verify sensitive pages are excluded.",
      "Skim the final PDF before sending.",
    ],
  },
  pdfReader: {
    title: "About the PDF reader",
    intro:
      "Navigate PDFs quickly without installing extra apps.",
    paragraphs: [
      "Zoom, jump to pages, and search text even in long documents.",
      "A mobile-friendly layout keeps text legible on small screens.",
    ],
    bulletTitle: "Tips for use",
    bullets: [
      "Open files on a shared screen during meetings.",
      "Verify a document before downloading the final copy.",
      "Search long reports to jump straight to the right section.",
      "View slide decks like a presentation.",
    ],
    checklistTitle: "Better reading experience",
    checklist: [
      "Increase browser zoom if text feels small.",
      "Try night mode in low-light rooms.",
      "Note page numbers for quick return trips.",
      "Edit with the right tool after reviewing.",
    ],
  },
  pdfToWord: {
    title: "PDF to Word insights",
    intro:
      "Generate editable DOCX files so you can refresh or repurpose PDF content.",
    paragraphs: [
      "Text flow, tables, and headings are kept as close as possible to the original.",
      "Reduces retyping for proposals, forms, or long reports.",
    ],
    bulletTitle: "When to use",
    bullets: [
      "Updating legacy agreements into new versions.",
      "Adding notes to research papers without rebuilding layouts.",
      "Adapting client presentations into another language.",
      "Tweaking form text or table structures quickly.",
    ],
    checklistTitle: "Clean DOCX checklist",
    checklist: [
      "Ensure source images are high quality for best results.",
      "Review heading alignment after conversion.",
      "Adjust table borders directly in Word if needed.",
      "Remove personal data before sharing the DOCX.",
    ],
  },
  wordToPdf: {
    title: "Word to PDF guide",
    intro:
      "Turn documents into fixed-layout PDFs that look consistent everywhere.",
    paragraphs: [
      "Common fonts are embedded automatically to prevent layout issues.",
      "Reliable for forms, offers, resumes, or any file you need to lock in place.",
    ],
    bulletTitle: "Practical uses",
    bullets: [
      "Sending applications or proposals in a professional format.",
      "Sharing invoice or delivery templates.",
      "Delivering course material that looks the same on all devices.",
      "Freezing layout before sending documents for signature.",
    ],
    checklistTitle: "Smooth PDF checklist",
    checklist: [
      "Confirm custom fonts are installed in the source file.",
      "Pick the right page size (A4, Letter) for your audience.",
      "Keep image resolution around 150-300 DPI.",
      "Skim the final PDF before you share it.",
    ],
  },
};

const MAX_FILES = 10; // Max number of files
const MAX_TOTAL_MB = 50; // Max total size (MB)

function App() {
  const [activeTab, setActiveTab] = useState("merge");
  const [files, setFiles] = useState([]);
  const [isMerging, setIsMerging] = useState(false);
  const [error, setError] = useState("");
  const [dragIndex, setDragIndex] = useState(null);
  const [usageCount, setUsageCount] = useState(0);
  const [activePage, setActivePage] = useState("home");
  const fileInputRef = useRef(null);
  const toolContentRef = useRef(null);
  const hasMountedRef = useRef(false);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }

    if (toolContentRef.current) {
      toolContentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [activeTab]);

  const handleTabChange = (id) => {
    setActiveTab(id);
  };

  const handleNavigate = (page) => {
    setActivePage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleFileChange = (e) => {
    setError("");
    const selected = Array.from(e.target.files || []);
    const pdfs = selected.filter((f) => f.type === "application/pdf");

    if (pdfs.length === 0) {
      setError("Please select PDF files only.");
      return;
    }

    // Append to existing files
    let combined = [...files, ...pdfs];

    if (combined.length > MAX_FILES) {
      setError(
        `You can upload up to ${MAX_FILES} PDF files. Extra files were ignored.`
      );
      combined = combined.slice(0, MAX_FILES);
    }

    const totalBytes = combined.reduce((sum, f) => sum + f.size, 0);
    const totalMB = totalBytes / 1024 / 1024;

    if (totalMB > MAX_TOTAL_MB) {
      setError(
        `Total file size cannot exceed ${MAX_TOTAL_MB} MB. Please choose fewer or smaller files.`
      );
      return;
    }

    setFiles(combined);
  };

  const handleMerge = async () => {
    setError("");
    if (!files.length) {
      setError("Please select at least one PDF file.");
      return;
    }

    setIsMerging(true);

    try {
      const formData = new FormData();
      files.forEach((file) => {
        formData.append("files", file);
      });

      const API_URL = import.meta.env.VITE_API_URL || "http://localhost:4000";

      const res = await fetch(`${API_URL}/merge`, {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Something went wrong.");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "merged.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setUsageCount((prev) => prev + 1);
    } catch (err) {
      console.error(err);
      setError(err.message || "Failed to merge PDFs.");
    } finally {
      setIsMerging(false);
    }
  };

  const handleClear = () => {
    setFiles([]);
    setError("");
    setDragIndex(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleRemoveFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, i) => i !== indexToRemove));
  };

  const renderNavLink = (page, label) => {
    const isActive = activePage === page;

    return (
      <button
        key={page}
        onClick={() => handleNavigate(page)}
        style={{
          padding: "8px 12px",
          borderRadius: "10px",
          border: "1px solid" + (isActive ? " #4f46e5" : " #e5e7eb"),
          background: isActive ? "#eef2ff" : "#ffffff",
          color: isActive ? "#312e81" : "#374151",
          fontWeight: 600,
          fontSize: "13px",
          cursor: "pointer",
          boxShadow: isActive
            ? "0 10px 24px rgba(79,70,229,0.18)"
            : "0 4px 12px rgba(15,23,42,0.06)",
          transition: "all 0.15s ease",
        }}
      >
        {label}
      </button>
    );
  };

  const renderStaticPage = () => {
    const cardStyle = {
      background: "white",
      borderRadius: "16px",
      border: "1px solid #e5e7eb",
      padding: "22px",
      boxShadow: "0 18px 36px rgba(15,23,42,0.08)",
      marginBottom: "14px",
    };

    const headingStyle = {
      marginTop: 0,
      marginBottom: "12px",
      fontSize: "22px",
      color: "#0f172a",
    };

    const paragraphStyle = {
      marginTop: 0,
      marginBottom: "12px",
      color: "#4b5563",
      lineHeight: 1.7,
      fontSize: "14px",
    };

    const listStyle = {
      paddingLeft: "18px",
      marginTop: 0,
      marginBottom: "12px",
      color: "#4b5563",
      fontSize: "14px",
      lineHeight: 1.7,
    };

    switch (activePage) {
      case "blog":
        return (
          <section style={cardStyle} aria-label="Kılavuz ve ipuçları sayfası">
            <h2 style={headingStyle}>Blog / Kılavuz &amp; İpuçları</h2>
            <p style={paragraphStyle}>
              PDF ve görsel araçlarımızı en verimli şekilde kullanabilmeniz için uzun soluklu
              bir rehber hazırladık. İster sözleşme, ister sunum, ister ürün kataloğu yönetin;
              burada yer alan adımlar PDFFreeTool deneyiminizi hızlandırmak ve hatalardan
              kaçınmak için tasarlandı. Tarayıcı içi işlem gücü sayesinde dosyalarınız
              gizli kalır, siz de zaman kazanırsınız.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Çalışma akışınızı sadeleştirmek için altın kurallar
            </h3>
            <ul style={listStyle}>
              <li>
                <strong>Önizleme alışkanlığı:</strong> Birleştirme, bölme ya da sayfa silme
                işlemi öncesi dosyaları küçük birer notla adlandırın ve sıralamayı kontrol
                edin. Yanlış sayfa silme veya tekrar eden görsellerin önüne geçersiniz.
              </li>
              <li>
                <strong>Doğru format seçimi:</strong> Sunum görselleri için PNG çıktısı, sosyal
                medya paylaşımları için JPG çıktısı tercih ederek kalite ve dosya boyutu
                dengesini koruyun.
              </li>
              <li>
                <strong>Hafifletme döngüsü:</strong> Büyük bir dosyayı paylaşmadan önce
                <em>Compress PDF</em> aracını çalıştırın, ardından görüntü kalitesini kontrol
                edip gerekiyorsa tekrar optimizasyon yapın.
              </li>
              <li>
                <strong>Gizlilik notu:</strong> Tarayıcı içinde çalışan işlemler, projelerinizin
                şirket dışına çıkmamasını sağlar. Ancak önemli sözleşmeleri işlerken yerel
                bir kopya saklamayı alışkanlık hâline getirin.
              </li>
              <li>
                <strong>Takım içi paylaşım:</strong> Birleştirilmiş ya da bölünmüş belgeleri
                isimlendirirken versiyon numarası ekleyin (ör. "Teklif-v3.pdf"), böylece
                karışıklık yaşamazsınız.
              </li>
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Senaryolara göre önerilen araç kombinasyonları
            </h3>
            <p style={paragraphStyle}>
              Her aracın birlikte kullanıldığında sağladığı hız kazancını örneklerle
              anlattık. Böylece aynı gün içinde birden fazla dosya tipiyle uğraşsanız bile
              nereden başlayacağınızı bilirsiniz.
            </p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              <li>
                <strong>Toplantı paketleri:</strong> Önce <em>Merge PDF</em> ile tüm raporları
                bir araya getirin, ardından <em>Rotate Pages</em> ile yatay çizimleri düzeltip
                <em>Compress PDF</em> ile paylaşılabilir hâle getirin.
              </li>
              <li>
                <strong>Eğitim setleri:</strong> Telefon fotoğraflarını <em>Images to PDF</em>
                içinde sıraya dizin, gerekirse <em>Delete Pages</em> ile boş sayfaları temizleyin
                ve final dokümanı öğrencilerle paylaşmadan önce <em>PDF Reader</em> içinde
                hızlıca gözden geçirin.
              </li>
              <li>
                <strong>Ürün kataloğu:</strong> Tasarım sayfalarını PNG olarak dışa aktarın,
                <em>PDF to PNG</em> ile şeffaf arka planlı görseller elde edin, web için
                <em>Compress Image</em> ile optimize edin ve satış ekibine tek klasörde teslim
                edin.
              </li>
              <li>
                <strong>Hukuk ve sözleşmeler:</strong> Belgeyi bölmeden paylaşmak için önce
                <em>Extract Pages</em> ile ilgili maddeleri seçin, ardından <em>Word to PDF</em>
                ile güncel sürümleri sabitleyin. En sonunda <em>PDF to Word</em> ile gerekli
                yerleri düzenleyip yeniden PDF'e çevirin.
              </li>
            </ol>
            <p style={paragraphStyle}>
              Kılavuzda yer alan öneriler, kullanıcı geri bildirimleriyle sık sık güncellenir.
              Yeni bir ipucu görmek isterseniz <strong>İletişim</strong> sayfasındaki form
              ipuçlarını kullanarak bize mesaj bırakabilirsiniz.
            </p>
          </section>
        );
      case "privacy":
        return (
          <section style={cardStyle} aria-label="Gizlilik politikası">
            <h2 style={headingStyle}>Privacy Policy</h2>
            <p style={paragraphStyle}>
              PDFFreeTool tarayıcı içi çalışan bir dosya yönetimi deneyimi sunar. Bu sayfa,
              kullanıcı verilerini nasıl işlediğimizi ve gizliliğinizi korumak için aldığımız
              önlemleri açıklar. Kullandığınız araçlardan bağımsız olarak dosyalarınız sunucu
              tarafında saklanmaz; işlemler mümkün olduğunca bellekte tamamlanır.
            </p>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Toplanan veriler ve kullanım amaçları
            </h3>
            <ul style={listStyle}>
              <li>
                <strong>Günlük kayıtları:</strong> Trafik seviyesini ölçmek için anonim
                kullanım metrikleri tutulur; IP adresleri veya dosya adları kaydedilmez.
              </li>
              <li>
                <strong>Çerezler:</strong> Zorunlu oturum çerezleri, dil tercihiniz veya
                tekrar açtığınız araçları hatırlamak için kullanılır. Reklam çerezleri
                yalnızca sizin onayınızla etkinleşir.
              </li>
              <li>
                <strong>Üçüncü taraf entegrasyonları:</strong> Reklam sağlayıcıları yalnızca
                sayfa görüntüleme istatistikleri alır; yüklediğiniz dosyalarla hiçbir
                şekilde etkileşime geçmez.
              </li>
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Dosya güvenliği ve saklama
            </h3>
            <p style={paragraphStyle}>
              Yüklediğiniz PDF veya görseller geçici bellekte işlenir ve indirme bağlantısı
              oluşturulduktan sonra otomatik olarak temizlenir. Sunucuda tutulan tek veri,
              kötüye kullanım tespitine yardımcı olan hata günlükleridir; bu günlükler dosya
              içeriği içermez.
            </p>
            <ul style={listStyle}>
              <li>İşlem tamamlandığında dosya parçaları bellekten silinir.</li>
              <li>Şifreli veya gizli belgeler için yerel kopyalarınızı yedeklemenizi öneririz.</li>
              <li>Paylaşılan cihazlarda tarayıcı geçmişini temizleyerek gizliliğinizi koruyun.</li>
            </ul>
            <h3 style={{ ...headingStyle, fontSize: "18px", marginBottom: "8px" }}>
              Haklarınız
            </h3>
            <p style={paragraphStyle}>
              Kullanım verilerinizin silinmesini veya anonimleştirilmesini talep etmek
              istediğinizde bizimle iletişime geçebilirsiniz. Reklam tercihleri, tarayıcı
              ayarları ve çerez yönetimi paneli üzerinden güncellenebilir.
            </p>
          </section>
        );
      case "terms":
        return (
          <section style={cardStyle} aria-label="Kullanım koşulları">
            <h2 style={headingStyle}>Terms of Service</h2>
            <p style={paragraphStyle}>
              PDFFreeTool'ü kullanarak dosyalarınızı yasal düzenlemelere uygun şekilde
              yönetmeyi kabul etmiş olursunuz. Araçlar, kişisel ve kurumsal kullanım için
              sunulur; fikri mülkiyet ihlali veya hukuka aykırı içerik yüklenmesinden siz
              sorumlusunuz.
            </p>
            <ol style={{ ...listStyle, paddingLeft: "20px" }}>
              <li>
                <strong>Sorumluluk sınırı:</strong> Tarayıcı içi işlenen dosyalarda veri
                kaybı yaşanmaması için yedekleme yapmanız önerilir. Platformumuz, doğrudan
                veya dolaylı zararlardan sorumlu tutulamaz.
              </li>
              <li>
                <strong>Adil kullanım:</strong> Hizmeti otomatikleştiren botlar veya aşırı
                istek gönderen sistemler tespit edildiğinde erişim sınırlanabilir.
              </li>
              <li>
                <strong>İçerik bütünlüğü:</strong> Telif hakkı ihlali barındıran belgeler
                yüklemek yasaktır. Şikâyet bildirildiğinde ilgili erişim engellenir.
              </li>
              <li>
                <strong>Güncellemeler:</strong> Bu koşullar düzenli olarak güncellenir ve
                duyurular footer'daki bağlantılar üzerinden paylaşılır.
              </li>
            </ol>
            <p style={paragraphStyle}>
              Hizmet, bakım çalışmaları sırasında kısa süreliğine erişilemez olabilir. Bu
              durumlarda mevcut dosyalarınız tarayıcıda tutulur, işlem süreciniz bozulmaz;
              sayfayı yenilediğinizde kaldığınız yerden devam edebilirsiniz.
            </p>
          </section>
        );
      case "about":
        return (
          <section style={cardStyle} aria-label="Hakkımızda sayfası">
            <h2 style={headingStyle}>About</h2>
            <p style={paragraphStyle}>
              PDFFreeTool, PDF ve görsel düzenleme araçlarını tek çatı altında toplayan hafif
              bir web uygulamasıdır. Tasarım prensibimiz, teknik detayları arka planda
              tutarken kullanıcıyı anlaşılır adımlarla yönlendirmek üzerine kuruldu.
            </p>
            <p style={paragraphStyle}>
              Ürün; React, Vite ve hızlı önbellek stratejileriyle inşa edildi. Tüm araçlar
              tek sayfada toplanır ve bilgi kutucukları, hangi aracı neden seçmeniz
              gerektiğini açıklayacak şekilde yazıldı. İçerik ekibi, SEO uyumlu başlıklar ve
              AdSense ile uyumlu rehberlik metinleri hazırlayarak ziyaretçilerin her araçtan
              önce bilgilendirilmesini sağladı.
            </p>
            <ul style={listStyle}>
              <li>Dosyalarınızı cihazda tutan güvenli işlem akışları.</li>
              <li>Çoklu dil desteği için hazır içerik yapısı ve rehber metinler.</li>
              <li>Destek ekibine hızlı ulaşım için sade iletişim bölümü.</li>
            </ul>
            <p style={paragraphStyle}>
              Önceliğimiz, herkesin ücretsiz ve erişilebilir araçlarla üretkenliğini
              artırması. Bu vizyon doğrultusunda, yeni araç fikirlerini toplamak ve mevcut
              deneyimi iyileştirmek için kullanıcı geri bildirimlerini düzenli olarak
              inceliyoruz.
            </p>
          </section>
        );
      case "contact":
        return (
          <section style={cardStyle} aria-label="İletişim sayfası">
            <h2 style={headingStyle}>Contact</h2>
            <p style={paragraphStyle}>
              Sorularınız, geri bildirimleriniz veya yeni araç önerileriniz için bizimle
              iletişime geçmekten çekinmeyin. Aşağıdaki rehber, mesajınızı hazırlarken nelere
              değinebileceğinizi anlatır ve destek sürecimizi hızlandırır.
            </p>
            <ul style={listStyle}>
              <li>
                <strong>Teknik destek:</strong> Hangi aracı kullandığınızı, dosya boyutunu ve
                gördüğünüz hata mesajını ekleyin. Böylece sorunu daha hızlı yeniden
                oluşturabiliriz.
              </li>
              <li>
                <strong>Özellik talebi:</strong> Sürecinizi nasıl geliştireceğini düşündüğünüz
                yeni araçları veya kısayolları anlatın. Kullanım senaryosu eklemek öncelik
                belirlememize yardımcı olur.
              </li>
              <li>
                <strong>İşbirliği:</strong> Entegrasyon veya içerik ortaklığı teklifleri için
                şirket adınızı, iletişim bilgilerinizi ve beklentilerinizi paylaşın.
              </li>
            </ul>
            <p style={paragraphStyle}>
              Ayrıca <strong>destek@pdffreetool.com</strong> adresine e-posta göndererek ya da
              sosyal medya hesaplarımız üzerinden bize ulaşabilirsiniz. Tüm mesajlara
              mümkün olan en kısa sürede geri dönmeye çalışıyoruz.
            </p>
          </section>
        );
      default:
        return null;
    }
  };

  const handleDragStart = (index) => {
    setDragIndex(index);
  };

  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === index) return;

    setFiles((prevFiles) => {
      const updated = [...prevFiles];
      const draggedItem = updated[dragIndex];
      updated.splice(dragIndex, 1);
      updated.splice(index, 0, draggedItem);
      return updated;
    });

    setDragIndex(index);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragIndex(null);
  };

  const handleDragEnd = () => {
    setDragIndex(null);
  };

  const totalMB =
    files.reduce((sum, f) => sum + f.size, 0) / 1024 / 1024 || 0;

  const activeTool = TOOL_MENU.find((tool) => tool.id === activeTab);

  const renderToolDetails = () => {
    const detail = TOOL_DETAILS[activeTab];

    if (!detail) return null;

    return (
      <section
        aria-label={`${detail.title} details`}
        style={{
          marginTop: "24px",
          marginBottom: "16px",
          background: "white",
          borderRadius: "16px",
          border: "1px solid #e5e7eb",
          boxShadow: "0 12px 30px rgba(15,23,42,0.08)",
          padding: "20px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            marginBottom: "6px",
          }}
        >
          <div
            style={{
              width: "12px",
              height: "12px",
              borderRadius: "999px",
              background: activeTool?.accent || "#4f46e5",
            }}
          ></div>
          <h2
            style={{
              margin: 0,
              color: "#0f172a",
              fontSize: "18px",
            }}
          >
            {detail.title}
          </h2>
        </div>

        <p
          style={{
            margin: 0,
            marginBottom: "8px",
            color: "#4b5563",
            fontSize: "14px",
            lineHeight: 1.6,
          }}
        >
          {detail.intro}
        </p>

        {detail.paragraphs?.map((text, idx) => (
          <p
            key={idx}
            style={{
              margin: 0,
              marginBottom: "10px",
              color: "#4b5563",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            {text}
          </p>
        ))}

        <div
          style={{
            display: "grid",
            gap: "16px",
            gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
            marginTop: "10px",
          }}
        >
          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "15px",
              }}
            >
              {detail.bulletTitle}
            </h3>
            <ul
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#4b5563",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {detail.bullets?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3
              style={{
                margin: 0,
                marginBottom: "6px",
                color: "#111827",
                fontSize: "15px",
              }}
            >
              {detail.checklistTitle}
            </h3>
            <ol
              style={{
                margin: 0,
                paddingLeft: "18px",
                color: "#4b5563",
                fontSize: "13px",
                lineHeight: 1.6,
              }}
            >
              {detail.checklist?.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ol>
          </div>
        </div>
      </section>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top, #e0f2fe 0, #f9fafb 45%, #e5e7eb 100%)",
        padding: "32px 16px 40px",
        boxSizing: "border-box",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Text", system-ui, sans-serif',
      }}
    >
      <main
        style={{
          maxWidth: "960px",
          margin: "0 auto",
        }}
      >
        <header
          style={{
            marginBottom: "18px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "12px",
            flexWrap: "wrap",
          }}
        >
          <div
            style={{
              width: "52px",
              height: "52px",
              borderRadius: "14px",
              background:
                "linear-gradient(135deg, rgba(79,70,229,0.14), rgba(14,165,233,0.24))",
              display: "grid",
              placeItems: "center",
              boxShadow: "0 10px 30px rgba(15,23,42,0.12)",
              border: "1px solid rgba(79,70,229,0.2)",
            }}
            aria-hidden="true"
          >
            <div
              style={{
                width: "36px",
                height: "36px",
                borderRadius: "12px",
                background:
                  "conic-gradient(from 90deg, #4f46e5, #0ea5e9, #22c55e, #4f46e5)",
                display: "grid",
                placeItems: "center",
                color: "white",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                fontSize: "14px",
              }}
            >
              PDF
            </div>
          </div>
          <div style={{ flex: 1, minWidth: "240px" }}>
            <p
              style={{
                margin: 0,
                color: "#6b7280",
                fontSize: "12px",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                fontWeight: 700,
              }}
            >
              PDFFreeTool Studio
            </p>
            <h1
              style={{
                margin: 0,
                marginTop: "2px",
                fontSize: "26px",
                lineHeight: 1.2,
                color: "#0f172a",
              }}
            >
              Flexible PDF & Image studio
            </h1>
            <p
              style={{
                margin: 0,
                marginTop: "6px",
                color: "#4b5563",
                fontSize: "14px",
                maxWidth: "700px",
                lineHeight: 1.6,
              }}
            >
              Pick any PDF or image tool from one menu—merge, split, convert, or optimize. Every tool comes
              with a clear description and practical tips so you can finish faster.
            </p>
          </div>
          <nav
            aria-label="Site navigation"
            style={{
              display: "flex",
              alignItems: "center",
              gap: "8px",
              flexWrap: "wrap",
              justifyContent: "flex-end",
              minWidth: "240px",
            }}
          >
            {renderNavLink("home", "Ana Sayfa")}
            {renderNavLink("blog", "Kılavuz & İpuçları")}
            {renderNavLink("privacy", "Privacy")}
            {renderNavLink("terms", "Terms")}
            {renderNavLink("about", "About")}
            {renderNavLink("contact", "Contact")}
          </nav>
        </header>
        {activePage === "home" ? (
          <>
            {/* Hero / Landing Text (SEO-friendly) */}
            <section
              style={{
                marginBottom: "20px",
                textAlign: "left",
                background: "white",
                borderRadius: "16px",
                padding: "18px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 12px 30px rgba(15,23,42,0.06)",
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  flexWrap: "wrap",
                }}
              >
                <h2
                  style={{
                    fontSize: "20px",
                    lineHeight: 1.25,
                    margin: 0,
                    color: "#0f172a",
                  }}
                >
                  Online PDF and image tools
                </h2>
                <span
                  style={{
                    padding: "6px 10px",
                    background: "#ecfdf3",
                    color: "#15803d",
                    borderRadius: "12px",
                    fontSize: "12px",
                    fontWeight: 700,
                    letterSpacing: "0.02em",
                  }}
                >
                  Ad-friendly content
                </span>
              </div>

              <p
                style={{
                  fontSize: "14px",
                  color: "#4b5563",
                  maxWidth: "780px",
                  margin: 0,
                  marginTop: "8px",
                  marginBottom: "10px",
                  lineHeight: 1.6,
                }}
              >
                Merge, compress, rotate, convert, and read PDFs all in one place. Our
                rich menu keeps every tool informative, user-friendly, and compliant
                with AdSense guidelines so visitors see helpful content.
              </p>
              <ul
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: "10px",
                  padding: 0,
                  margin: 0,
                  marginTop: "6px",
                  listStyle: "none",
                  fontSize: "12px",
                  color: "#374151",
                }}
              >
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#eef2ff",
                    color: "#4f46e5",
                    fontWeight: 500,
                  }}
                >
                  ✅ Drag & drop reorder
                </li>
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#ecfdf5",
                    color: "#15803d",
                    fontWeight: 500,
                  }}
                >
                  ✅ Files processed in memory
                </li>
                <li
                  style={{
                    padding: "4px 10px",
                    borderRadius: "999px",
                    background: "#fefce8",
                    color: "#92400e",
                    fontWeight: 500,
                  }}
                >
                  ✅ No registration required
                </li>
              </ul>
            </section>

            {/* Tool navigation menu */}
        <section
          aria-label="PDF tool menu"
          style={{
            marginBottom: "16px",
            background: "white",
            borderRadius: "16px",
            border: "1px solid #e5e7eb",
            boxShadow: "0 10px 28px rgba(15,23,42,0.07)",
            padding: "16px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "12px",
              flexWrap: "wrap",
              marginBottom: "10px",
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: "#0f172a",
                  fontSize: "18px",
                }}
              >
                Tool menu
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Click any card to jump to a tool, read the overview, and start using it.
              </p>
            </div>
            <span
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                background: "#eef2ff",
                color: "#4338ca",
                fontSize: "12px",
                fontWeight: 700,
              }}
            >
              {activeTool?.title}
            </span>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "12px",
            }}
          >
            {TOOL_MENU.map((tool) => {
              const isActive = tool.id === activeTab;
              return (
                <button
                  key={tool.id}
                  onClick={() => handleTabChange(tool.id)}
                  style={{
                    textAlign: "left",
                    padding: "12px",
                    borderRadius: "14px",
                    border: isActive
                      ? `2px solid ${tool.accent}`
                      : "1px solid #e5e7eb",
                    background: isActive
                      ? "linear-gradient(180deg, #f8fafc, #eef2ff)"
                      : "white",
                    boxShadow: isActive
                      ? "0 12px 24px rgba(79,70,229,0.14)"
                      : "0 8px 18px rgba(15,23,42,0.06)",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "10px",
                      marginBottom: "6px",
                    }}
                  >
                    <span
                      aria-hidden="true"
                      style={{
                        display: "inline-block",
                        width: "32px",
                        height: "32px",
                        borderRadius: "10px",
                        background: tool.accent,
                        color: "white",
                        fontWeight: 800,
                        fontSize: "13px",
                        letterSpacing: "-0.01em",
                        textAlign: "center",
                        lineHeight: "32px",
                      }}
                    >
                      {tool.title.substring(0, 2).toUpperCase()}
                    </span>
                    <strong
                      style={{
                        color: "#111827",
                        fontSize: "14px",
                      }}
                    >
                      {tool.title}
                    </strong>
                  </div>
                  <p
                    style={{
                      margin: 0,
                      color: "#4b5563",
                      fontSize: "12.5px",
                      lineHeight: 1.5,
                    }}
                  >
                    {tool.summary}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        {/* TAB NAVIGATION */}
        <div
          ref={toolContentRef}
          style={{
            marginBottom: "20px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <label
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              background: "white",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 6px 16px rgba(15,23,42,0.08)",
              width: "100%",
              maxWidth: "340px",
            }}
          >
            <span
              style={{
                fontSize: "14px",
                color: "#374151",
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              Select tool
            </span>
            <select
              value={activeTab}
              onChange={(e) => handleTabChange(e.target.value)}
              style={{
                flex: 1,
                padding: "10px 12px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                fontSize: "14px",
                fontWeight: 600,
                color: "#111827",
                background: "linear-gradient(180deg, #f8fafc, #f1f5f9)",
                boxShadow: "inset 0 1px 2px rgba(15,23,42,0.06)",
                outline: "none",
              }}
            >
              <option value="merge">Merge PDF</option>
              <option value="compress">Compress PDF</option>
              <option value="compressImage">Compress Image</option>
              <option value="jpgToPdf">Images to PDF</option>
              <option value="pdfToJpg">PDF to JPG</option>
              <option value="pdfToPng">PDF to PNG</option>
              <option value="split">Split PDF</option>
              <option value="deletePages">Delete PDF pages</option>
              <option value="rotatePages">Rotate PDF pages</option>
              <option value="extractPages">Extract PDF pages</option>
              <option value="pdfReader">PDF reader</option>
              <option value="pdfToWord">PDF to Word</option>
              <option value="wordToPdf">Word to PDF</option>
            </select>
          </label>
        </div>

        {/* ACTIVE TOOL CONTENT */}
        {activeTab === "merge" && (
          <section
            aria-label="PDF merge tool"
            style={{
              marginBottom: "28px",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  maxWidth: "540px",
                  width: "100%",
                  background: "white",
                  padding: "24px 24px 20px",
                  borderRadius: "18px",
                  boxShadow:
                    "0 24px 60px rgba(15,23,42,0.16), 0 0 0 1px rgba(148,163,184,0.18)",
                  border: "1px solid rgba(226,232,240,0.9)",
                }}
              >
                {/* Card Header */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    gap: "12px",
                    alignItems: "center",
                    marginBottom: "14px",
                  }}
                >
                  <div>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "2px 8px",
                        borderRadius: "999px",
                        background: "#eff6ff",
                        fontSize: "11px",
                        color: "#1d4ed8",
                        marginBottom: "6px",
                        fontWeight: 500,
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "6px",
                          height: "6px",
                          borderRadius: "999px",
                          background: "#22c55e",
                        }}
                      ></span>
                      Merge PDFs in your browser
                    </div>
                    <h2
                      style={{
                        fontSize: "18px",
                        margin: 0,
                        marginBottom: "4px",
                        color: "#0f172a",
                      }}
                    >
                      Merge PDF files in seconds
                    </h2>
                    <p
                      style={{
                        color: "#6b7280",
                        margin: 0,
                        fontSize: "13px",
                      }}
                    >
                      Upload, reorder, and download a single merged PDF. Nothing
                      is stored on our servers.
                    </p>
                  </div>
                  <div
                    style={{
                      textAlign: "right",
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    <div
                      style={{
                        padding: "4px 8px",
                        borderRadius: "999px",
                        background: "#f4f4ff",
                        color: "#4f46e5",
                        fontWeight: 500,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "4px",
                      }}
                    >
                      <span
                        style={{
                          display: "inline-block",
                          width: "7px",
                          height: "7px",
                          borderRadius: "999px",
                          background: "#4ade80",
                        }}
                      ></span>
                      Simple & secure
                    </div>
                  </div>
                </div>

                {/* Upload area */}
                <div
                  style={{
                    border: "1.5px dashed #d1d5db",
                    borderRadius: "12px",
                    padding: "16px",
                    textAlign: "center",
                    marginBottom: "14px",
                    background:
                      "linear-gradient(135deg, #f9fafb 0%, #f1f5f9 50%, #e5f0ff 100%)",
                  }}
                >
                  <div
                    style={{
                      fontSize: "13px",
                      marginBottom: "8px",
                      color: "#111827",
                      fontWeight: 500,
                    }}
                  >
                    Choose PDF files
                  </div>
                  <label
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      padding: "8px 14px",
                      borderRadius: "999px",
                      background: "#111827",
                      color: "white",
                      fontSize: "12px",
                      cursor: "pointer",
                      boxShadow: "0 8px 20px rgba(15,23,42,0.35)",
                    }}
                  >
                    <span
                      style={{
                        fontSize: "14px",
                      }}
                    >
                      📄
                    </span>
                    <span>Select PDFs</span>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="application/pdf"
                      multiple
                      onChange={handleFileChange}
                      style={{ display: "none" }}
                    />
                  </label>
                  <p
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                      marginTop: "8px",
                      marginBottom: 0,
                    }}
                  >
                    Up to {MAX_FILES} files • Total size ≤ {MAX_TOTAL_MB} MB
                  </p>
                </div>

                {/* File stats */}
                {files.length > 0 && (
                  <div
                    style={{
                      marginBottom: "8px",
                      fontSize: "11px",
                      color: "#4b5563",
                      display: "flex",
                      justifyContent: "space-between",
                      gap: "8px",
                    }}
                  >
                    <div>
                      Files selected:{" "}
                      <strong style={{ color: "#111827" }}>
                        {files.length}
                      </strong>
                    </div>
                    <div>
                      Total size:{" "}
                      <strong style={{ color: "#111827" }}>
                        {totalMB.toFixed(2)} MB
                      </strong>
                    </div>
                  </div>
                )}

                {/* File list with drag & drop */}
                {files.length > 0 && (
                  <div
                    style={{
                      marginBottom: "14px",
                      maxHeight: "220px",
                      overflowY: "auto",
                      border: "1px solid #e5e7eb",
                      borderRadius: "10px",
                      padding: "8px",
                      background: "#f9fafb",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "12px",
                        color: "#6b7280",
                        marginBottom: "6px",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <span style={{ fontWeight: 500, color: "#111827" }}>
                        Reorder files
                      </span>
                      <span>Drag to change merge order</span>
                    </div>
                    <ul
                      style={{
                        paddingLeft: 0,
                        margin: 0,
                        listStyleType: "none",
                        fontSize: "13px",
                      }}
                    >
                      {files.map((file, idx) => (
                        <li
                          key={idx}
                          draggable
                          onDragStart={() => handleDragStart(idx)}
                          onDragOver={(e) => handleDragOver(e, idx)}
                          onDrop={handleDrop}
                          onDragEnd={handleDragEnd}
                          style={{
                            display: "flex",
                            alignItems: "center",
                            padding: "8px 10px",
                            marginBottom: "6px",
                            borderRadius: "8px",
                            border:
                              dragIndex === idx
                                ? "1px dashed #4f46e5"
                                : "1px solid #e5e7eb",
                            background:
                              dragIndex === idx
                                ? "#eef2ff"
                                : "rgba(255,255,255,0.9)",
                            cursor: "grab",
                            gap: "8px",
                            boxShadow:
                              dragIndex === idx
                                ? "0 6px 16px rgba(79,70,229,0.25)"
                                : "0 1px 3px rgba(15,23,42,0.06)",
                            transition:
                              "background 0.15s ease, box-shadow 0.15s ease",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "16px",
                              width: "22px",
                              textAlign: "center",
                              color: "#9ca3af",
                            }}
                            title="Drag to reorder"
                          >
                            ☰
                          </span>
                          <span
                            style={{
                              fontSize: "11px",
                              color: "#6b7280",
                              width: "30px",
                              textAlign: "center",
                            }}
                          >
                            #{idx + 1}
                          </span>
                          <div
                            style={{
                              flex: 1,
                              wordBreak: "break-all",
                            }}
                          >
                            <span
                              style={{
                                fontWeight: 500,
                                color: "#111827",
                              }}
                            >
                              {file.name}
                            </span>
                            <span
                              style={{
                                color: "#9ca3af",
                                fontSize: "12px",
                              }}
                            >
                              {" "}
                              ({(file.size / 1024 / 1024).toFixed(2)} MB)
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRemoveFile(idx);
                            }}
                            style={{
                              border: "none",
                              background: "transparent",
                              color: "#b91c1c",
                              fontWeight: "bold",
                              fontSize: "16px",
                              cursor: "pointer",
                              padding: "0 6px",
                            }}
                            title="Remove this file"
                          >
                            ✕
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Error box */}
                {error && (
                  <div
                    style={{
                      marginBottom: "10px",
                      padding: "8px 10px",
                      background: "#fef2f2",
                      color: "#b91c1c",
                      borderRadius: "8px",
                      fontSize: "12px",
                      border: "1px solid #fecaca",
                    }}
                  >
                    {error}
                  </div>
                )}

                {/* Bottom actions + usage info */}
                <div
                  style={{
                    display: "flex",
                    gap: "8px",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginTop: "8px",
                  }}
                >
                  <div
                    style={{
                      fontSize: "11px",
                      color: "#6b7280",
                    }}
                  >
                    Merges this session:{" "}
                    <strong style={{ color: "#111827" }}>
                      {usageCount}
                    </strong>
                  </div>
                  <div
                    style={{
                      display: "flex",
                      gap: "8px",
                    }}
                  >
                    <button
                      onClick={handleClear}
                      disabled={isMerging || files.length === 0}
                      style={{
                        padding: "8px 12px",
                        borderRadius: "999px",
                        border: "1px solid #e5e7eb",
                        background: "white",
                        cursor:
                          isMerging || files.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "12px",
                        color: "#374151",
                        minWidth: "80px",
                      }}
                    >
                      Clear
                    </button>
                    <button
                      onClick={handleMerge}
                      disabled={isMerging || files.length === 0}
                      style={{
                        padding: "8px 16px",
                        borderRadius: "999px",
                        border: "none",
                        background:
                          isMerging || files.length === 0
                            ? "#9ca3af"
                            : "#4f46e5",
                        color: "white",
                        cursor:
                          isMerging || files.length === 0
                            ? "not-allowed"
                            : "pointer",
                        fontSize: "12px",
                        fontWeight: 500,
                        minWidth: "120px",
                        boxShadow:
                          isMerging || files.length === 0
                            ? "none"
                            : "0 10px 25px rgba(79,70,229,0.4)",
                      }}
                    >
                      {isMerging ? "Merging..." : "Merge PDFs"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>
        )}

        {activeTab === "compress" && <CompressCard />}
        {activeTab === "compressImage" && <CompressImageCard />}
        {activeTab === "jpgToPdf" && <JpgToPdfCard />}
        {activeTab === "pdfToJpg" && <PdfToJpgCard />}
        {activeTab === "pdfToPng" && <PdfToPngCard />}
        {activeTab === "split" && <SplitPdfCard />}
        {activeTab === "deletePages" && <DeletePdfPagesCard />}
        {activeTab === "rotatePages" && <RotatePdfPagesCard />}
        {activeTab === "extractPages" && <ExtractPdfPagesCard />}
        {activeTab === "pdfReader" && <PdfReaderCard />}
        {activeTab === "pdfToWord" && <PdfToWordCard />}
        {activeTab === "wordToPdf" && <WordToPdfCard />}

        {renderToolDetails()}

        {/* Ads under tools */}
        <AdsenseBanner slot="3737459241" />

        {/* SEO text sections */}
        <section
          aria-label="Free PDF tools – merge, compress, and convert images"
          style={{
            marginTop: "24px",
            marginBottom: "24px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            Simple PDF &amp; image tools for everyday work
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginBottom: "10px",
            }}
          >
            PDFFreeTool keeps popular PDF and image actions in one place. Merge,
            compress, convert between JPG and PDF, and handle pages directly in
            your browser—no downloads, accounts, or limits.
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            What you can do
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Merge and organize PDFs in the order you need.</li>
            <li>Compress files to share or upload without hassle.</li>
            <li>Convert seamlessly between JPG images and PDF documents.</li>
            <li>Split, rotate, or extract pages while keeping quality.</li>
          </ul>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            Why people choose it
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Secure, in-browser processing keeps files private.</li>
            <li>Fast results without sign-ups or watermarks.</li>
            <li>Free tools that work on any modern device.</li>
          </ul>
        </section>


        <section
          aria-label="Why choose this free PDF merger"
          style={{
            marginBottom: "16px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            Why choose this free PDF merger?
          </h2>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>
              <strong>Fast and simple:</strong> No complex settings or ads-heavy
              interface. Just upload, reorder, and merge.
            </li>
            <li>
              <strong>Secure:</strong> PDF files are processed directly in
              memory. We do not permanently store your documents.
            </li>
            <li>
              <strong>Browser-based:</strong> Works on Windows, macOS, Linux,
              and mobile devices with a modern browser.
            </li>
            <li>
              <strong>Free to use:</strong> No registration or account required
              to merge your PDF files.
            </li>
          </ul>
        </section>

        <section
          aria-label="FAQ about merging PDF files"
          style={{
            marginBottom: "12px",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginBottom: "6px",
              color: "#111827",
            }}
          >
            Frequently asked questions about merging PDF files
          </h2>
          <div
            style={{
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <p style={{ marginBottom: "6px" }}>
              <strong>Is this PDF merge tool free?</strong>
              <br />
              Yes. You can merge your PDF files for free with no account or
              subscription required.
            </p>
            <p style={{ marginBottom: "6px" }}>
              <strong>Is it safe to upload my documents?</strong>
              <br />
              Your files are processed in memory on the server and are not
              stored permanently. We do not keep a copy of your merged PDF.
            </p>
            <p style={{ marginBottom: "0" }}>
              <strong>Does this work on mobile?</strong>
              <br />
              Yes. The tool works in any modern browser, including mobile
              browsers on Android and iOS.
            </p>
          </div>
        </section>

        <section
          aria-label="Privacy, terms, and about information"
          style={{
            marginBottom: "16px",
            background: "white",
            borderRadius: "14px",
            border: "1px solid #e5e7eb",
            padding: "16px",
            boxShadow: "0 10px 22px rgba(15,23,42,0.06)",
          }}
        >
          <h2
            style={{
              fontSize: "18px",
              marginTop: 0,
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Privacy Policy
          </h2>
          <ul
            style={{
              paddingLeft: "18px",
              marginTop: 0,
              marginBottom: "12px",
              color: "#4b5563",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <li>Cookies are only used where necessary for a smooth experience.</li>
            <li>User data stays in the browser unless a tool needs processing.</li>
            <li>No login is needed to use any of the tools.</li>
          </ul>

          <h2
            style={{
              fontSize: "18px",
              marginTop: 0,
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            Terms of Service
          </h2>
          <ul
            style={{
              paddingLeft: "18px",
              marginTop: 0,
              marginBottom: "12px",
              color: "#4b5563",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <li>Use the site for lawful file handling only.</li>
            <li>Users are responsible for the content they upload and share.</li>
            <li>Follow the upload rules for file size and supported formats.</li>
          </ul>

          <h2
            style={{
              fontSize: "18px",
              marginTop: 0,
              marginBottom: "10px",
              color: "#111827",
            }}
          >
            About
          </h2>
          <ul
            style={{
              paddingLeft: "18px",
              margin: 0,
              color: "#4b5563",
              fontSize: "13px",
              lineHeight: 1.6,
            }}
          >
            <li>The goal is to simplify everyday PDF and image tasks in one place.</li>
            <li>Our mission is to keep these tools fast, private, and easy to use.</li>
          </ul>
        </section>
          </>
        ) : (
          renderStaticPage()
        )}

        <footer
          style={{
            marginTop: "12px",
            fontSize: "12px",
            color: "#6b7280",
            textAlign: "center",
            background: "white",
            borderRadius: "12px",
            border: "1px solid #e5e7eb",
            padding: "12px 10px",
            boxShadow: "0 8px 20px rgba(15,23,42,0.06)",
            display: "grid",
            gap: "6px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "12px",
              flexWrap: "wrap",
              fontWeight: 600,
              fontSize: "12px",
            }}
          >
            <button
              onClick={() => handleNavigate("privacy")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Privacy Policy
            </button>
            <button
              onClick={() => handleNavigate("terms")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Terms of Service
            </button>
            <button
              onClick={() => handleNavigate("about")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              About
            </button>
            <button
              onClick={() => handleNavigate("contact")}
              style={{ border: "none", background: "none", color: "#2563eb", cursor: "pointer" }}
            >
              Contact
            </button>
          </div>
          <div>© 2025 PDFFreeTool. All rights reserved.</div>
        </footer>
      </main>
    </div>
  );
}

export default App;
