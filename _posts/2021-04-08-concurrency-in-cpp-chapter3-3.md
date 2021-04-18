---
title: "همزمانی در سی++(۳): Dead Lock ها"
categories: [سی++]
tags: [C++, concurrency in action, concurrent processing, موازی کاری, همزمانی, سی++, سی++۱۷, shared data, mutex, "std::mutex", میوتکس, "Dead Lock", ددلاک, "std::lock", "std::scoped_lock", "thread_local", "Storage class specifier", thread, multithread, multi thread, multi threading, چند نخی, برنامه نویسی چند نخی]
---

خب در پست قبل این مسئله که ترد ها برای استفاده از داده باهم مسابقه می‌دن رو کمی بررسی کردیم و یک راه حل دم دست هم براش پیشنهاد دادیم. توی این پست میخوایم در مورد مشکلی بحث کنیم که یجورایی برعکس Race condition هست. توی این مشکل، ترد ها منتظر همدیگه میمونن که از یه داده ای استفاده کنن. انقدر منتظر میمونن که عملا هیچکدومشون کاری دیگه انجام نمیده. به این مشکل چی میگن؟ می‌گن *Dead Lock*.

## دِدْلاک(Dead Lock) چیه و چطور حلش کنیم

اگه بخوام دقیق‌تر توضیح بدم، فرض کنید دوتا mutex داریم که برای انجام یک عملیات نیازمند این هستیم هر دو این میوتکس ها قفل بشن. حالا فرض کنید که دوتا ترد هم داریم که ترد اولی یکی از اون mutex ها و ترد دوم اون یکی mutex رو قفل کردن. نتیجه این میشه که هر دوی این ترد ها منتظر میمونن تا دومین mutex آزاد بشه تا بتونن قفلش کنن و کار خودشون رو انجام بدن. به این ترتیب هیچکدوم از اونها کاری از پیش نمی‌برن.

اساسا زمانی که بیشتر از یک mutex رو قفل کنیم، احتمال بوجود اومدن ددلاک وجود داره. یک راهی که پیشنهاد میشه اینه که همیشه یک ترتیب خاصی رو در قفل کردن میوتکس ها حفظ کنیم. اگه همیشه اول mutex A رو قفل کنیم و بعدش mutex B رو قفل کنیم، به ددلاک نمیخوریم. اما باز هم مثل بقیه جاهای زندگی، همه چیز انقدرا هم ساده نیست. فرض کنید یک تابع `swap(A& a, A&b)` داریم که محتویات a و b رو باهم جابجا می‌کنه. همیشه هم داخل این تابع در ابتدا میوتکس مربوط به آرگومان اولی قفل میشه و سپس میوتکس آرگومان دومی قفل میشه. آیا دیگه Dead Lock نخواهیم داشت؟ نخیر! خواهیم داشت. فرض کنید دوتا ترد داشته باشیم که همزمان سعی کنن محتوای دوتا شئ رو باهم عوض کنن؛ فقط با ترتیب برعکس (:

```cpp
swap(a, b) // thread 1
swap(b, a) // thread 2
```

همین برای یه ددلاک نا زیبا کافیه (:

خوشبختانه دوستان ما در کتابخانه استاندارد همچین چیزی رو پیش‌بینی کردن و برامون `std::lock` (و در استاندارد ۱۷ به بعد که مورد علاقه من هم هست `scoped_lock`)رو درست کردن. این تابع می‌تونه دوتا ‌میوتکس رو به شکل همزمان قفل کنه و اگه یکی از میوتکس ها آزاد نباشه، بلافاصله اون یکی رو آزاد می‌کنه. یعنی اینطوری که: یا هردو یا هیچکدوم!

```cpp
class some_big_object;
void swap(some_big_object& lhs,some_big_object& rhs);
class X
{
private:
    some_big_object some_detail;
    std::mutex m;
public:
    X(some_big_object const& sd):some_detail(sd){}
    friend void swap(X& lhs, X& rhs)
    {
        if(&lhs==&rhs)
            return;
        std::lock(lhs.m,rhs.m);
        std::lock_guard<std::mutex> lock_a(lhs.m,std::adopt_lock);
        std::lock_guard<std::mutex> lock_b(rhs.m,std::adopt_lock);
        // 3 lines above could brief in: scoped_lock(lhs.m, rhs.m)
        swap(lhs.some_detail,rhs.some_detail);
    }
};
```

## راه های دیگه

### از قفل کردن های تو در تو بپرهیزید

مسئله ساده‌ست. اول اینکه سعی کنید تا جای ممکن بیشتر از یدونه mutex رو قفل نکنید. اگر مجبور بودیم، حداقل میوتکس ها رو به صورت همزمان- حالا با استفاده از `std::lock` یا `std::scoped_lock`)- قفل کنید.

### قفل کردن با ترتیب معین و مشخص

قبل تر هم گفتم، اگه با ترتیب خاصی این قفل کردن رو انجام بدیم با تقریب خوبی زیاد به مشکل نمی‌خوریم. اگه مجبوریم دوتا میوتکس رو جدا جدا قفل کنیم، بهتره که ترتیبشون رو در همه جا رعایت بکنیم. ولی خب اینکار هم نیازمند مراقبت های دیگه‌ست. به عنوان مثال یک لیست دو پیوندی رو در نظر بگیرید. برای پیمایش این  لیست ما میایم و هر گره ای که میخوایم بخونیم رو قفل می‌کنیم و برای حرکت کردن هم میایم گره بعدی/قبلی رو قفل می‌کنیم و گره فعلی رو آزاد می‌کنیم. اینجا هم مشکل هست. اگر دوتا ترد به شکل همزمان ولی با جهت عکس همدیگه(یعنی یکی از اول لیست بره آخر و اون یکی برعکس) شروع به پیمایش لیست بکنن، در وسط لیست به dead lock میخورن. راه حل اینه که یک محدودیت اضافی بذاریم که فقط یکی از نحوات پیمایش کردن مجاز باشه :) پس باید حواسمون به خیلی چیزا باشه.

![picture](https://mark.nl.tab.digital/s/Ejd85qkYcKAAP84/preview){: .normal }
_اگه در این وضعیت دوتا ترد مخالف جهت همدیگه شروع به حرکتت کنن،‌ ددلاک خواهیم داشت_

### استفاده از قفل های سلسله‌مراتبی

ایده کلی‌ش تقریبا همون راه قبلیه فقط با این تفاوت که میایم و یک Lock hierarchy درست می‌کنیم که بیاد در runtime چک کنه که آیا ترتیب قفل شدن میوتکس ها صحیحه یا نه. اینطوری کمتر نیاز داریم که «خودمون حواسمون جمع باشه که ترتیب رو رعایت کنیم».

حالا این ایده چطوری کار می‌کنه؟ اینطوری که میایم و برنامه‌مون رو به لایه های مختلف تقسیم می‌کنیم و مشخص می‌کنیم که هر میوتکس مربوط به کدوم لایه‌ست. قانون قفل کردن رو هم اینطوری قرار می‌دیم که فقط از بالا به پایین امکان قفل کردن وجود داشته باشه. یعنی اگر فرض کنیم لایه ۱ بالای لایه ۲ و لایه ۲ هم بالای لایهٔ ۳ قرار داشته باشه و الی آخر، فقط تنها زمانی می‌تونیم مثلا لایه ۲ رو قفل کنیم که لایه های پایین ترش آزاد باشن. بنابراین فقط می‌تونیم از بالا به پایین حرکت کنیم.

```cpp
hierarchical_mutex high_level_mutex(10000);
hierarchical_mutex low_level_mutex(5000);
hierarchical_mutex other_mutex(6000);

int do_low_level_stuff();
int low_level_func()
{
	std::lock_guard<hierarchical_mutex> lk(low_level_mutex);
	return do_low_level_stuff();
}
void high_level_stuff(int some_param);
void high_level_func()
{
	std::lock_guard<hierarchical_mutex> lk(high_level_mutex);
	high_level_stuff(low_level_func());
}

void thread_a()
{
	high_level_func();
}

void do_other_stuff();
void other_stuff()
{
	high_level_func();
	do_other_stuff();
}

void thread_b()
{
	std::lock_guard<hierarchical_mutex> lk(other_mutex);
	other_stuff();
}

```
کد بالا نمونه استفاده از یک میوتکس سلسله مراتبی یا hierarchical mutex هست. ترد a بدون مشکل می‌تونه به کارش ادامه بده چون میوتکس هاش رو با رعایت قوانین(که بالاتر ذکر کردم) قفل می‌کنه. اما ترد b به مشکل میخوره. چرا؟ چون اول اومده `other_mutex` که عددش برابر با 6000 هست رو قفل کرده. بعدش چی؟ بعدش در تابع `other_stuff()` اومده و یک میوتکس با عدد 10000 رو قفل کرده. و این مشخصا خلاف قوانینی که گفتیمه چرا که ترد ها فقط میتونن ترد هایی با عدد کمتر از عدد فعلی رو قفل کنن و برعکسش امکان پذیر نیست. به همین شکل، ترتیب قفل کردن ترد ها رعایت می‌شه (: 

البته این روش هم مشکلاتی داره... به عنوان مثال برای پیمایش یک لیست که نیازمند دست به دست کردن یا hand-over-hand کردن قفلِ میوتکس ها هست، جواب نمیده برای اینکه اونوقت به تعداد گره های لیست نیاز به سطح/لایه/... داریم! :/

## Storage class specifier: `thread_local`

اگه بخوایم یه متغییری داشته باشیم که به ازای هر «ترد» ازش ساخته بشه، از این مشخصه استفاده می‌کنیم.

```cpp
thread_local unsigned int value = 1; 
```
فرض کنیم دو ترد به اسم a و b داریم. اگر مقدار `value` در ترد a برابر با ۲ بشه، همه اونهایی که در ترد a هستن مقدار ۲ رو می‌بینن ولی مقدار `value` در ترد b همون ۱ هست و تغییری نمی‌کنه. بنابراین، این نوع متغییر ها فقط به ازای هر ترد براشون حافظه تخصیص داده می‌شه و در پایان کار هر ترد هم از بین می‌رن.

## پایان

بحث دِدلاک هم تقریبا فهمیدیم چیه و چطور میشه ازش جلوگیری کرد. متاسفانه دوباره دارم برمیگردم به اون حالت هیچکاری نکردن و عقب موندن از همه کارهام. از این وضعیت خوشم نمیاد. سعی می‌کنم تغییرش بدم.

در پست بعدی درباره اینکه چطور با میوتکس ها می‌تونیم ژانگولر بازی در بیاریم صحبت می‌کنیم.















