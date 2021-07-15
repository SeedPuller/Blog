---
title: "اشاره گر های هوشمند: unique_ptr"
# categories: [سی++]
# tags: [C++, make_unique, smart pointer, unique, unique_ptr, اشاره گر, اشاره گر هوشمند, برنامه نویسی, سی++, سی++ مدرن, سی++ ۱۱]
tags: [cplusplus]
path: blog/smart-poitners-unique-ptr
cover: ../cplusplus.png
date: 1399-06-05
excerpt: "بررسی کلاس unique_ptr از اشاره‌گر های هوشمند"
---

موضوع اشاره گر ها همیشه یکی از چالش های زبان هایی مثل سی و سی++ بوده.
اینکه یه حافظه ای رو از سیستم بگیریم، آزادش کنیم و مراقب باشیم که حافظه
ای که گرفته شده معتبر باشه تا برای استفاده کردن ازش یا آزاد کردنش مشکلی
پیش نیاد و هزارتا چیز دیگه.

اشاره گر های هوشمند اومدن تا کار مارو راحت کنن. تا دیگه کمتر ذهن برنامه نویس درگیر امنیت اشاره گر ها و مسائل دیگه باشه.

بنابراین یکی از ارکان سی++ مدرن میتونه استفاده از اشاره‌گر های هوشمند باشه.

توی این پست راجع به کلاس `unique_ptr` و make_unique می‌نویسم که [قبلا یه اشاره های ریزی بهش کرده بودم](https://seedpuller.space/2020/07/27/deitel-chapter17-exception-handling/).

## چرا از اشاره‌گر هوشمند استفاده کنیم

به این قطعه کد دقت کنید:

```cpp
#include <iostream>
  
void someFunction()
{
    auto *ptr{ new Resource() };
  
    int x{};
    std::cout << "Enter an integer: ";
    std::cin >> x;
  
    if (x == 0)
        throw 0; // the function returns early, and ptr won’t be deleted!
  
    // do stuff with ptr here
  
    delete ptr;
}
```

مشکلی که هست اینه که اگر x = 0 اونوقت یک exception پرتاب میشه و 
همونجا کار تابع تموم میشه بنابراین برنامه هیچوقت به اون خطی که در اون `delete` نوشته شده نمیرسه و اینجا memory leak یا نشت حافظه رخ میده. 

شاید بگیم خب این یک موضوع ساده‌ست و میشه قبل از پرتاب کردن استثنا، 
بیایم و حافظه رو پاک کنیم. خب این یه کار اضافه برای برنامه نویسه. سخته 
که برنامه نویس همش حواسش باشه که کجا حافظه گرفته و کجا آزادش نکرده.

اگر میشد حافظه پویایی که اشاره گر ها بهش اشاره می‌کنن هم مثل متغییر 
ها و اشیاء معمولی که وقتی out of scope میشن ازبین میرن، آزاد بشن خیلی 
خوب میشد. 

ایده اشاره گر های هوشمند هم همینه. یک شئ از یک کلاس ساخته میشه که 
وظیفه‌ش نگهداری از حافظه گرفته شده‌ست. همونطور که می‌دونیم وقتی اشیاء 
out of scope می‌شن، ازبین میرن و تابع destructor اونها صدا زده میشه. پس 
فقط کافیه که این کلاس ما در دیستراکتور خودش بیاد و حافظه ای که گرفته شده
رو `delete` کنه.

## استفاده از unique_ptr

تا قبل از سی++ ۱۱ کلاسی به اسم auto_ptr وجود داشت که خیلی مزخرف بود. 
سی++ ۱۱ با معرفی unique_ptr اومد و کلاس قبلی رو منسوخ کرد و کلاس 
auto_ptr توی سی++ ۱۷ به کلی حذف شد.

این کلاس اوپراتور های ستاره(*) و `->` رو overload کرده بنابراین میشه تقریبا مثل پوینتر معمولی ازش استفاده کرد.

یک مثال ساده از unique_ptr :

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr
  
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};
  
int main()
{
    // allocate a Resource object and have it owned by std::unique_ptr
    std::unique_ptr<Resource> res{ new Resource() };
  
    return 0;
} // res goes out of scope here, and the allocated Resource is destroyed
```

چون شئ ما روی استک ساخته میشه، وقتی که تابع به اتمام میرسه تمام 
متغییرها/اشیاء از بین میرن و به این ترتیب تابع دیستراکتور این کلاس میاد و
حافظه ای که گرفته شده رو آزاد می‌کنه. بدون اینکه نیاز باشه ما نگرانی 
خاصی بابت آزاد شدنش داشته باشیم.

## مالکیت اشاره گر در unique_ptr

این امکان موجود نیست که دو شئ از `unique_ptr` یک اشاره گر مشترک رو مدیریت کنند. به همین دلیل این کلاس توابع مربوط به کپی رو غیرفعال کرده.

بنابراین برای اینکه محتوای یک شئ از `unique_ptr` رو برابر با شئ دیگری از همین کلاس قرار بدیم باید دوتا نکته رو مدنظر داشته باشیم:

+ باید از move semantics استفاده بکنیم. بنابراین اگر مقدار ما r-value نیست باید از `std::move` استفاده بکنیم.
+ بعد از اینکار، شئ اولیه ما (که در سمت راست علامت مساوی قرار میگیره) دیگه مسئول مدیریت اون اشاره گر نیست و یک شئ خالی محسوب میشه.

مثال:

```cpp
#include <iostream>
#include <memory> // for std::unique_ptr
  
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};
  
int main()
{
    std::unique_ptr<Resource> res1{ new Resource{} }; // Resource created here
    std::unique_ptr<Resource> res2{}; // Start as nullptr
  
    std::cout << "res1 is " << (static_cast<bool>(res1) ? "not null\n" : "null\n");
    std::cout << "res2 is " << (static_cast<bool>(res2) ? "not null\n" : "null\n");
  
    // res2 = res1; // Won't compile: copy assignment is disabled
    res2 = std::move(res1); // res2 assumes ownership, res1 is set to null
  
    std::cout << "Ownership transferred\n";
  
    std::cout << "res1 is " << (static_cast<bool>(res1) ? "not null\n" : "null\n");
    std::cout << "res2 is " << (static_cast<bool>(res2) ? "not null\n" : "null\n");
  
    return 0;
} // Resource destroyed here when res2 goes out of scope
```

نتیجه این کد به این صورته:

```
Resource acquired
res1 is not null
res2 is null
Ownership transferred
res1 is null
res2 is not null
Resource destroyed
```

## unique_ptr و آرایه ها

خوشبختانه این کلاس میتونه تشخیص بده که چه زمانی باید از` delete[]` استفاده کنه و چه زمانی از `delete` و همچنین باهاش میشه آرایه هم ساخت.

## std::make_unique

این کلاس که توی سی++ ۱۴ اضافه شده این امکان رو فراهم کرده که به سادگی با `unique_ptr` کار کنیم و همچنین از مشکلات احتمالی مثل exception safety و یا تغییر ناخواسته اشاره گر اصلی(که کلاس `unique_ptr` داره ازش نگهداری می‌کنه) جلوگیری می‌کنه.

فقط کافیه بهش اسم اون type ای که قراره براش حافظه بگیریم رو به عنوان 
آرگومان های تمپلیت بهش بدیم و همچنین آرگومان هایی که میخوایم موقع ساختن 
اون type بهش داده بشه رو به عنوان آرگومان های تابعی به این کلاس بدیم. 
فکر کنم توضیحم گنگ بود بنابراین بهتره که به مثال توجه کنیم:

```cpp
#include <memory> // for std::unique_ptr and std::make_unique
#include <iostream>
  
class Fraction
{
private:
    int m_numerator{ 0 };
    int m_denominator{ 1 };
  
public:
    Fraction(int numerator = 0, int denominator = 1) :
        m_numerator{ numerator }, m_denominator{ denominator }
    {
    }
  
    friend std::ostream& operator<<(std::ostream& out, const Fraction &f1)
    {
        out << f1.m_numerator << '/' << f1.m_denominator;
        return out;
    }
};
  
  
int main()
{
    // Create a single dynamically allocated Fraction with numerator 3 and denominator 5
    // We can also use automatic type deduction to good effect here
    auto f1{ std::make_unique<Fraction>(3, 5) };
    std::cout << *f1 << '\n';
  
    // Create a dynamically allocated array of Fractions of length 4
    auto f2{ std::make_unique<Fraction[]>(4) };
    std::cout << f2[0] << '\n';
  
    return 0;
}
```

خروجی کد هم:

```
3 / 5
0 / 1
```

درکل توصیه میشه که بجای اینکه مستقیما از `unique_ptr` استفاده بشه، از این کلاس استفاده بشه. 

هم بهینه تره و هم امن تر.

## پاس دادن `unique_ptr` به یک تابع

همونطور که بالاتر گفتم، این کلاس توابع مربوط به کپی رو غیرفعال کرده 
بنابراین با استفاده از move semantic ها، وقتی انتقال انجام میشه دیگه شئ 
اولیه مسئول مدیریت حافظه مربوطه نیست. 

بنابراین اگر یک شئ از این کلاس رو با استفاده از move به یک تابع پاس 
بدیم، مالکیتش به شئ داخل تابع منتقل میشه و با تموم شدن کار اون تابع، 
حافظه ما هم (که در بیرون از تابع allocate شده) آزاد میشه.

برای جلوگیری از این مشکل بهتره که از تابع `get()` استفاده بکنیم.

مثال زیر:

```cpp
#include <memory> // for std::unique_ptr
#include <iostream>
  
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
  
    friend std::ostream& operator<<(std::ostream& out, const Resource &res)
    {
        out << "I am a resource\n";
        return out;
    }
};
  
// The function only uses the resource, so we'll accept a pointer to the resource, not a reference to the whole std::unique_ptr<Resource>
void useResource(Resource *res)
{
    if (res)
        std::cout << *res << '\n';
}
  
int main()
{
    auto ptr{ std::make_unique<Resource>() };
  
    useResource(ptr.get()); // note: get() used here to get a pointer to the Resource
  
    std::cout << "Ending program\n";
  
    return 0;
} // The Resource is destroyed here
```

و خروجی کد هم به این زیبایی هست:

```
Resource acquired
I am a resource
Ending program
Resource destroyed
```

## پایان

در آخر بهتره که بجای اشاره گر خام از اشاره گر هوشمند استفاده بکنیم و همچنین نکات مربوط به اونها رو یادمون بمونه:

+ سعی کنیم از make_unique استفاده بکنیم
+ وقتی مدیریت یک اشاره گر رو به این کلاس می‌سپریم دیگه نباید اون اشاره گر رو به صورت دستی تغییر بدیم(آزاد کنیم یا هرچیز دیگه)
+ نباید دو یا چند شئ از این کلاس از یک حافظه یکسان نگهداری کنن
