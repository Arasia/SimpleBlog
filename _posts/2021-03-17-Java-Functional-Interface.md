---
title: Java Functional Interface
author: Arasia
date: 2021-03-23 01:21:23 +0900
categories: [Language, Java]
tags: [java]
---

# Functional Interface

> [Oracle Java Doc(Java 8) - Functional Interfaces﻿](https://docs.oracle.com/javase/specs/jls/se8/html/jls-9.html#jls-9.8)
>
> Object Class의 Method를 제외하고 단 하나의 Abstract method만을 가진 Interface  
> 따라서 Functional Interface는 단 하나의 기능을 나타낸다

## Fucntional Interface Annotation

> @FunctionalInterface를 사용하여 Compiler가 해당 Interface는 Functional Interface임을 명시하기 위해 사용

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
		//Lambda를 이용한 Method 선언
		ExampleOfFunctionalInterface implemented = (x, y) -> x + y;

		System.out.println(implemented.doSomething(1, 2)); //print : 3
		System.out.println(implemented.doSomething(10, 20)); //print : 30
	}
}
```

# 자주 사용하는 Functional Interface

> Java 8에서 제공되는 Functional Interface  
>Package 경로 : java.util.function

## Runnable

> Parameter 와 Return이 없고 지정된 Method를 수행한다

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method |
| -------------------- | --------- | ----------- | ------------------ |
| run                  | void      | void        | X                  |

``` java
@FunctionalInterface
public interface Runnable {
	public abstract void run();
}
```

## Supplier

> Parameter 없이 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method |
| -------------------- | --------- | ----------- | ------------------ |
| get                  | void      | T           | X                  |

``` java
@FunctionalInterface
public interface Supplier<T> {
	T get();
}
```

## Consumer

> T 타입의 Parameter를 받아 지정된 Method를 수행하지만 Return은 없다

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method |
| -------------------- | --------- | ----------- | ------------------ |
| accept               | T t       | void        | andThen            |

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

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method |
| -------------------- | --------- | ----------- | ------------------ |
| accept               | T t, U u  | void        | andThen            |

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

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method                 |
| -------------------- | --------- | ----------- | ---------------------------------- |
| apply                | T t       | R           | compose<br />andThen<br />identity |

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
>T 타입의 Parameter를 받아 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method                 |
| -------------------- | --------- | ----------- | ---------------------------------- |
| apply                | T t       | T           | compose<br />andThen<br />identity |

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

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method |
| -------------------- | --------- | ----------- | ------------------ |
| apply                | T t, U u  | R           | andThen            |

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
>T 타입의 Parameter를 받아 지정된 Method를 수행하여 T 타입의 결과를 Return한다

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method            |
| -------------------- | --------- | ----------- | ----------------------------- |
| apply                | T t, T t  | T           | andThen<br />maxBy<br />minBy |

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

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method                   |
| -------------------- | --------- | ----------- | ------------------------------------ |
| test                 | T t       | boolean     | and<br />or<br />negate<br />isEqual |

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

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method      |
| -------------------- | --------- | ----------- | ----------------------- |
| test                 | T t, U u  | boolean     | and<br />or<br />negate |

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

# 추가적인 Fucntional Interface

## Comparator

> package : java.util  
> T 타입의 두 변수를 비교하여 결과를  Return한다.

| Abstract Method Name | Parameter | Return Type | 포함된 다른 Method                                           |
| -------------------- | --------- | ----------- | ------------------------------------------------------------ |
| compare              | T t, T t  | int         | reversed<br />thenComparing<br />reverseOrder<br />naturalOrder<br />nullsFirst<br />nullsLast<br />comparing |

```java
@FunctionalInterface
public interface Comparator<T> {
	int compare(T o1, T o2);

	boolean equals(Object obj);

	default Comparator<T> reversed() {
		return Collections.reverseOrder(this);
	}

	default Comparator<T> thenComparing(Comparator<? super T> other) {
		Objects.requireNonNull(other);
		return (Comparator<T> & Serializable) (c1, c2) -> {
			int res = compare(c1, c2);
			return (res != 0) ? res : other.compare(c1, c2);
		};
	}

	default <U> Comparator<T> thenComparing(
		Function<? super T, ? extends U> keyExtractor,
		Comparator<? super U> keyComparator)
	{
		return thenComparing(comparing(keyExtractor, keyComparator));
	}

    default <U extends Comparable<? super U>> Comparator<T> thenComparing(
		Function<? super T, ? extends U> keyExtractor)
	{
		return thenComparing(comparing(keyExtractor));
	}

	default Comparator<T> thenComparingInt(ToIntFunction<? super T> keyExtractor) {
		return thenComparing(comparingInt(keyExtractor));
	}

	default Comparator<T> thenComparingLong(ToLongFunction<? super T> keyExtractor) {
		return thenComparing(comparingLong(keyExtractor));
	}

	default Comparator<T> thenComparingDouble(ToDoubleFunction<? super T> keyExtractor) {
		return thenComparing(comparingDouble(keyExtractor));
	}

	public static <T extends Comparable<? super T>> Comparator<T> reverseOrder() {
		return Collections.reverseOrder();
	}

	@SuppressWarnings("unchecked")
	public static <T extends Comparable<? super T>> Comparator<T> naturalOrder() {
		return (Comparator<T>) Comparators.NaturalOrderComparator.INSTANCE;
	}

	public static <T> Comparator<T> nullsFirst(Comparator<? super T> comparator) {
		return new Comparators.NullComparator<>(true, comparator);
	}

	public static <T> Comparator<T> nullsLast(Comparator<? super T> comparator) {
		return new Comparators.NullComparator<>(false, comparator);
	}

	public static <T, U> Comparator<T> comparing(
		Function<? super T, ? extends U> keyExtractor,
		Comparator<? super U> keyComparator)
	{
		Objects.requireNonNull(keyExtractor);
		Objects.requireNonNull(keyComparator);
		return (Comparator<T> & Serializable)
			(c1, c2) -> keyComparator.compare(keyExtractor.apply(c1), keyExtractor.apply(c2));
	}

	public static <T, U extends Comparable<? super U>> Comparator<T> comparing(
		Function<? super T, ? extends U> keyExtractor)
	{
		Objects.requireNonNull(keyExtractor);
		return (Comparator<T> & Serializable)
			(c1, c2) -> keyExtractor.apply(c1).compareTo(keyExtractor.apply(c2));
	}

	public static <T> Comparator<T> comparingInt(ToIntFunction<? super T> keyExtractor) {
		Objects.requireNonNull(keyExtractor);
		return (Comparator<T> & Serializable)
			(c1, c2) -> Integer.compare(keyExtractor.applyAsInt(c1), keyExtractor.applyAsInt(c2));
	}

	public static <T> Comparator<T> comparingLong(ToLongFunction<? super T> keyExtractor) {
		Objects.requireNonNull(keyExtractor);
		return (Comparator<T> & Serializable)
			(c1, c2) -> Long.compare(keyExtractor.applyAsLong(c1), keyExtractor.applyAsLong(c2));
	}

	public static<T> Comparator<T> comparingDouble(ToDoubleFunction<? super T> keyExtractor) {
		Objects.requireNonNull(keyExtractor);
		return (Comparator<T> & Serializable)
			(c1, c2) -> Double.compare(keyExtractor.applyAsDouble(c1), keyExtractor.applyAsDouble(c2));
	}
}
```

