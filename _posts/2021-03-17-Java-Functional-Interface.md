---
title: Java Functional Interface
author: Arasia
date: 2021-03-17 01:06:23 +0900
categories: [Language, Java]
tags: [java]
---

# Functional Interface

> Object Class의 Method를 제외하고 단 하나의 Abstract method만을 가진 Interface
>
> 따라서 Functional Interface는 단 하나의 기능을 나타낸다

## Fucntional Interface Annotation

> @FunctionalInterface를 사용하여 Compiler가 해당 Interface는 Functional Interface임을 명시하기 위해 사용

- Example of Functional Interface Annotation

  ``` java
  @FunctionalInterface
  interface ExampleOfFunctionalInterface {
      public int doSomething(int x, int y);
  }
  ```

## Lambda와 Functional Interface

> 람다식의 평가 결과는 Instance of Fuctional Interface를 만든다
>
> > "Evaluation of a lambda expression produces an instance of a functional interface"
>
> Functional Interface를 선언시 Lambda를 활용 할 수 있다.

``` java
@FunctionalInterface
interface ExampleOfFunctionalInterface {
    public int doSomething(int x, int y);
}

public class Test {
    public static void main(String[] args) {
        ExampleOfFunctionalInterface implemented = (x, y) -> x + y;		//Lambda를 이용한 Method 선언
        System.out.println(implemented.doSomething(1, 2));				//result 3
        System.out.println(implemented.doSomething(10, 20));			//result 30
    }
}
```

# 자주 사용하는 Functional Interface

> Java 8에서 제공되는 Functional Interface
>
> Package 경로 : java.util.function

## Runnable

> Parameter 와 Return이 없고 지정된 Method를 수행한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method |
| -------------- | ----------- | -------------------- | ------------------ |
| X              | void        | run                  | X                  |

``` java
@FunctionalInterface
public interface Runnable {
    public abstract void run();
}
```

## Supplier

> Parameter 없이 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method |
| -------------- | ----------- | -------------------- | ------------------ |
| X              | T           | get                  | X                  |

``` java
@FunctionalInterface
public interface Supplier<T> {
    T get();
}

```

## Consumer

> T 타입의 Parameter를 받아 지정된 Method를 수행하지만 Return은 없다

| Parameter Type | Return Type | Abstract Method Name | 설명 | 포함된 다른 Method |
| -------------- | ----------- | -------------------- | ---- | ------------------ |
| T              | void        | accept               |      | andThen            |

``` java
@FunctionalInterface
public interface Consumer<T> {
    void accept(T t);

    default Consumer<T> andThen(Consumer<? super T> after) {
        Objects.requireNonNull(after);
        return (T t) -> { accept(t); after.accept(t); };
    }
}

```

## BiConsumer

> T 타입과 U 타입의 Parameter를 받아 지정된 Method를 수행하지만 Return은 없다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method |
| -------------- | ----------- | -------------------- | ------------------ |
| T, U           | void        | accept               | andThen            |

``` java
@FunctionalInterface
public interface BiConsumer<T, U> {
    void accept(T t, U u);

    default BiConsumer<T, U> andThen(BiConsumer<? super T, ? super U> after) {
        Objects.requireNonNull(after);

        return (l, r) -> {
            accept(l, r);
            after.accept(l, r);
        };
    }
}
```

## Function

>  T 타입의 Parameter를 받아 지정된 Method를 수행하여 R 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method                 |
| -------------- | ----------- | -------------------- | ---------------------------------- |
| T              | R           | apply                | compose<br />andThen<br />identity |

``` java
@FunctionalInterface
public interface Function<T, R> {
    R apply(T t);

    default <V> Function<V, R> compose(Function<? super V, ? extends T> before) {
        Objects.requireNonNull(before);
        return (V v) -> apply(before.apply(v));
    }

    default <V> Function<T, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t) -> after.apply(apply(t));
    }

    static <T> Function<T, T> identity() {
        return t -> t;
    }
}
```

## UnaryOpertator

>  Function에서 Parameter와 Return Type이 동일한 Functional Interface
>
>  T 타입의 Parameter를 받아 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method                 |
| -------------- | ----------- | -------------------- | ---------------------------------- |
| T              | T           | apply                | compose<br />andThen<br />identity |

``` java
@FunctionalInterface
public interface UnaryOperator<T> extends Function<T, T> {

    static <T> UnaryOperator<T> identity() {
        return t -> t;
    }
}
```

## BiFunction

>  T 타입과 U 타입의 Parameter를 받아 지정된 Method를 수행하여 R 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method |
| -------------- | ----------- | -------------------- | ------------------ |
| T, U           | R           | apply                | andThen            |

``` java
@FunctionalInterface
public interface BiFunction<T, U, R> {
    R apply(T t, U u);

    default <V> BiFunction<T, U, V> andThen(Function<? super R, ? extends V> after) {
        Objects.requireNonNull(after);
        return (T t, U u) -> after.apply(apply(t, u));
    }
}

```

## BinaryOperator

>  BiFunction에서 모든 Parameter와 Return Type이 동일한 Functional Interface
>
>  타입의 Parameter를 받아 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method            |
| -------------- | ----------- | -------------------- | ----------------------------- |
| T, T           | T           | apply                | andThen<br />maxBy<br />minBy |

``` java
@FunctionalInterface
public interface BinaryOperator<T> extends BiFunction<T,T,T> {
    
    public static <T> BinaryOperator<T> minBy(Comparator<? super T> comparator) {
        Objects.requireNonNull(comparator);
        return (a, b) -> comparator.compare(a, b) <= 0 ? a : b;
    }

    public static <T> BinaryOperator<T> maxBy(Comparator<? super T> comparator) {
        Objects.requireNonNull(comparator);
        return (a, b) -> comparator.compare(a, b) >= 0 ? a : b;
    }
}
```

## Predicate

> T 타입의 Parameter를 받아 지정된 Method를 수행하여 boolean 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method                   |
| -------------- | ----------- | -------------------- | ------------------------------------ |
| T              | boolean     | test                 | and<br />or<br />negate<br />isEqual |

``` java
@FunctionalInterface
public interface Predicate<T> {
    boolean test(T t);

    default Predicate<T> and(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) && other.test(t);
    }

    default Predicate<T> negate() {
        return (t) -> !test(t);
    }

    default Predicate<T> or(Predicate<? super T> other) {
        Objects.requireNonNull(other);
        return (t) -> test(t) || other.test(t);
    }

    static <T> Predicate<T> isEqual(Object targetRef) {
        return (null == targetRef)
                ? Objects::isNull
                : object -> targetRef.equals(object);
    }

}
```

## BiPredicate

> T 타입과 U 타입의 Parameter를 받아 지정된 Method를 수행하여 boolean 타입의 결과를 Return한다

| Parameter Type | Return Type | Abstract Method Name | 포함된 다른 Method      |
| -------------- | ----------- | -------------------- | ----------------------- |
| T, U           | boolean     | test                 | and<br />or<br />negate |

``` java
@FunctionalInterface
public interface BiPredicate<T, U> {
    boolean test(T t, U u);

    default BiPredicate<T, U> and(BiPredicate<? super T, ? super U> other) {
        Objects.requireNonNull(other);
        return (T t, U u) -> test(t, u) && other.test(t, u);
    }

    default BiPredicate<T, U> negate() {
        return (T t, U u) -> !test(t, u);
    }

    default BiPredicate<T, U> or(BiPredicate<? super T, ? super U> other) {
        Objects.requireNonNull(other);
        return (T t, U u) -> test(t, u) || other.test(t, u);
    }
}

```

