---
title: "Delegating Constructors"
# categories: [سی++]
# tags: [C++, constructor, delegate, duplicate code, overlapping constructor, سی++]
tags: [cplusplus]
path: blog/delegating-constructors
cover: ../cplusplus.png
date: 1399-05-29
excerpt: "قابلیت constructor delegation در سی++"
---

قبلا وقتی داشتم یه کلاسی می‌نوشتم که چنتا کانستراکتور داشت و اون 
کانستراکتور ها فقط در بخش کوچیکی از کارها باهم تفاوت داشتن، میومدم و 
کدهارو چندبار کپی می‌کردم.

بعد ها اومدم اون قسمتی که بین‌شون مشترکه رو توی یه تابع دیگه قرار دادم و هرجا که نیاز بود اون رو صدا می‌زدم.

نمی‌دونستم که سی++ یه قابلیتی داره به اسم _constructor delegation_

فرض کنیم همچین کدی داریم:

```cpp
class Foo
{
public:
    Foo()
    {
        // code to do A
    }
  
    Foo(int value)
    {
        // code to do A
        // code to do B
    }
};
```

همونطور که می‌بینیم، کد کانستراکتور اولی توی کانستراکتور دومی کپی 
شده. برای اینکه از اینکار جلوگیری کنیم، از قابلیت delegate کردن 
کانستراکتور ها استفاده می‌کنیم و کد ما این شکلی می‌شه:

```cpp
class Foo
{
private:
  
public:
    Foo()
    {
        // code to do A
    }
  
    Foo(int value): Foo{} // use Foo() default constructor to do A
    {
        // code to do B
    }
  
};
```

توی این کد وقتی کانستراکتور دومی صدا زده میشه،‌ اول میاد و 
کانستراکتور اولی رو صدا میزنه و بعد میره کد های مربوط به خودش رو اجرا 
می‌کنه (: خیلیم قشنگ. به کانستراکتور دومی اصطلاحا می‌گن _delegator_.

## نکات

+ امکان اینکه کانستراکتور A یک delegate برای کانستراکتور B باشه و 
	همین کانستراکتور B یک delegate برای کانستراکتور A باشه وجود داره. این 
	باعث میشه که برنامه شما کرش کنه. پس باید مراقب باشیم که حلقه بی نهایت 
	پیش نیاد.
+ کانستراکتوری که _delegator_ هست نمیتونه عمل member initialization رو انجام بده. در حالت کلی، یک کانستراکتور نمیتونه همزمان هم _initializer_ باشه و هم _delegator_.
