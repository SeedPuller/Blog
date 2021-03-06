---
title: نکات جدیدی که از فصل ۱۴ سی++ دایتل یاد گرفتم – چندریختی
# categories: [سی++]
# tags: [C++, file, file processing, standard library, یادگیری, پردازش فایل, دایتل, سی++]
tags: [cplusplus]
path: blog/what-I-learned-from-deitel-chapter14
cover: ../cplusplus.png
date: 1399-04-02
excerpt: "پردازش فایل ها در سی‌پلاس‌پلاس"
---


این فصل دربارهٔ پردازش فایل ها یا همون File Processing بود. بیشتر نکاتش رو از قبل می‌دونستم و صرفا برام مرور بود.

## کلاس های مورد استفاده‌مون

برای انجام پردازش فایلی باید هدر های `iostream` و `fstream` رو اینکلود کنیم. توی `fstream` این سه تا `typedef` وجود داره:

+ `typedef basic_ifstream <char> ifstream`
+ `typedef basic_ofstream <char> ofstream`
+ `typedef basic_fstream <char> fstream`

همونطور که می‌بینید این سه تا typdef برای نوع دادهٔ char ویژه سازی شده(specialized).

توی این کلاس ها اپراتور bool هم overload شده. به این معنی که میتونیم معتبر(valid) بودن یک شئ رو به این شکل بررسی کنیم:

```cpp
fstream my_file("something.txt", ios::out);
if (my_file) {
	// do something
}
```

## باز کردن فایل ها

برای باز کردن فایل ها چند حالت(mode) وجود داره که هرکدوم دارای ویژگی 
های خاصی هستن. نحوه‌ی نوشتنش و اینکه هرکدومشون چه کاری انجام می‌دن پایین
تر نوشته شده:

```cpp
ofstream handler("filename", ios::out)
```

`![](https://seedpuller.space/wp-content/uploads/2020/05/image.png)

نکتهٔ دیگه اینکه میتونیم این حالت هارو به صورت همزمان باهم دیگه 
استفاده بکنیم. چطوری؟ هرکدومشون رو با علامت «|»  (bitwise or) از هم جدا 
می‌کنیم:

```cpp
ofstream handler("filename", ios::in | ios::out | ios::binary)
```

## پیمایش در فایل

میتونیم به سی++ بگیم که از کجای فایل میخوایم شروع کنیم به 
نوشتن/خوندن. وقتی یک فایل رو(هم برای خواندن و هم نوشتن) باز می‌کنیم، دو 
اشاره گر ایجاد میشه که به ابتدای فایل(بایت شماره صفر) اشاره می‌کنن. یکی 
از این اشاره گر ها برای خوندن از فایل و دیگری برای نوشتن در فایل هست. 
برای تغییر مکان اشاره گرِ خوندن، از تابع `seekg` و برای تغییر مکان اشاگر نوشتن از تابع `seekp` استفاده می‌کنیم.

```cpp
fileObject.seekg(n); // position to the nth byte of fileObject (assumes ios::beg)
fileObject.seekg(n, ios::cur); // position n bytes in fileObject
fileObject.seekg(n, ios::end); // position n bytes back from end of fileObject
fileObject.seekg(0, ios::end); // position at end of fileObject
```

## خوندن و نوشتن در فایل

من خوندن و نوشتن رو از قبل بلد بودم پس اینجا فقط چیز هایی رو می‌نویسم
که به نظرم جالب تر بودن،‌ ممکنه یادم برن یا برام جدید بودن.

فرض کنیم یه فایلی داریم که متن های داخلش به این فرمت هستند:

`100 "some text" 200`

همونطور که میدونیم، input stream ها اسپیس رو به عنوان کلمه‌ی کلیدی 
برای جدا کردن آرگومان ها در نظر میگیرن. بنابراین اگر به شکل معمول زیر 
اقدام به خواندن خط بالا بکنیم، به مشکل برخواهیم خورد.

```cpp
InputStream >> number1 >> text >> number2;
```

یکی از راه های موجود برای حل این مشکل، استفاده از یک stream manipulator به اسم ```quoted``` هست که در هدر `<iomanip>` قرار داره. حالا کدی که نوشتیم رو تغییر میدیم تا به درستی ورودی هارو از هم تشخیص بده.

نکته: این ابزار مختص رشته هایی هست که داخل دو double quotation قرار داره. 

```cpp
InputStream >> number1 >> quoted(text) >> number2;
```

### خوندن و نوشتن به صورت Random-Access

نمیخوام از مزیت های این نوع دسترسی به فایل صحبت بکنم چون احساس می‌کنم
مطلبی نبوده که به عنوان یک چیز جدید توی این کتاب یاد گرفته‌م. به همین 
حد اکتفا می‌کنم که در اکثر موارد این روش بسیار سریع تر از روش Sequential
Access هست. 

در این روش که فایل رو در حالت باینری باز می‌کنیم، باید داده هامون رو به `char *` تبدیل کنیم.

اگر فرض بگیریم که `int number{10};`، برای نوشتن در فایل:

```cpp
outFile.write(reinterpret_cast<const char*>(&number), sizeof(number));
```

و برای خوندن از فایل:

```cpp
outFile.read(reinterpret_cast<char*>(&number), sizeof(number));
```

پارامتر اول تابع های read و write، داده ای هستن که میخوایم بنویسیم یا
بخونیم و باید به صورت بایت به بایت خونده بشن. که برای اینکار، از ` char*`استفاده می‌کنیم. پارامتر دوم همونطور که احتمالا فهمیدید، سایز داده ای هست که میخوایم بخونیم یا بنویسیم.

درباره انواع cast ها در سی++ احتمالا یه پست جدا می‌نویسم!

## در آخر

برای صدمین بار رها کردن مطالعه، باز اومدم. اینبار هم مثل ۹۹ بار قبلی میگم که عزم بیشتری دارم (:

این فصل خیلی چیز جدیدی برام نداشت. فصل بعدی دربارهٔ کتابخانه استاندارد سی++‌ و container هاست.
