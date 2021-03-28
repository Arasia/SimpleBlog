---
title: Java Optional
author: Arasia
date: 2021-03-29 01:11:12 +0900
categories: [Language, Java]
tags: [java]
---

# Optional

> Java 8 버전부터 추가된 Class  
> 임의의 값이 존재하지 않을수도 있을 때 (Null Check가 필요할 때) 해당 값을 좀 더 안전하게 사용 가능하도록 만들어짐

## Optional 생성

- empty

  > 비어있는 Optional을 생성한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | empty | void | Optional\<T\> | Static Method |

  ```java
  // Optional[]
  Optional<Integer> optional = Optional.empty();
  ```

- of

  > T 값에 대한 Optional\<T\>를 생성한다  
  > 해당 값이 Null이면 NullPointerException을 Throw한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | of | T value | Optional\<T\> | Static Method |

  ```java
  Integer integer = null;
  Optional<Integer> optional = Optional.of(integer); // NullPointerException
  
  Integer integer = 1;
  // Optional[1]
  Optional<Integer> optional = Optional.of(integer); 
  ```

- ofNullable

  > T 값에 대한 Optional\<T\>를 생성한다  
  > 해당 값이 Null이면 비어있는 Optional을 생성한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | ofNullable | T value | Optional\<T\> | Static Method |

  ```java
  Integer integer = null;
  // Optional[]
  Optional<Integer> optional = Optional.ofNullable(integer);
  
  Integer integer = 1;
  // Optional[1]
  Optional<Integer> optional = Optional.ofNullable(integer); 
  ```

## 중간 처리

- filter

  > Optional 값에 대한 Predicate 연산을 진행한다  
  > 연산의 결과가 True면 해당 Optional을 반환하고 False면 Optional.empty()을 반환한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | filter | Predicate\<? super T\> predicte | Optional\<T\> |      |

  ```java
  Integer integer = 1;
  // Optional[]
  Optional<Integer> optional = Optional.of(integer).filter(n -> n%2==0);
  
  Integer integer = 2;
  // Optional[2]
  Optional<Integer> optional = Optional.of(integer).filter(n -> n%2==0);
  ```

- map

  > Optional 값에 대한 Function 연산을 진행하여 결과를 Optional.ofNullable()으로 wapping하여 반환한다.  
  > Optional 값이 비어 있다면 Optional.empty()를 반환한다  

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | map | Function\<? super T, ? extends U\> mapper | Optional\<U\> |      |

  ```java
  Integer integer = 1;
  // Optional[2]
  Optional<Integer> optional = Optional.of(integer).map(n -> n * 2);
  ```

- flatMap

	> Optional 값에 대한 Function 연산을 진행하여 결과를 반환한다.  
  > Optional 값이 비어 있다면 Optional.empty()를 반환한다   
	> Function의 결과가 null이라면 NullPointerException을 Throw 한다  
	> Function의 결과는 Optional\<U\> 타입이다
	

| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| flatMap | Function<? super T, Optional\<U\>\> mapper | Optional\<U\> |      |
	
	```java
	Integer integer = 1;
	// Optional[2]
	Optional<Integer> optional = Optional.of(integer).flatMap(n -> Optional.of(n * 2));
	```

## 최종 처리

- get

  > Optional이 가지고 있는 값을 반환한다  
  > 해당 값이 null이라면 NoSuchElementException을 Throw 한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | get | void | T |      |

  ```java
  Integer integer = 1;
  // print : 1
  System.out.println(Optional.ofNullable(integer).get());
  
  Integer integer = null;
  // Throw NoSuchElementException
  System.out.println(Optional.ofNullable(integer).get());
  ```

- orElse

  > Optional이 가지고 있는 값을 반환한다  
  > 해당 값이 null이라면 전달된 other 값을 반환한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | orElse | T other | T |      |

  ```java
  Integer integer = 1;
  // print : 1
  System.out.println(Optional.ofNullable(integer).orElse(0));
  
  Integer integer = null;
  // print : 0
  System.out.println(Optional.ofNullable(integer).orElse(0));
  ```

- orElseGet

  > Optional이 가지고 있는 값을 반환한다  
  > 해당 값이 null이라면 전달된 Supplier 연산의 결과값을 반환한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | orElseGet | Supplier\<? extends T\> other | T |      |

  ```java
  Integer integer = 1;
  // print : 1
  System.out.println(Optional.ofNullable(integer).orElseGet(() -> 0));
  
  Integer integer = null;
  // print : 0
  System.out.println(Optional.ofNullable(integer).orElseGet(() -> 0));
  ```

- orElseThrow

  > Optional이 가지고 있는 값을 반환한다  
  > 해당 값이 null이라면 전달된 Supplier 연산의 결과값을 Throw한다  
  > Supplier의 결과값은 Throwable을 상속받은 상태여야 한다(X extends Throwable)

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | orElseThrow | Supplier<? extends X> exceptionSupplier | T |  |

  ```java
  Integer integer = 1;
  // print : 1
  System.out.println(Optional.ofNullable(integer).orElseThrow(NoSuchElementException::new));
  
  Integer integer = null;
  // Throw NoSuchElementException
  System.out.println(Optional.ofNullable(integer).orElseThrow(NoSuchElementException::new));
  ```

- isPresent

  > Optional이 가지고 있는 값이 비어있는지 여부를 반환한다

  | Function Name | Parameter | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | isPresent | void | boolean |      |

  ```java
  Integer integer = 1;
  // true
  boolean result = Optional.ofNullable(integer).isPresent();
  
  Integer integer = null;
  // false
  boolean result = Optional.ofNullable(integer).isPresent();
  ```

- ifPresent

	> Optional의 값이 null이 아닐경우 전달된 Consumer 연산을 수행한다
  > Optional의 값이 null일경우 아무 동작도 하지 않는다
	
	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
| ifPresent | Consumer\<? super T\> consumer | void |      |
	
	```java
	Integer integer = 1;
	// print : 1
	Optional.ofNullable(integer).ifPresent(System.out::println);
	
	Integer integer = null;
	Optional.ofNullable(integer).ifPresent(System.out::println);
	```
