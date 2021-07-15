---
title: "معرفی std::string_view"
# categories: [سی++]
# tags: [C++, C++17, char, std, "std::string_view", string view, سی++]
tags: [cplusplus]
path: blog/std-string-view-cpp17
cover: ../cplusplus.png
date: 1399-05-27
excerpt: "بررسی کلاس string_view موجود در STL"

---


یکی از ویژگی های جالبی که به سی++ ۱۷ اضافه شده، `std::string_view` هست که برای کار با رشته های ثابت خیلی زیاد به کار آدم میاد.

کد پایین رو ببینید:

```cpp
#include <iostream>
#include <string>
  
int main()
{
  char text[]{ "hello" };
  std::string str{ text };
  std::string more{ str };
  
  std::cout << text << ' ' << str << ' ' << more << '\n';
  
  return 0;
}
```

توی این کد، با اینکه تنها کاری که ما کردیم چاپ کردن رشته بوده و رشته 
هم ثابت بوده، اما برای همین استفاده ساده ۴ بار از اون رشته کپی گرفته 
شده.

یک بار رشته ثابت توی کد باینری قرار گرفته. بعد کپی شده توی استک (برای `text`)، و دو بار هم `std::string ` ها کپیش کردن برای ساختن شئ خودشون.

سی++ ۱۷ قابلیتی به اسم string_view اضافه کرده که برای همینکار درست شده (:

کد پایین رو ببینید:

```cpp
#include <iostream>
#include <string_view>
  
int main()
{
  std::string_view text{ "hello" }; // view the text "hello", which is stored in the binary
  std::string_view str{ text }; // view of the same "hello"
  std::string_view more{ str }; // view of the same "hello"
  
  std::cout << text << ' ' << str << ' ' << more << '\n';
  
  return 0;
}
```

توی این کد رشته ما فقط یکبار کپی شده (و اونم توی باینری) و بقیه متغییر های ما به نوعی دارن به همون رشته اصلی اشاره می‌کنن.

و نکته مثبتش؟ اینکه خیلی از توابع مربوط به `std::string` رو هم ساپورت می‌کنه.

## تغییر دادن رشته

اساسا این کلاس برای رشته های read-only ساخته شده و عملا نمیتونه 
تغییری توی رشته اصلی انجام بده. همونطور که از اسمش معلومه فقط یک view از
رشته هست.

یک پنجره رو فرض کنید، شما از طریق پنجره به منظره بیرون نگاه می‌کنید. 
وقتی پرده رو می‌کشید دید شما محدود میشه اما در منظره بیرون تغییری ایجاد 
نمیشه. اما اگر منظره بیرون تغییر کنه، دید شما هم تغییر میکنه.

این مثال دقیقا برای این کلاس کاربرد داره. اگر رشته اصلی ای که 
string_view باهاش ساخته شده تغییر بکنه، رشتهٔ ای که string_view داره 
نمایش میده هم تغییر می‌کنه.

اگر رشته ای که string_view باهاش ساخته شده از بین بره، دیگه نمیشه از 
اون string_view استفاده کرد و فراخوانی کردنش یک undefined behaviour هست.

مثال:

```cpp
#include <iostream>
#include <string_view>
  
int main()
{
  char arr[]{ "Gold" };
  std::string_view str{ arr };
  
  std::cout << str << '\n'; // Gold
  
  // Change 'd' to 'f' in arr
  arr[3] = 'f';
  
  std::cout << str << '\n'; // Golf
  
  return 0;
}
```

## در پایان

+ از این کلاس برای رشته هایی که قرار نیست تغییر بکنن استفاده کنیم.
+ برای رشته هایی که قراره تغییر بکنن از همون `std::string` استفاده کنیم.

