export default function Content() {
  return (
    <div className="">
      <img src="../../img/home.jpg" width="100%"></img>
      <div className="diagonal-layout">
        <div className="content-holder" dir="rtl" lang="ar">
          <h3 className="content-title">تجربة تنقل مميزة</h3>
          <p className="content-description">
            اتنقل وانت مرتاح وما تهمل هم الجو 🚌✅ باصات حديثة ومكيفة بالإضافة
            الى الراحة الي بتوفرلكم اياها
          </p>
          <button className="content-button">تعرف علينا</button>
          <img
            src="../../img/markiting.jpg"
            className="content-img"
            alt="Marketing Image"
          />
        </div>

        <div className="content-holder" dir="rtl" lang="ar">
          <img src="../../img/jamua.jpg" className="content-img" />
          <p>
            {" "}
            لكل طالب ما بحب يضيع وقتو وهو يستنى👍 شركة نابلس الكبرى وفرتلكم
            باصات نقل مريحة ومكيفة من البلد حتى جامعة النجاح القديمة والأكاديمية
            والعكس 🔄
          </p>
        </div>

        <div className="content-holder" dir="rtl" lang="ar">
          <p>
            {" "}
            باصات نابلس الكبرى تقدم &quot;بطاقة وقار&quot;، مبادرة حصرية لتكريم
            كبار السن
          </p>
          <img src="../../img/waqar.jpg" className="content-img" />
        </div>
      </div>
    </div>
  );
}
