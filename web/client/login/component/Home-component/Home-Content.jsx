import { useEffect } from "react";

export default function Content() {
  useEffect(() => {
    const cards = document.querySelectorAll(".content-holder");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("animate");
          } else {
            entry.target.classList.remove("animate");
          }
        });
      },
      { threshold: 0.1 } // Trigger when 10% of the card is visible
    );

    cards.forEach((card) => observer.observe(card));

    // Cleanup observer on unmount
    return () => observer.disconnect();
  }, []);
  return (
    <div className="">
      <img src="../../img/home.jpg" width="100%"></img>
      <div className="diagonal-layout">
        <div className="content-holder" dir="rtl" lang="ar">
          <h1 className="content-title">تجربة تنقل مميزة</h1>
          <h2 className="content-description">
            اتنقل وانت مرتاح وما تهمل هم الجو 🚌✅ باصات حديثة ومكيفة بالإضافة
            الى الراحة الي بتوفرلكم اياها
          </h2>
          <button className="content-button">تعرف علينا</button>
          <img
            src="../../img/markiting.jpg"
            className="content-img1"
            alt="Marketing Image"
          />
        </div>

        <div className="content-holder" dir="rtl" lang="ar">
          <img src="../../img/jamua.jpg" className="content-img2" />
          <h1>خدمات طلابية</h1>
          <h2>
            {" "}
            لكل طالب ما بحب يضيع وقتو وهو يستنى👍 شركة نابلس الكبرى وفرتلكم
            باصات نقل مريحة ومكيفة من البلد حتى جامعة النجاح القديمة والأكاديمية
            والعكس 🔄
          </h2>
          <button className="content-button">مواعيد الرحلات</button>
        </div>

        <div className="content-holder" dir="rtl" lang="ar">
          <h1>خدمات لجميع الفئات </h1>
          <h2>
            {" "}
            باصات نابلس الكبرى تقدم &quot;بطاقة وقار&quot;، مبادرة حصرية لتكريم
            كبار السن
          </h2>
          <button className="content-button"> اطلب بطاقتك</button>
          <img src="../../img/waqar.jpg" className="content-img3" />
        </div>
      </div>
    </div>
  );
}
