---
title: 자바 버전별 변경사항
author: Arasia
date: 2021-03-19 01:23:52 +0900
categories: [Language, Java]
tags: [java]
---


> 자바 버전중 LTS인 버전에 대한 변경사항들을 정리

# Overview

## Java Release History

| version | Release Date | End of Free Public Updates | Extended Support Until |
| --- | --- | --- | --- |
| JDK Beta | 1995 | | |
| JDK 1.0 | January 1996 | | |
| JDK 1.1 | February 1997 | | |
| J2SE 1.2 | December 1998 | | |
| J2SE 1.3 | May 2000 | | |
| J2SE 1.4 | February 2002 | October 2008 | February 2013 |
| J2SE 5.0 | September 2004 | November 2009 | April 2015 |
| Java SE 6 | December 2006 | April 2013 | December 2018<br />December 2023, paid support for Zulu |
| Java SE 7 | July 2011 | April 2015 | July 2022 |
| Java SE 8 (LTS) | March 2014 | January 2019 for Oracle (commercial)<br />December 2030 for Oracle (non-commercial)<br />December 2030 for Zulu<br />At least May 2026 for AdoptOpenJDK<br />At least May 2026 for Amazon Corretto | December 2030 |
| Java SE 9 | September 2017 | March 2018 for OpenJDK | N/A |
| Java SE 10 | March 2018 | September 2018 for OpenJDK | N/A |
| Java SE 11(LTS) | September 2018 | September 2027 for Zulu<br />At least October 2024 for AdoptOpenJDK<br />At least September 2027 for Amazon Corretto | September 2026, or September 2027 for e.g. Zulu |
| Java SE 12 | March 2019 | September 2019 for OpenJDK | N/A |
| Java SE 13 | September 2019 | March 2020 for OpenJDK | N/A |
| Java SE 14 | March 2020 | September 2020 for OpenJDK | N/A |
| Java SE 15 | September 2020 | March 2021 for OpenJDK<br />March 2023 for Zulu | N/A |
| Java SE 16 | March 2021 | September 2021 for OpenJDK | N/A |
| Java SE 17(LTS) | September 2021 | September 2030 for Zulu | TBA |

---

# JDK 1.7

> [Oracle Java Doc(Java 7)](https://docs.oracle.com/javase/specs/jls/se7/html/index.html)

## Type Interface

> Generic Type Parameter can skip -> "<>"

```java
List<Integer> list = new ArrayList<>();
```

## String value in Switch

> [Oracle Java Doc(Java 7) - The Swich Statement](https://docs.oracle.com/javase/specs/jls/se7/html/jls-14.html#jls-14.11)
>
> String value can use Switch Value

``` java
switch(sport) {
    case "SOCCER" : 
    case "BASKETBALL" : 
    default : 
}
```

## The Try Statement

> [Oracle Java Doc(Java 7) - The try Statement](https://docs.oracle.com/javase/specs/jls/se7/html/jls-14.html#jls-14.20)

### Catching Multiple Exception Type in Single Catch Block

> Multi Exception in Single Catch Block  
>If One Exception is Sub Class relationship of other Class, occur multi-catch error

```java
try {
    ...
} catch (ClassNotFoundExeption | SQLException ex) {
    ex.printStackTrace();
}
```

### try-with-resource

> [Oracle Java Doc(Java 7) - try-with-resources](https://docs.oracle.com/javase/specs/jls/se7/html/jls-14.html#jls-14.20.3)
>
> If Resource implement AutoCloseable or Closeable, try-with-resource can auto return that resource

```java
try(
   		FileInputStream fin = new FileInputStream("info.xml");
    	BufferedReader br = new BufferedReader(new InputStreamReader(fin));
   ) {
    if(br.ready()) {
        String line1 = br.readLine();
        System.out.println(line1);
    }
} catch (FileNotFoundException ex) {
    System.out.println("Info.xml is not found");
} catch (IOException ex) {
    System.out.printLn("Can't read the file")
}
```



## Underscore In Numeric literal

> Underscore can be used as display of numeric literal

```java
// right Case
int billion = 1_000_000_000; // 10^9
long creditCardNumber = 1234_5678_9012_3456L; // 16 digit number
long ssn = 111_22_3333L;
double pi = 3.1415.9265;
float pif = 3.14_15_92_65f;
// wrong case
double pi = 3._1415_9265; // Underscore can't after dot
long creditCardNumber = 1234_5678_9012_3456_L; // Numeric literal can't end of Underscore
long ssn = _111_22_3333L; // Numeric literal can't start of Underscore
```

## More Precise Rethrowing of Exception

> Function can throw Precise Exception

``` java
public void func() throws ParseException, IOException {
    try {
        new FileInputStream("abc.txt").read();
        new SimpleDateFormat("ddMMyyyy").parse("12-03-2014");
    } catch (Exeption ex) {
        System.out.println("Caught exception : " + ex.getMessage());
        throw ex;
    }
}
```

## Update of Array List & Hash Map

> Array List initial capacity is modified ten to zero

## JAVA NIO 2.0

---

# JDK 1.8

> [Oracle Java Doc(Java 8)](https://docs.oracle.com/javase/specs/jls/se8/html/index.html)

## Lambda Expression

> [Oracle Java Doc(Java 8) - Lambda Expressions](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.27)
>
> Lambda에서 입력받는 매개변수에 대한 Variable Type을 추론하여 동작한다  
>간략한 코드는 Block 및 return을 생략 가능하다  
> 매개변수가 하나라면 전달되는 Parameter를 감싸는 괄호도 생략 가능하다  
>람다식의 평가 결과는 Instance of Fuctional Interface를 만든다  
> 
>> "Evaluation of a lambda expression produces an instance of a functional interface"   
> > Functional Interface를 선언시 Lambda를 활용 할 수 있다.

- Lambda Expression의 기본 형식

  ``` java
  (Parameters) -> {Function Body}
  ```

- Example

  ``` java
  () -> {}                // No parameters; result is void
  () -> 42                // No parameters, expression body
  () -> null              // No parameters, expression body
  () -> { return 42; }    // No parameters, block body with return
  () -> { System.gc(); }  // No parameters, void block body
  
  () -> {                 // Complex block body with returns
    if (true) return 12;
    else {
      int result = 15;
      for (int i = 1; i < 10; i++)
        result *= i;
      return result;
    }
  }                          
  
  (int x) -> x+1              // Single declared-type parameter
  (int x) -> { return x+1; }  // Single declared-type parameter
  (x) -> x+1                  // Single inferred-type parameter
  x -> x+1                    // Parentheses optional for
                              // single inferred-type parameter
  
  (String s) -> s.length()      // Single declared-type parameter
  (Thread t) -> { t.start(); }  // Single declared-type parameter
  s -> s.length()               // Single inferred-type parameter
  t -> { t.start(); }           // Single inferred-type parameter
  
  (int x, int y) -> x+y  // Multiple declared-type parameters
  (x, y) -> x+y          // Multiple inferred-type parameters
      
  // Illegal Example
  (x, int y) -> x+y    // Illegal: can't mix inferred and declared types
  (x, final y) -> x+y  // Illegal: no modifiers with inferred types
  ```

## Default Method

> [Oracle Java Doc(Java 8) - Default Method](https://docs.oracle.com/javase/specs/jls/se8/html/jls-13.html#jls-13.5.6)
>
> Interface를 선언할때 구현될 Method의 기본 동작을 함께 선언 가능하다  
>다수의 Interface를 implement시 동일한 이름과 같은 순서의 Parameter Type을 받는 Default Method가 존재하는 경우 Error가 발생한다.

- Example

  ```java
  interface Painter {
      default void draw() {
          System.out.println("Painter");
      }
  }
  
  interface Cowboy {}
  
  public class CowboyArtist implements Cowboy, Painter {
      public static void main(String... args) {
          new CowboyArtist().draw(); //Print "Painter"
     }
  }
  ```

- Illegal Example

  ```java
  interface Painter {
      default void draw() {
          System.out.println("Painter");
      }
  }
  
  interface Cowboy {
      default void draw() {
          System.out.println("Cowboy");
      }
  }
  
  public class CowboyArtist implements Cowboy, Painter { // 같은 default Method가 존재하여 에러 발생
      public static void main(String... args) {
          new CowboyArtist().draw();
     }
  }
  ```

## Functional Interface

> [Oracle Java Doc(Java 8) - Functional Interfaces](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.8)  
> [Functional Interface](https://arasia.github.io/SimpleBlog/posts/Java-Functional-Interface/)
>
> Object Class의 Method를 제외하고 단 하나의 Abstract method만을 가진 Interface  
> 따라서 Functional Interface는 단 하나의 기능을 나타낸다

- Fucntional Interface Annotation

  > @FunctionalInterface를 사용하여 Compiler가 해당 Interface는 Functional Interface임을 명시하기 위해 사용

- Example

  ``` java
  @FunctionalInterface
  interface ExampleOfFunctionalInterface {
      public int doSomething(int x, int y);
  }
  
  public class Test {
      public static void main(String[] args) {
          // Lambda를 활용한 Function 정의
          ExampleOfFunctionalInterface implemented = (x, y) -> x + y;
          
          System.out.println(implemented.doSomething(1, 2)); // result 3
          System.out.println(implemented.doSomething(10, 20)); // result 30
      }
  }
  ```

## Method Reference

> [Oracle Java Doc(Java 8) - Method Referance Expressions](https://docs.oracle.com/javase/specs/jls/se8/html/jls-15.html#jls-15.13)
>
> Lambda Expression이 단 하나의 Method만 호출하는 경우 Method Reference로 전환 가능  
>전환시 불필요한 Parameter를 제외하고 (Class | Object)::Method 형태로 표현됨

### Class::Method

``` java
class Printer {
    public static void print(String str){
        System.out.println(str);
    }
}

// Lambda - Functional Interface
Consumer <Integer> consumerLambda = (str) -> Printer.print(str);
// Method Reference - Functional Interface
Consumer <Integer> consumerMethodReference = System.out::println;
```

### Class.Object::Method

``` java
class Printer {
    public void print(String str){
        System.out.println(str);
    }
}

class Machine {
    public static final Printer printer = new Printer();
}

// Lambda - Functional Interface
Consumer <Integer> consumerLambda = (str) -> Machine.printer.print(str);
// Method Reference - Functional Interface
Consumer <Integer> consumerMethodReference = Machine.printer::print;
```

### Class::Constructor

``` java
class Student {
    private String name;
    private Integer age;
    
    Student() {
    }

    Student(String name) {
        this.name = name;
    }

    Student(String name, Integer age) {
        this.name = name;
        this.age = age;
    }
}

//Reference
Student student1 = new Student();
Student student2 = new Student("Peter");
Student student3 = new Student("Sam", 20);

//Lambda - Functional Interface
Supplier<Student> supplier = () -> new Student();
Function<String, Student> function = (name) -> new Student(name);
BiFunction<String, Integer, Student> biFunction = (name, age) -> new Student(name, age);

//Method Reference - Functional Interface
Supplier<Student> supplier = Student::new;
Function<String, Student> function = Student::new;
BiFunction<String, Integer, Student> biFunction = Student::new;
```

## Stream API

> 외부 반복을 통해 작업하는 컬렉션과 다르게 내부 반복을 통해 작업을 수행  
> 스트림은 재사용이 불가능함  
> 스트림은 원본 데이터를 변경하지 않음  
> Filter-Map 기반의 API를 사용하여 Lazy 연산을 통해 성능을 최적화  
> parallelStream()을 통하여 간단한 병렬처리를 지원

### 스트림의 기본동작

1.  스트림 생성
2.  스트림 중계 연산
3.  스트림 최종 연산

### Example

```java
Integer[] arr = new Integer[] {1, 2, 3, 4, 5};
Stream<Integer> stream = Arrays.stream(arr);

stream.map(i -> i * 2) // 각 인자 * 2 (중계 연산)
    .forEach(System.out::println); // print (최종 연산) :  2 4 6 8 10

stream.forEach(System.out::println); // Runtime Error : 스트림 재사용 불가 
```

## Optional

> 변수가 Null인지 해당 Object를 가지고있는지 판단할 수 없을 때 Null 처리를 유연하게 대처 가능

```java
Integer integer = null;
Optional.ofNullable(integer).ifPresent(System.out::println); // null이므로 println이 Skip

integer = 10;
Optional.ofNullable(integer).ifPresent(System.out::println); // print : 10
```

## java.time Package

> Less than Java 7, almost developer uses Joda-Time  
> In Java 8, java.time package is included

```java
LocalDateTime localDateTime = LocalDateTime.now();

// print : 2021-03-22T22:38:20.66
System.out.println(localDateTime.format(DateTimeFormatter.ISO_LOCAL_DATE_TIME)); 
// print : 2021-03-22 10:38:20.660
System.out.println(localDateTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd hh:mm:ss.SSS"))); 
```