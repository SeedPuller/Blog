---
title: "اشاره گر های هوشمند: shared_ptr"
categories: [سی++]
tags: [C++, c++ modern, RAII, shared_ptr, smart pointer, weak_ptr, اشاره گر, اشاره گر هوشمند, سی++]
---


[توی پست قبل](https://seedpuller.space/2020/08/26/smart-poitners-unique-ptr/)
درباره اینکه چرا باید از اشاره گر های هوشمند استفاده کنیم حرف زدم و 
کلاس std::unique_ptr رو بررسی سطحی کردیم. توی این پست قراره درباره نوع 
دیگه ای از اشاره گر های هوشمند بنویسم که برعکس unique_ptr به ما اجازه 
میده چند شئ بتونن یک حافظه یکسان رو مدیریت کنن.

## نحوه عملکرد

کلاس shared_ptr اینطور عمل می‌کنه که تعداد اشیاء ای که دارن از یک 
حافظه خاص نگهداری می‌کنن رو یادش میمونه و تنها زمانی اون حافظه رو آزاد 
می‌کنه که آخرین شئ نگهدارنده بخواد از بین بره.

مثال زیر:

```cpp
#include <iostream>
#include <memory> // for std::shared_ptr
  
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};
  
int main()
{
    // allocate a Resource object and have it owned by std::shared_ptr
    Resource *res = new Resource;
    std::shared_ptr<Resource> ptr1(res);
    {
        std::shared_ptr<Resource> ptr2(ptr1); // use copy initialization to make another std::shared_ptr pointing to the same thing
  
        std::cout << "Killing one shared pointer\n";
    } // ptr2 goes out of scope here, but nothing happens
  
    std::cout << "Killing another shared pointer\n";
  
    return 0;
} // ptr1 goes out of scope here, and the allocated Resource is destroyed
```

که خروجی این کد به شکل زیر هست:

```
Resource acquired
Killing one shared pointer
Killing another shared pointer
Resource destroyed
```

اگر این یک کلاس unique_ptr بود، کدی که درون بلوک داخلیِ main قرار 
داشت می‌بایست حافظه رو آزاد می‌کرد اما با استفاده از این کلاس دیگه این 
اتفاق نمیوفته.

یه نکته هست که باید بهش توجه بشه اونم اینکه برای ساختن ptr2 باید ptr1
رو بهش پاس بدیم تا عمل کپی انجام بگیره. اگر اشتباها res رو بهش بدیم، 
دیگه اون دوتا شئ همدیگه رو نمی‌شناسن و ptr2 میاد حافظه ای که گرفته رو 
حذف می‌کنه.

## make_shared

کلاس shared_ptr هم مثل unique_ptr یه همراه به اسم make_shared داره که
بهتره بجای گرفتن حافظه به طور دستی و پاس دادنش به کلاس shared_ptr، از 
make_shared استفاده کنیم تا جلوی خیلی از مشکلات هم گرفته بشه(یکیش همون 
نکته ای که بالاتر گفتم).

نحوه استفاده‌ش هم خیلی ساده‌ست:

```cpp
#include <iostream>
#include <memory> // for std::shared_ptr
  
class Resource
{
public:
    Resource() { std::cout << "Resource acquired\n"; }
    ~Resource() { std::cout << "Resource destroyed\n"; }
};
  
int main()
{
    // allocate a Resource object and have it owned by std::shared_ptr
    auto ptr1 = std::make_shared<Resource>();
    {
        auto ptr2 = ptr1; // create ptr2 using copy initialization of ptr1
  
        std::cout << "Killing one shared pointer\n";
    } // ptr2 goes out of scope here, but nothing happens
  
    std::cout << "Killing another shared pointer\n";
  
    return 0;
} // ptr1 goes out of scope here, and the allocated Resource is destroyed
```

به همین راحتی (:

## این کلاس چطور کار می‌کنه؟

درواقع نحوه کار این کلاس اینطوری هست که بجز یک اشاره گر که برای حافظه
ای که نگهداری می‌کنه، یک اشاره گر دیگه هم به یک Control Block داره که 
درواقع اونم یک شئ هست که وظیفه‌ش نگهداری تعداد اشیاء ای هست که دارن به 
حافظه مربوطه اشاره می‌کن.

برای همینه که برای ساختن یک شئ جدید اگر از عمل کپی کردن استفاده 
نکنیم، دیگه این کلاس کاربرد نداره. برای اینه که وقتی از عمل کپی استفاده 
می‌کنیم اون control block میفهمه که یک شئ دیگه ای هم در کاره.

اما وقتی به صورت مستقیم یک حافظه رو در اختیار یک shared_ptr می‌‌ذاریم، میاد و یک control block جدید برای خودش می‌سازه.

## پایان

در آخر چیز خیلی خاصی به ذهنم نمی‌رسه که بخوام بگم (:

شاید بعدا یه پست درباره weak_ptr و مشکل circular dependency هم نوشتم (:
راستی، این کلاس هنوز به درسی از آرایه ها پشتیبانی نمی‌کنه و احتمالا این پشتیبانی توی سی++ ۲۰ بهش اضافه میشه.
