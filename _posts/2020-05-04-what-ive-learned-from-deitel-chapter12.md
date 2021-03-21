---
title: نکات جدیدی که از فصل ۱۲ سی++ دایتل یاد گرفتم – چندریختی
categories: [سی++]
tags: [C++, object oriented, polymorphism, programming, RTTI, virtual, vtable, سی++]
---

تقریبا یه هفته طول کشید تا پاراگراف آخر این پست رو بنویسم که درباره‌ی
چند ریختی یا polymorphism توی سی++ عه. دلیلش هم همون بهونه‌ی قدیمیم، 
حال نداشتن، بود. احتمالا وقتی این متن رو میخونید متوجه میشید که به شدت 
با بی‌حوصلگی نوشته شده، مثال زیاد نزدم و کدی هم ننوشتم. دلیلش هم که خب 
واضحه.

چند ریختی به ما اجازه میده که برنامه های گسترده ای بنویسیم و درواقع 
بتونیم برنامه نویسی general داشته باشیم بجای اینکه مجبور بشیم به صورت 
خاص برنامه بنویسیم(الآن براش مثالی توی ذهنم ندارم که کوتاه باشه).

## کلمه‌ی `virtual`

معمولا وقتی از طریق یه پوینتر توابع رو فراخوانی می‌کنیم، توابع مربوط 
به [جنس اون] پوینتر صدا زده میشن نه توابع مربوط به کلاسی که بهش اشاره 
میشه. یعنی اگه تابعی با دو نسخه(یکی توی کلاس والد و یکی توی کلاس فرزند) 
وجود داشته باشه، اون نسخه ای صدا زده میشه که مربوط به type پوینتره. 
virtual به وجود اومده تا راه حلی برای این مشکل باشه، برای اینکه موقع صدا
زدن یه تابع از طریق پوینتر/رفرنس، برنامه چک میکنه که اگر کلاس فرزند 
نسخه‌ی خودش از اون تابع رو داره، همون رو صدا بزنه در غیر این صورت نسخه‌ی
مربوط به کلاس والد رو صدا می‌زنه.

درواقع توابع ویرچوال ابن امکان رو فراهم میکنن که بجای فراخوانی تابع مربوط به هندل، تابع مربوط به کلاس اشاره شده فراخوانی بشه.

بهتره که برای خوانایی بهتر توی هر سطح که توابع virtual والد رو بازنویسی می‌کنیم، قید کنیم که این یه تابع virtual عه.

## Dynamic Binding

همونطور که بالاتر گفتیم اگر یکی از توابع به شکل virtual تعریف شده 
باشه، و این تابع از طریق یه پوینتر/رفرنس فراخوانی بشه، برنامه خودش تابع 
مناسب رو بر اساس جنسِ شئ ای که داره بهش اشاره میشه انتخاب میکنه. به این 
فرآیند میگن dynamic binding.

## کلمه‌ی `override`

وقتی یه تابعی از کلاس والد رو توی کلاس فرزند بازنویسی می‌کنیم، بهتره 
که از کلمه‌ی override براش استفاده بکنیم، با استفاده کردن این کلمه، 
کامپایلر چک میکنه که آیا تابعی با امضا(signature) مشابه توی کلاس(های) 
والد وجود داره که بخواد بازنویسی بشه یا نه.

## ضرورت `virtual` کردن destructor

مهمه که اگر میخوایم به صورت چند ریختی از کدمون استفاده بکنیم، حتما destructor رو به صورت virtual تعریف کنیم.

دلیلش اینه که اگر یک اشاره گر از نوع کلاس والد که داره به یک شئ از 
کلاس فرزند اشاره میکنه توسط کلمه‌ی delete پاک بشه، تابع نابودکننده مربوط
به خودش صدا زده بشه و نه تابع نابودکننده والد.

## کلمه‌ی `default`

چیز جدیدی که به سی++ ۱۱ اضافه شده کلمه‌ی default هست. وقتی میخوایم یه
کانستراکتور و یا دیستراکتور پیش فرض داشته باشیم دیگه نیاز نیست که یه 
تابع با بدنه‌ی خالی بنویسیم. فقط کافیه توی اعلان، اون تابع رو default 
کنیم.

## کلمه‌ی `final`

وقتی از کلمه‌ی final برای یه تابع استفاده میشه، دیگه کامپایلر اجازه 
نمیده که اون تابع توی کلاس های فرزند بازنویسی و override بشه. 

وقتی از کلمه‌ی final برای تعریف یه کلاس استفاده بشه، کامپایلر اجازه نمیده که کلاس های دیگه از این کلاس ارث بری داشته باشن.

## کلاس Abstract

تا اینجا ما میتونستیم از کلاس هامون اشیاء ای رو بسازیم. اما یه سری 
کلاس های دیگه هم وجود دارن که نمیشه ازشون هیچ شئ ای ساخت که به این کلاس 
ها میگن Abstract. به کلاس های معمولی میگن concrete.

کلاسی رو میشه ابسترکت نامید که حداقل یکی از توابع virtual اش به صورت pure باشه.

برای اینکه یک تابع رو pure کنیم، باید اعلان تابع رو برابر 0 قرار بدیم
که اون 0 نشان pure specifier هست. با pure اعلام کردن یک تابع دیگه نباید
براش پیاده سازی ای نوشت بنابراین همه‌ی کلاس های فرزند باید توابع pure 
رو پیاده سازی کنن وگرنه خودشونم ابسترکت میشن.

## چندریختی به صورت عمیق تر!

یه رفتار پلی مورفیک از سه سطح از پوینتر ها تشکیل شده. 

#### مرحله اول، vtable

وقتی کامپایلر کلاسی که دارای توابع virtual عه رو کامپایل میکنه، برای 
اون کلاس یدونه Virtual function Table (vtable) میسازه. کار این جدول چیه؟
آدرس توابع virtual شده‌ی اون کلاس رو داخل خودش ذخیره می‌کنه. وقتی در 
زمان اجرا میخوایم با استفاده از dynamic binding یه تابع virtual رو 
فراخوانی کنیم، برنامه توی vtable کلاس مربوطه میگرده تا تابع درست رو پیدا
و اجرا بکنه.

#### مرحله دوم

وقتی یه آبجکت از یک کلاس دارای توابع ویرچوال ساخته میشه، کامپایلر  
به اون آبجکت یه پوینتر اختصاص میده(این پوینتر رو معمولا در اول آبجکت 
میذاره) که اون پوینتر به vtable مربوط به اون کلاس اشاره می‌کنه.

#### مرحله سوم

پوینتریه که به خودِ شئ اشاره می‌کنه. به عنوان مثال ما یک وکتور از 
همه اشیاء از کلاس های مشتق شده از کلاس A داریم. پوینتر هایی که توی این 
وکتور هستند(که به اشیاء اشاره می‌کنن) به عنوان سطح سوم پوینتر ها محسوب 
میشن.

بنابراین برای اجرای یه تابع ویرچوال که به صورت dynamic binding میخواد
صدا زده بشه، حداقل ۳ بار pointer dereferencing اتفاق میوفته که این موجب
افزایش زمان اجرایی میشه. همچنین ذخیره کردن پوینتر مرحله ۲ و خودِ vtable
هم باعث استفاده بیشتر از مموری میشه. اگر پرفورمنس و سرعت توی برنامه ای 
که داریم می‌نویسیم یک اصل بسیار مهم و سفت و سخته،‌ بهتره که از پلی 
مورفیسم استفاده نکنیم.

## RunTime Type Information

تا اینجا وقتی به صورت پلی‌مورفیسم کار می‌کردیم، نیاز نبود بدونیم هر 
آبجکت دقیقا از چه نوعیه. اما ممکنه گاهی این نیاز رو پیدا بکنیم. با 
استفاده از قابلیت RTTI یا همون RunTime Type Information و قابلیت dynamic
cast میتونیم در زمان اجرا بفهمیم که شئ ما از چه نوعیه و رفتار متناسب با
خودش رو باهاش انجام بدیم. با استفاده از dymanic_cast میتونیم یه اشاره 
گر از جنس کلاس والد رو که داره به یکی از کلاس های فرزند اشاره می‌کنه به 
یک اشاره گر از نوع خودِ کلاس فرزند تغییر بدیم. فرقش با static_cast اینه 
که تایپ چک انجام میده و اگر کلاسی که داره بهش اشاره میشه از نوع کلاسی 
نباشه که میخواد بهش cast بشه، تبدیل انجام نمیشه.

همچنین با استفاده از typeid میتونیم در زمان اجرا بفهمیم که یه شئ از 
چه نوعیه. با استفاده از متود name اش میتونیم اسم جنسِ یه شئ رو به صورت 
یه رشته بگیریم.

## در پایان

فصل بعدی توی I/O بیشتر عمیق میشیم.