---
title: "فصل ۱۷ دایتل: نگاهی عمیق تر به Exception Handling"
# categories: [سی++]
# tags: [exception, exception handling, RAII, STL, unique_ptr, مدیریت استثنا, اشاره گر, اشاره گر هوشمند, دایتل, سی++]
tags: [cplusplus]
path: blog/deitel-chapter17-exception-handling
cover: ../cplusplus.png
date: 1399-05-05
excerpt: "نکات عمیق تری رو راجع به مدیریت استثنا ها"
---

توی این فصل قراره نکات عمیق تری رو راجع به مدیریت استثنا ها یاد 
بگیریم بنابراین مفاهیم اولیه مثل اینکه exception چی هست و چرا باید 
استفاده بشه و چطور میشه یک استثنا برای خودمون بنویسیم رو ذکر نمی‌کنم.

## یادآوری

نکته اول اینکه همیشه باید سعی کنیم توی بلوک catch، تایپ مربوط به 
exception رو به صورت رفرنس بگیریم چراکه اولا از کپی شدن آبجکت اکسپشن 
جلوگیری میکنه و دوم اینکه باعث میشه اگر اکسپشن ما از stdexcept ارث بری 
شده، بتونه به درستی اجرا بشه.

یه بلاک try میتونه چندین بلاک catch رو بعد از خودش داشته باشه که هرکدوم یک استثنا خاصی رو هندل میکنن.

**دو نوع مدل برای هندل کردن استثنا داریم:** 

## termination model of exception handling

توی این مدل(که زبان سی++ از این مدل استفاده می‌کنه) وقتی داخل try یک 
اکسپشن پرت میشه(throw)، در همون نقطه از بلاک try بیرون میاد(اصطلاحا بهش 
میگن throw point) و بعد از پیدا کردن بلاک catch مورد نظرش میره و خطی که 
بعد از catch هست رو اجرا میکنه. نه خطی که بعد از throw point هست.

## resumption model of exception handling 

این مدل برعکس مدل بالاست و وقتی کار بلوک catch تموم میشه، برمیگرده و 
از ادامهٔ throw point یا همون نقطه پرتاب کد هارو اجرا می‌کنه.

با اینکه کلمهٔ throw میتونه هر چیزی رو پرت بکنه(مثل return) اما بهتره که فقط exception object رو پرت کنیم.

## پرت کردن دوباره یک استثنا یا rethrowing exception

گاهی ممکنه وضعیتی پیش بیاد که نیاز باشه یک استثنا رخ داده شده رو 
چندبار پردازش کنیم. به عنوان مثال فرض کنید در یک تابع چند حافظه رو `new` کردیم و بعد از تخصیص حافظه و در جایی از این تابع یک exception پرت بشه. اینجا ما میخوایم هم حافظه ای که گرفته شده رو `delete` کنیم و هم به تابع صدا زننده‌مون اطلاع بدیم که در این تابع یک استثنا رخ داده. 

برای اینکه اینکار انجام بشه کافیه در بلوک catch ای که داریم یکبار دیگه `throw` کنیم تا به تابع صدا زننده بره. کد زیر کاملا شفافه و با خوندنش میتونیم بفهمیم دقیقا منظور از rethrowing exception چیه.

![](https://seedpuller.space/wp-content/uploads/2020/07/image-4.png)

## Stack unwinding

وقتی یک استثنا پرتاب میشه، برنامه به دنبال یک بلوک catch می‌گرده که 
متناسب با استثنا پرتاب شده باشه. اگر در جایی(تابعی) که قرار داره نتونه 
یک catch رو پیدا بکنه، اون تابع رو terminate می‌کنه و میره به جایی که 
تابع ما داخلش صدا زده شده. اگر اونجا هم بلوک catch ای وجود نداشت که 
متناسب با استثنا پرت شده بود، باز هم تابع رو terminate میکنه و میره به 
تابع صدا زننده‌ش و این کار تا موقعی که بتونه یک catch رو پیدا کنه ادامه 
داره.

اگر هیچ catch متناسبی پیدا نشه در نهایت برنامه بسته میشه.

به این فرآیند میگن stack unwinding چراکه function stack رو پیمایش می‌کنه و دونه دونه به سمت تابع بیرونی حرکت می‌کنه.

مثال زیر به روشن شدن ماجرا کمک می‌کنه:

![](https://seedpuller.space/wp-content/uploads/2020/07/image-5.png)

![](https://seedpuller.space/wp-content/uploads/2020/07/image-6.png)

## کلمه `noexcept`

اگر تابعی داشته باشیم که به هیچ عنوان استثنا ای رو پرت نمی‌کنه یا 
توابعی رو صدا میزنه که اونها هم استثنا ای رو پرت نمی‌کنن، میتونیم صراحتا
به عنوان تابعی که استثنا نداره تعریفش کنیم:

```cpp
int functionWithoutException() noexcept;
```

اینکار به کسای دیگه (و حتی خودمون) کمک میکنه که وقتی داریم کد رو 
می‌خونیم بدونیم این تابع هیچجوره استثنا رو پرت نمی‌کنه و بنابراین با 
خیال راحت میتونیم خارج از بلوک try قرارش بدیم.

نکته: اگر تابع ما const هست،‌ حتما کلمهٔ `noexcept` رو باید بعد از `const` بذاریم. نمیدونم چرا.

## استثنا در Constructor و Destructor 

یه سری نکات وجود داره که بهش می‌پردازیم:

+ از اشیاء ای که به صورت گلوبال تعریف شدن و اشیاء ای که به صورت `static` تعریف شدن نباید استثنا ای پرت بشه چرا که این اشیاء قبل از _main_ ساخته میشن و نمیشه `catch` کردشون.
+ اگر یک شئ رو با استفاده از `new` ساخته باشیم و در کانستراکتورش یک استثنا رخ بده، اون حافظه ای که گرفته شده خود به خود آزاد میشه.
+ اگر کانستراکتور حافظه ای رو تخصیص داده، قبل از اینکه استثنا ای رو پرت بکنه باید حتما حافظه ای که گرفته رو پاک کنه! 

## استثنا ها در new

یکی از ویژگی های جالب سی++ که نظرمو جلب کرد، تابع `set_new_handler` (از هدر `<new>`)بود.
این تابع یک تابع(بدون ورودی و خروجی void) رو به عنوان ورودی خودش میگیره
و هر زمان و هرجای برنامه که موقع new کردن یک حافظه، مشکلی ایجاد بشه، 
اون تابع رو فراخوانی می‌کنه.

اگر تابع handler رجیستر نشده باشه،‌ در حالت پیشفرض `new` میاد و استثنا `bad_alloc` رو پرتاب می‌کنه.

## کلاس `unique_ptr`

توضیحاتش زیاده ولی اگر مختصر بخوام بگم، یکی از اشاره گر های هوشمند 
سی++ هست که این نیاز رو که مجبوریم هر حافظه ای که گرفتیم رو به صورت دستی
`delete` کنیم از بین می‌بره. خودش به صورت خودکار وقتی که out of scope بشه، حافظه رو برمیگردونه به سیستم.

یه مثال ازش میزنم: (کلاس Integer کار خاصی نمی‌کنه. فقط موقع نابود شدن یه متن چاپ میکنه و یه setter و getter داره)![](https://seedpuller.space/wp-content/uploads/2020/08/image.png)

تابع `make_unique` درواقع کار همون `new` رو انجام می‌ده و خط ۱۴ رو میشه به این شکل هم نوشت:

```cpp
unique_ptr<Integer> ptrToInteger {new Integer(7)}
```

### مالکیت در `unique_ptr`

هر اشاره گری فقط میتونه توسط یک شئ `unique_ptr` مدیریت بشه
و این امکان که یک اشاره گر توسط چند شئ مدیریت بشن وجود نداره. درواقع 
وقتی یک شئ از این کلاس به یک شئ دیگه نسبت داده میشه(assign)، مالکیت 
اشاره گر از شئ سمت راست به شئ سمت چپ منتقل میشه. 

این موضوع باعث میشه که بتونیم از `unique_ptr` برای پاس دادن آرگومان ها به تابع و یا برگردوندن اشاره گر از یک تابع استفاده بکنیم.

## سلسله مراتب Exception های استاندارد

![](https://seedpuller.space/wp-content/uploads/2020/08/image-1.png)

با catch کردن کلاس والد، همه استثنا هایی که فرزند اون کلاس هستند هم catch می‌شن.

اگر می‌خوایم همهٔ انواع استثنا هارو catch بکنیم، میتونیم اینطوری بنویسیم:

```cpp
catch (...)
{
 // code here 
}
```

یکی از بدیای این روش اینه که دیگه نمی‌تونیم به جزئیات ارور دسترسی 
داشته باشیم. البته، اگر در سطوح پایین تر(توابعی که تابع موجود رو صدا 
زدند) catch ای وجود داشته باشه، میتونیم با rethrow کردن استثنا به جزئیات
هم دسترسی داشته باشیم.

## پایان

در فصل بعد درباره Template ها صحبت می‌کنیم. فصل باحالیه.
