---
title: "فصل ۱۹ دایتل: نکاتی درباره پیاده سازی ساختمان داده ها"
categories: [سی++]
tags: [C++, data structure, dependant, dependant name, non-dependant, non-dependant name, دایتل, سی++, ساختمان داده]
---


این فصل از دایتل درباره پیاده سازی ساختمان داده های مرسوم مثل لیست 
پیوندی، صف، استک و درخت دودویی با استفاده از تمپلیت ها بود. چون من این 
چیز ها رو از قبل بلد بودم بنابراین این پست بسیار کوتاه بود چون همونطور 
که میدونیم، من فقط چیزهایی رو می‌نویسم که به نظرم جدیدن.

## کلاس Self-Referential

کلاس های خود ارجاعی به کلاسی گفته میشه که یک data member داشته باشه که به یک شئ از جنس خود کلاس اشاره میکنه.

## نام های وابسته و غیر وابسته (dependent names vs non-dependent)

به کد زیر توجه کنید:

![](https://seedpuller.space/wp-content/uploads/2020/08/image-2.png)

توابعی که توی این کد استفاده شده در کلاس List تعریف شدن.

همونطور که می‌بینید، کلاس `Stack` از کلاس `List`
که یک class template هست ارث بری کرده و همونطور که می‌دونیم، تمپلیت ها 
درواقع همون function overloading هستند که وقتی type رو براشون مشخص 
می‌کنیم، کامپایلر با اون type مشخص شده کد رو تولید می‌کنه.

خط ۱۳ و خط ۱۸ نمونهٔ اسم های وابسته هستن.

یعنی چی؟ یعنی اینکه تا وقتی نوع `STACKTYPE` مشخص نشده 
باشه، کد کلاس List تولید نشده و در نتیجه توابع ذکر شده هم تولید نشدن و 
کامپایلر این رو می‌فهمه(چون می‌بینه در ورودی‌شون یه `STACKTYPE` دارن).

خط ۲۳ و ۲۸ نمونه اسم های غیر وابسته یا non-dependent هستن. 

این تابع ها(مثل `isEmpty` و `print`) چون هیچ 
ورودی ای ندارن، پس وابسته به type نیستند و کامپایلر وقتی به خطی می‌رسه 
که داره تابع print رو صدا می‌زنه،‌ گمون می‌کنه که این یک تابع معمولیه و 
کدش موجوده(درحالی که این تابع جزئی از کلاس List هست و تا مشخص شدن `STACKTYPE` کدی براش تولید نمیشه).

این مسئله باعث میشه ارور بوجود بیاد.

برای اینکه به کامپایلر بفهمونیم این توابع نباید در زمان دیده شدن 
resolve بشن و resolve شدن‌شون رو باید به بعد از تولید کد template موکول 
کرد، از کلمه `this` استفاده می‌کنیم.

## پایان

فصل بعدی درباره الگوریتم های مرتب سازی (sort) و جستجو (search) هست.