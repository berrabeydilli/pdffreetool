import React, { useState, useRef } from "react";
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
    title: "PDF Birleştir",
    summary:
      "Birden fazla PDF dosyasını aynı düzeni koruyarak tek bir dosyaya dönüştürün.",
    accent: "#4f46e5",
  },
  {
    id: "compress",
    title: "PDF Sıkıştır",
    summary:
      "Dosya boyutunu küçültürken metin ve görsel kalitesini dengede tutar.",
    accent: "#0ea5e9",
  },
  {
    id: "compressImage",
    title: "Görsel Sıkıştır",
    summary: "PNG ve JPG görselleri web için optimize edin ve paylaşmayı hızlandırın.",
    accent: "#10b981",
  },
  {
    id: "jpgToPdf",
    title: "JPG'den PDF'e",
    summary: "Fotoğraf ve taramaları düzgün sıralanmış bir PDF haline getirin.",
    accent: "#f59e0b",
  },
  {
    id: "pdfToJpg",
    title: "PDF'den JPG'ye",
    summary: "Her sayfayı paylaşılabilir yüksek çözünürlüklü görsellere çevirin.",
    accent: "#f97316",
  },
  {
    id: "pdfToPng",
    title: "PDF'den PNG'ye",
    summary: "Sayfaları şeffaf destekli keskin PNG görseller olarak dışa aktarın.",
    accent: "#7c3aed",
  },
  {
    id: "split",
    title: "PDF Böl",
    summary: "Belirli sayfa aralıklarını seçip ayrı dosyalar halinde kaydedin.",
    accent: "#ef4444",
  },
  {
    id: "deletePages",
    title: "Sayfa Sil",
    summary: "İstenmeyen sayfaları hızlıca kaldırarak dosyanızı hafifletin.",
    accent: "#14b8a6",
  },
  {
    id: "rotatePages",
    title: "Sayfa Döndür",
    summary: "Yanlış yöndeki sayfaları topluca 90° veya 180° döndürün.",
    accent: "#a855f7",
  },
  {
    id: "extractPages",
    title: "Sayfa Çıkar",
    summary: "Tek tek veya aralık halinde seçtiğiniz sayfaları yeni bir PDF'e alın.",
    accent: "#0ea5e9",
  },
  {
    id: "pdfReader",
    title: "PDF Okuyucu",
    summary: "Tarayıcıdan çıkmadan PDF önizleyin, yakınlaştırın ve sayfalar arasında gezin.",
    accent: "#2563eb",
  },
  {
    id: "pdfToWord",
    title: "PDF'den Word'e",
    summary: "Düzenlenebilir DOCX belgeleri oluşturup metni kolayca güncelleyin.",
    accent: "#c026d3",
  },
  {
    id: "wordToPdf",
    title: "Word'den PDF'e",
    summary: "Word dosyalarını paylaşımı kolay sabit PDF formatına çevirin.",
    accent: "#22c55e",
  },
];

const TOOL_DETAILS = {
  merge: {
    title: "PDF birleştirme rehberi",
    intro:
      "Farklı kaynaklardan gelen sözleşme, fatura veya ders notlarını tek bir dosyada toplamak hem arşivlemeyi hem de paylaşımı kolaylaştırır.",
    paragraphs: [
      "Sürükle-bırak ile sıralama yapabilir, dosyalarınızı yeniden adlandırmadan tek tıklamayla birleştirebilirsiniz. İşlem tamamlandığında dosya yalnızca tarayıcınızın belleğinde oluşturulur, bu da gizliliğinizi korur.",
      "Toplu çalışma yapan ekipler için ortak bir çıktı üretmek veya sınav dökümanlarını öğrencilerle paylaşmak gibi senaryolarda dakikalar kazandırır.",
    ],
    bulletTitle: "Nerelerde işe yarar?",
    bullets: [
      "Proje sunumlarını, PDF çıktıları ve çizimleri tek raporda toplamak.",
      "Maaş bordroları gibi aylık dosyaları tek klasör yerine tek PDF'te saklamak.",
      "E-imza öncesi belgeleri sıralı ve düzenli hale getirmek.",
      "Çoklu tarayıcı çıktısını kronolojik sıraya koymak.",
    ],
    checklistTitle: "Daha düzenli çıktılar için kontrol listesi",
    checklist: [
      "Dosya adlarınızı birleştirmeden önce kontrol edin; sıralama adımlarınız daha anlamlı olur.",
      "Kapağa logo veya özet eklemek istiyorsanız en üstte boş bir sayfa bırakın.",
      "Reklam veya gereksiz sayfaları silmek için birleştirme öncesi önizleme yapın.",
      "Son dosyayı paylaşmadan önce toplam boyuta bakarak gerekirse sıkıştırma aracını kullanın.",
    ],
  },
  compress: {
    title: "PDF sıkıştırma kılavuzu",
    intro:
      "E-posta limitlerine takılmadan hızlı paylaşım yapmak için PDF boyutunu küçültün. Araç, metin ve görseller arasında dengeli bir optimizasyon uygular.",
    paragraphs: [
      "Sunum, katalog veya yüksek çözünürlüklü taramalar genellikle gereğinden büyük olur. Sıkıştırma sonrası okunabilirlik korunurken gereksiz meta veriler temizlenir.",
      "Dosya boyutunun dramatik biçimde düşmesi yükleme sürelerini azaltır ve mobil veri tüketimini düşürür.",
    ],
    bulletTitle: "İdeal kullanım senaryoları",
    bullets: [
      "İş başvurusu, tender veya resmi başvurularda maksimum dosya sınırını aşmamak.",
      "Müşterilere gönderilen katalogların e-posta eklerine sığmasını sağlamak.",
      "Bulut depolama alanı sınırlı ekipler için arşiv boyutunu azaltmak.",
      "Okul projelerini LMS'lere (Google Classroom vb.) hızlı yüklemek.",
    ],
    checklistTitle: "Temiz bir çıktı için ipuçları",
    checklist: [
      "Sıkıştırmadan önce içeriği kontrol ederek tekrar eden sayfaları kaldırın.",
      "Tarama ağırlıklı belgeler için renkli yerine gri tonlamalı sürümleri deneyin.",
      "Çevrimdışı paylaşım yapacaksanız çıktı boyutunu not edin.",
      "Sıkıştırma sonrası örnek sayfalarda görsel bozulma olup olmadığını kontrol edin.",
    ],
  },
  compressImage: {
    title: "Görsel sıkıştırma açıklaması",
    intro:
      "Yüksek megapikselli fotoğrafları internet hızınıza uygun hale getirirken, sosyal medya ve e-posta için dengeli bir dosya boyutu elde edersiniz.",
    paragraphs: [
      "Araç, görsellerdeki gereksiz meta verileri temizler ve akıllı kalite ayarlarıyla renk doğruluğunu korur.",
      "Hem JPG hem de PNG dosyalarında çalışır, böylece blog kapak görselleri veya ürün fotoğrafları için tek tıklama ile optimizasyon yapabilirsiniz.",
    ],
    bulletTitle: "Öne çıkan kullanım alanları",
    bullets: [
      "E-ticaret ürün fotoğraflarını sayfa açılış hızını etkilemeden sunmak.",
      "Portfolyo sitelerinde yüksek çözünürlüklü görselleri hızlı yüklemek.",
      "E-posta eklerinde limit aşımını önlemek.",
      "Sosyal medya gönderileri için platform tavsiye boyutlarını yakalamak.",
    ],
    checklistTitle: "Hızlı kontrol listesi",
    checklist: [
      "Özgün dosyanın bir kopyasını saklayın; gerektiğinde geri dönmek kolay olsun.",
      "PNG görsellerde şeffaflık gerekiyorsa çıktı formatını PNG olarak koruyun.",
      "Mobilde yüklemeden önce dosyaları yeniden adlandırarak düzenli tutun.",
      "Blog kapakları için 1200px genişlik üzerini genelde korumak yeterlidir.",
    ],
  },
  jpgToPdf: {
    title: "JPG'den PDF'e dönüşüm rehberi",
    intro:
      "Fotoğraf, tarama veya ekran görüntülerini düzenli bir dokümanda toplamak profesyonel bir sunum sağlar.",
    paragraphs: [
      "Sürüklediğiniz görseller yüklenme sırasına göre PDF'e eklenir; isterseniz yeniden sıralayıp tek tuşla kaydedebilirsiniz.",
      "Farklı boyutlardaki görüntüler otomatik olarak sayfaya ortalanır, kenar boşlukları temiz tutulur.",
    ],
    bulletTitle: "Kimler için ideal?",
    bullets: [
      "Serbest çalışanlar için makbuz ve fatura fotoğraflarını tek dosya yapmak.",
      "Öğrenciler için ders notu fotoğraflarını çıktıya hazır hale getirmek.",
      "Sanatçılar için illüstrasyon taslaklarını müşterilere sunmak.",
      "Teknik ekipler için saha fotoğraflarını raporlamak.",
    ],
    checklistTitle: "Daha iyi PDF'ler için öneriler",
    checklist: [
      "Görselleri yüklemeden önce yatay/dikey yönlerini düzeltin.",
      "Tarama hatalarını azaltmak için parlaklığı ayarlayın.",
      "Sıralamayı tamamladıktan sonra önizleme ile sayfa kenarlarını kontrol edin.",
      "Aynı proje için birden çok PDF gerekiyorsa adlandırma standardı belirleyin.",
    ],
  },
  pdfToJpg: {
    title: "PDF'den JPG'ye dönüştürme detayları",
    intro:
      "Sunum veya rapor sayfalarını tek tıklamayla yüksek çözünürlüklü görsellere dönüştürün.",
    paragraphs: [
      "Her sayfa ayrı bir JPG olarak dışa aktarılır ve ZIP içinde indirilir, böylece paylaşım veya sosyal medya yüklemeleri kolaylaşır.",
      "Özellikle slayt ve infografik içerikler için keskin sonuçlar elde edilir.",
    ],
    bulletTitle: "Pratik kullanım fikirleri",
    bullets: [
      "Sunumları LinkedIn veya blog gönderilerinde görsel olarak paylaşmak.",
      "Raporlardaki grafik ve tabloları tek karede göstermek.",
      "Eğitim materyallerini sınıf içi ekranlar için JPG'e çevirmek.",
      "Sosyal medya carousel hazırlamak için sayfaları ayrı ayrı almak.",
    ],
    checklistTitle: "Temiz JPG'ler için ipuçları",
    checklist: [
      "Dönüşüm öncesi PDF'teki fazla beyaz kenarları kırpın.",
      "Renkli sayfalar için ekran/parlaklık modlarını kontrol edin.",
      "İndirilen ZIP'i paylaşmadan önce dosya adlarını sadeleştirin.",
      "Küçük ekranlar için gerekirse görselleri yeniden boyutlandırın.",
    ],
  },
  pdfToPng: {
    title: "PDF'den PNG'ye dönüştürme",
    intro:
      "Şeffaflık desteği isteyen tasarımlar veya UI maketleri için PNG çıktıları daha esnektir.",
    paragraphs: [
      "Araç, sayfa arkaplanlarını temiz tutarak katmanlı tasarımlarınızı sunumlarda veya sunucu yüklemelerinde kullanıma hazır hale getirir.",
      "Vektör ağırlıklı PDF'lerde bile keskin sonuçlar üretilir.",
    ],
    bulletTitle: "Öne çıkan kullanım alanları",
    bullets: [
      "UI/UX ekipleri için tasarım sayfalarını paylaşmak.",
      "Şeffaf arkaplanlı görsellerle sunum hazırlamak.",
      "Video editörleri için overlay grafikler çıkarmak.",
      "Teknik dökümanlardaki çizimleri PNG olarak arşivlemek.",
    ],
    checklistTitle: "Dönüşüm sonrası öneriler",
    checklist: [
      "Çıkan PNG'lerin dosya boyutunu görmek için önizleme yapın.",
      "Şeffaf alanları kontrol edip gerekirse düzenleyin.",
      "Sunumda kullanacaksanız slayt boyutuna göre yeniden ölçeklendirin.",
      "Görselleri konu başlığına göre klasörleyerek paylaşın.",
    ],
  },
  split: {
    title: "PDF bölme rehberi",
    intro:
      "Uzun PDF'leri parçalara ayırmak, belirli bölüm veya ekleri ayrı paylaşmak için idealdir.",
    paragraphs: [
      "Sayfa aralıklarını seçtiğinizde araç her birini yeni bir PDF olarak hazırlar. Bu sayede müşteriye sadece ilgili bölümü gönderebilirsiniz.",
      "Toplu sınav çözümleri veya kitap bölümleri için arşivlemeyi kolaylaştırır.",
    ],
    bulletTitle: "Kullanım örnekleri",
    bullets: [
      "Kitap veya raporun sadece gerekli bölümünü paylaşmak.",
      "Sözleşmelerde ekleri ayrı dosya olarak hazırlamak.",
      "Eğitim materyallerini konu konu ayırmak.",
      "İnceleme süreçlerinde ilgili bölümleri farklı kişilere atamak.",
    ],
    checklistTitle: "İşlemi hızlandıran tüyolar",
    checklist: [
      "Bölünecek sayfa aralığını önceden not alın.",
      "Gerekirse bölme sonrası sayfa numaralarını kontrol edin.",
      "Aynı dosyada birden fazla aralık gerekiyorsa işlemi sırayla tekrarlayın.",
      "Sonuç dosyalarına açıklayıcı adlar verin (ör. 'Bölüm-2-Analiz.pdf').",
    ],
  },
  deletePages: {
    title: "Sayfa silme hakkında",
    intro:
      "Taslak veya reklam içeren sayfaları kaldırarak dosyalarınızı temiz ve hafif tutabilirsiniz.",
    paragraphs: [
      "Silmeyi seçtiğiniz sayfalar anında listeden çıkar ve yeni PDF saniyeler içinde hazırlanır.",
      "Resmi başvurular için gereksiz sayfaları kaldırmak hataları önler.",
    ],
    bulletTitle: "Neden kullanmalısınız?",
    bullets: [
      "Sözleşmelerde güncelliğini yitirmiş ekleri temizlemek.",
      "Tarama sırasında oluşan boş sayfaları kaldırmak.",
      "Reklam içeren sayfaları paylaşım öncesi gizlemek.",
      "Sadece gerekli talimatları içeren hafif dosyalar hazırlamak.",
    ],
    checklistTitle: "Hızlı doğrulama listesi",
    checklist: [
      "Silinecek sayfa numaralarını iki kez kontrol edin.",
      "Önemli notlar içeren sayfaları yedekleyin.",
      "Kalan sayfa numaralarının sıralı olduğundan emin olun.",
      "İşlem sonrası dosyayı PDF okuyucuda önizleyin.",
    ],
  },
  rotatePages: {
    title: "Sayfa döndürme rehberi",
    intro:
      "Yanlış yönde taranan belgeler veya yatay çizimler için sayfa döndürme aracı saniyeler içinde çözüm sunar.",
    paragraphs: [
      "90° veya 180° seçenekleriyle toplu düzeltme yapabilir, çıktı aldıktan sonra sayfa yönlerinin tutarlı olduğunu garantilersiniz.",
      "Özellikle teknik çizimler veya yatay fotoğraflar içeren raporlar için kullanışlıdır.",
    ],
    bulletTitle: "Kullanım alanları",
    bullets: [
      "Tarama cihazından ters gelen bordro veya sözleşmeleri düzeltmek.",
      "Yatay poster veya grafiklerin okunabilirliğini artırmak.",
      "Ders notlarında yer alan yatay diyagramları hizalamak.",
      "Projeksiyon için sayfaları aynı yöne çevirmek.",
    ],
    checklistTitle: "Doğru açılar için ipuçları",
    checklist: [
      "Önce örnek bir sayfada dönüş açısını test edin.",
      "Tüm sayfaları aynı yöne çevirmek gerekiyorsa toplu seçimi kullanın.",
      "Döndürme sonrası sayfa numaralarının yerleşimini kontrol edin.",
      "Eğer çıktıda yazı kenara yakınsa kenar boşluklarını gözden geçirin.",
    ],
  },
  extractPages: {
    title: "Sayfa çıkarma açıklamaları",
    intro:
      "Kalın PDF'lerden sadece ilgili bölümü almak hem paylaşımı hızlandırır hem de gizli bilgileri ayırmanıza yardımcı olur.",
    paragraphs: [
      "Seçtiğiniz sayfa aralıkları yeni bir dosya olarak hazırlanır, böylece hassas olmayan kısımları güvenle paylaşabilirsiniz.",
      "Proje ekipleri arasında görev bazlı doküman paylaşımı yaparken zaman kazandırır.",
    ],
    bulletTitle: "Hangi durumlarda kullanılır?",
    bullets: [
      "Raporun sadece özet bölümünü müşteriye göndermek.",
      "Eğitim içeriklerinde belirli üniteleri paylaşmak.",
      "Yasal belgelerde gizli ekleri çıkarmak.",
      "Teknik çizim setlerini alt klasörlere ayırmak.",
    ],
    checklistTitle: "Güvenli paylaşım için adımlar",
    checklist: [
      "Hangi sayfaların paylaşılacağını önceden işaretleyin.",
      "Çıkarılan dosyayı isimlendirirken kapsamı belirtin.",
      "Gizlilik gerektiren sayfaların dışarıda kaldığını doğrulayın.",
      "Paylaşım öncesi son dosyayı hızlıca gözden geçirin.",
    ],
  },
  pdfReader: {
    title: "PDF okuyucu hakkında",
    intro:
      "Tarayıcı içindeki okuyucu, ek bir program kurmadan sayfalar arasında hızlıca gezinmenizi sağlar.",
    paragraphs: [
      "Yakınlaştırma, sayfa atlama ve arama özellikleriyle büyük dokümanlarda bile rahatça çalışabilirsiniz.",
      "Mobil dostu arayüz, küçük ekranlarda bile metinleri net şekilde gösterir.",
    ],
    bulletTitle: "Kullanım önerileri",
    bullets: [
      "Toplantı sırasında belgeleri ortak ekranda açmak.",
      "İndirmeden önce doğru dosya olup olmadığını kontrol etmek.",
      "Uzun raporlarda arama yaparak ilgili bölüme hızlı atlamak.",
      "Sunumları slayt gibi görüntülemek.",
    ],
    checklistTitle: "Okuma deneyimini iyileştirin",
    checklist: [
      "Metin çok küçükse tarayıcı yakınlaştırmasını artırın.",
      "Karanlık ortamlarda cihazınızın gece modunu açmayı deneyin.",
      "Sayfa numaralarını not alarak önemli kısımlara geri dönün.",
      "Okuma sonrası dosyayı paylaşmadan önce gerekli araçla düzenleyin.",
    ],
  },
  pdfToWord: {
    title: "PDF'den Word'e çeviri açıklamaları",
    intro:
      "Düzenlenebilir DOCX çıktıları sayesinde PDF içeriğini hızla güncelleyebilir veya yeniden kullanabilirsiniz.",
    paragraphs: [
      "Araç, metin akışını koruyarak tabloları ve başlıkları mümkün olduğunca doğru aktarır.",
      "Özellikle teklif şablonları veya form metinlerinde tekrar yazma zahmetini azaltır.",
    ],
    bulletTitle: "Kullanım alanları",
    bullets: [
      "Eski sözleşmeleri güncelleyerek yeni sürümler oluşturmak.",
      "PDF formatlı makaleleri düzenlenebilir hale getirip not düşmek.",
      "Müşteri sunumlarını farklı dilde yeniden uyarlamak.",
      "Formlardaki metin ve tablo düzenini değiştirmek.",
    ],
    checklistTitle: "Temiz DOCX için öneriler",
    checklist: [
      "Çeviri öncesi PDF'teki görselleri kontrol edin; yüksek kalite daha iyi sonuç verir.",
      "Dönüşüm sonrası başlık ve paragrafların hizalamasını gözden geçirin.",
      "Gerekirse tablo kenarlıklarını Word içinde yeniden biçimlendirin.",
      "Paylaşmadan önce belgedeki kişisel verileri temizlediğinizden emin olun.",
    ],
  },
  wordToPdf: {
    title: "Word'den PDF'e dönüştürme",
    intro:
      "Dökümanlarınızı sabit düzenli, her cihazda aynı görünen PDF formatına tek tıkla çevirin.",
    paragraphs: [
      "Arial gibi yaygın yazı tipleri otomatik olarak gömülür, böylece alıcı tarafında bozulma yaşanmaz.",
      "Formlar, teklif metinleri veya özgeçmişler için güvenilir bir çıktı elde edersiniz.",
    ],
    bulletTitle: "Pratik kullanımlar",
    bullets: [
      "İş başvurusu veya teklifleri resmi formatta iletmek.",
      "Fatura ve irsaliye şablonlarını paylaşıma hazır hale getirmek.",
      "Eğitim materyallerini her cihazda aynı görünümle sunmak.",
      "İmzaya gönderilen belgelerin düzenini sabitlemek.",
    ],
    checklistTitle: "Pürüzsüz PDF için kontrol listesi",
    checklist: [
      "Belgedeki özel yazı tiplerinin yerleşik olduğundan emin olun.",
      "Sayfa boyutunu (A4, Letter) alıcıya uygun seçin.",
      "Görsellerin çözünürlüğünü 150-300 DPI aralığında tutun.",
      "Son PDF'i paylaşmadan önce hızlı bir gözden geçirme yapın.",
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
  const fileInputRef = useRef(null);

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
        aria-label={`${detail.title} açıklamaları`}
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
            gap: "12px",
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
          <div>
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
              Çok yönlü PDF & Görsel atölyesi
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
              PDF birleştirme, bölme, dönüştürme ve görsel optimizasyon araçlarını tek bir menüden seçin.
              Her sayfada, aracın nasıl daha verimli kullanılacağına dair ayrıntılı açıklamalar ve ipuçları
              sizi bekliyor.
            </p>
          </div>
        </header>

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
              Online PDF ve Görsel Araçları
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
              Reklam dostu içerik
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
            PDF birleştirme, sıkıştırma, sayfa döndürme, görsel dönüştürme ve dosya
            okuma araçlarının tamamı tek çatı altında. İçeriği zengin menü sayesinde
            Google AdSense politikalarına uygun, bilgi dolu ve kullanıcı dostu
            ekranlar sunmaya odaklanıyoruz.
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
          aria-label="PDF araç menüsü"
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
                Araç menüsü
              </h2>
              <p
                style={{
                  margin: 0,
                  marginTop: "4px",
                  color: "#6b7280",
                  fontSize: "13px",
                }}
              >
                Hangi araca ihtiyacınız varsa kartlara tıklayarak seçin, açıklamaları ve ipuçlarını okuyun.
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
                  onClick={() => setActiveTab(tool.id)}
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
              onChange={(e) => setActiveTab(e.target.value)}
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
            Free Online PDF & Image Tools – Merge, Split & Convert
          </h2>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginBottom: "10px",
            }}
          >
            PDFFreeTool offers four essential utilities:{" "}
            <strong>Merge PDF</strong>, <strong>Compress PDF</strong>,
            <strong>JPG to PDF</strong>, and <strong>PDF to JPG</strong>. All
            tools work directly in your browser, require no account, and are
            completely free to use.
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            Merge PDF online
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Combine multiple PDF files into one document.</li>
            <li>Reorder pages easily using drag &amp; drop.</li>
            <li>Download a single optimized merged PDF.</li>
            <li>Secure processing entirely in memory.</li>
          </ul>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginTop: "8px",
              marginBottom: "10px",
            }}
          >
            Perfect for students, professionals, or anyone who needs to organize
            documents quickly and efficiently.
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            Compress PDF online
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Reduce large PDF file sizes instantly.</li>
            <li>Make files easier to upload to websites and portals.</li>
            <li>Send PDFs via email without size limits.</li>
            <li>Optimize scanned documents and save storage space.</li>
          </ul>

          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
              marginTop: "8px",
              marginBottom: "10px",
            }}
          >
            Compression keeps your document readable while drastically reducing
            its file size.
          </p>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            JPG to PDF online
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Upload multiple JPG photos and combine them into one PDF.</li>
            <li>Keep image quality intact for printing or sharing.</li>
            <li>Create a tidy document from scans, receipts, or photos.</li>
            <li>Download instantly with no sign-up required.</li>
          </ul>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            PDF to JPG online
          </h3>
          <ul
            style={{
              paddingLeft: "20px",
              margin: 0,
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            <li>Convert every PDF page to a crisp JPG image.</li>
            <li>Process everything in your browser for extra privacy.</li>
            <li>Download all JPGs at once inside a single ZIP file.</li>
            <li>Ideal for slides, reports, or sharing individual pages.</li>
          </ul>

          <h3
            style={{
              fontSize: "16px",
              marginBottom: "6px",
              marginTop: "14px",
              color: "#111827",
            }}
          >
            Secure, private, and fast
          </h3>
          <p
            style={{
              fontSize: "13px",
              color: "#4b5563",
            }}
          >
            Your PDFs are processed securely and deleted immediately after
            download. No files are stored on our servers, ensuring complete
            privacy.
          </p>
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

        <footer
          style={{
            marginTop: "12px",
            fontSize: "11px",
            color: "#9ca3af",
            textAlign: "center",
          }}
        >
          © {new Date().getFullYear()} Online PDF Tools. All rights reserved.
        </footer>
      </main>
    </div>
  );
}

export default App;
