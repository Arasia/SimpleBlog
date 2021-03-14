---
title: 자바 버전별 변경사항
author: Arasia
date: 2021-03-10 00:33:00 +0900
categories: [Language, Java]
tags: [java]
---


> 자바 버전중 LTS인 버전에 대한 변경사항들을 정리

## Overview

### Java Release History

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

## JDK 1.7

### Type Interface

``` java
List<Integer> list = new ArrayList<>();
```

- Generic Type Parameter can skip -> "<>"

### String value in Switch

``` java
switch(sport) {
    case "SOCCER" : 
    case "BASKETBALL" : 
    default : 
}
```

- String value can use Switch Value

### try-with-resource

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

- If Resource implement AutoCloseable or Closeable, try-with-resource can auto return that resource

### Underscore In Numeric literal

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

- Underscore can be used as display of numeric literal

### Catching Multiple Exception Type in Single Catch Block

```java
try {
    ...
} catch (ClassNotFoundExeption | SQLException ex) {
    ex.printStackTrace();
}
```

- Multi Exception in Single Catch Block
- If One Exception is Sub Class relationship of other Class, occur multi-catch error

### JAVA NIO 2.0

### More Precise Rethrowing of Exception

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

- Function can throw Precise Exception

### Update of Array List & Hash Map

- Array List initial capacity is modified ten to zero

---

## JDK 1.8

### Lambda Expression

### Stream API

### java.time Package

- Less than Java 7, almost developer uses Joda-Time
- In Java 8, java.time package is included

### Java Script Engine Change

