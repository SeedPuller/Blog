---
title: "ارث بری چندگانه در سی++"
categories: [سی++]
tags: [C++, Diamond, diamond problem, inheritance, multiple inheritance, virtual, virtual inheritance, ارث بری, ارث بری چندگانه, سی++]
---


سی++ یکی از زبان هاییه که این اجازه رو به ما میده تا کلاسی که نوشتیم 
چندین کلاس والد داشته باشه یا به عبارت دیگه، قابلیت ارث بری چندگانه یا 
multiple inheritance رو داره.

## چطور استفاده می‌شه

خودِ ارث بری چندتایی خیلی عجیب غریب نیست و تنها فرقش اینه که موقع 
نوشتن کلاس، با استفاده از «کاما» میایم و Base Class هارو جدا می‌کنیم. 
مثال:

```cpp
#include <string>
  
class Person
{
private:
    std::string m_name;
    int m_age;
  
public:
    Person(std::string name, int age)
        : m_name(name), m_age(age)
    {
    }
  
    std::string getName() { return m_name; }
    int getAge() { return m_age; }
};
  
class Employee
{
private:
    std::string m_employer;
    double m_wage;
  
public:
    Employee(std::string employer, double wage)
        : m_employer(employer), m_wage(wage)
    {
    }
  
    std::string getEmployer() { return m_employer; }
    double getWage() { return m_wage; }
};
  
// Teacher publicly inherits Person and Employee
class Teacher: public Person, public Employee
{
private:
     int m_teachesGrade;
  
public:
    Teacher(std::string name, int age, std::string employer, double wage, int teachesGrade)
        : Person(name, age), Employee(employer, wage), m_teachesGrade(teachesGrade)
    {
    }
};
```

اما بیشتر از مزایاش، چالش ها و مشکلاتش قابل بحثه!

## مشکل Diamond Problem

این مشکل که به Deadly Diamond of Death هم معروفه، از این قراره که فرض
کنید کلاس های B و C دو کلاس مجزا باشند و هر دوتاشون از کلاس A ارث بری 
کرده باشند. حالا اگر ما کلاسی مثل D داشته باشیم که به شکل همزمان از B و C
ارث بری کرده، دوبار کلاس A رو در کلاس D خواهیم داشت که این باعث مشکل 
می‌شه.

![](https://upload.wikimedia.org/wikipedia/commons/thumb/8/8e/Diamond_inheritance.svg/220px-Diamond_inheritance.svg.png){: .normal}
_نمایش تصویری Diamond problem. حالا دلیل اسمش معلوم شد؟ (:_

اگر تابعی مثل print در کلاس A داشته باشیم که در هیچکدوم از ارث بری ها
بازنویسی نشده باشه و حالا از طریق کلاس D بخواد فراخوانی بشه چه اتفاقی 
میوفته؟

به ارور برمیخوریم! چون کامپایلر نمیدونه از کدوم یکی از نسخه های A که 
الآن در اختیار داره باید استفاده کنه و از کدوم مسیر باید بره. 

از طریق کلاس C بره و به A برسه یا از طریق کلاس B ؟

## حل مسئه Diamond problem

راه حل اول اینه که دقیقا برای کامپایلر مشخص کنیم از چه مسیری باید به کلاس A برسه. مثال:

```cpp
class A {
    public:
        print() {}
};
 
class B : public A {};
class C : public A {};
 
// multiple inheritance 
 
class D : public B, public C {};
 
D object;
// explicitly determine a way to "A"
D.B::print();
```

یک راه دیگه هم وجود داره.

## Virtual Inheritance

با استفاده از ارث بری مجازی، سی++ فقط یک نسخه از A رو به عنوان والد در نظر میگیره و نمیذاره چند نسخه از A بوجود بیاد. 

فقط کافیه که ارث بری‌مون رو به شکل virtual انجام بدیم:

```cpp
class A {
    public:
        virtual print() {}
};
 
class B : virtual public A {};
class C : virtual public A {};
 
// multiple inheritance 
 
class D : public B, public C {};
 
D object;
// no need to explicit qualification
D.print();
```

نحوه عمل کردن virtual inheritance بسیار شبیه به Virtual function ها هست که [توی این پست](https://seedpuller.space/2020/05/04/what-ive-learned-from-deitel-chapter12-polymorphism/){align: center} درباره‌ش توضیح دادم.

## در آخر

همونطور که دیدیم، ظاهرا چالش ها و مشکلات این روش بیشتر از فایده‌ش هست
اما جاهایی هم هست که بهترین راهیه که میتونیم ازش استفاده کنیم.

بهتره که تا جای ممکن سعی کنیم راه الگوریتم‌مون رو بدون استفاده از ارث
بری چندگانه پیاده سازی بکنیم مگر اینکه پیاده سازی به این روش باعث بشه 
که پیچیدگی کار کمتر بشه.
