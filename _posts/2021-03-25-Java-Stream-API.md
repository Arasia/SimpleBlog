---
title: Java Stream API
author: Arasia
date: 2021-03-25 02:16:34 +0900
categories: [Language, Java]
tags: [java]
---

# Stream API

> 외부 반복을 통해 작업하는 컬렉션과 다르게 내부 반복을 통해 작업을 수행  
> Stream은 재사용이 불가능함  
> Stream은 원본 데이터를 변경하지 않음  
> Filter-Map 기반의 API를 사용하여 Lazy 연산을 통해 성능을 최적화  
> parallelStream()을 통하여 간단한 병렬처리를 지원

## Stream의 기본동작

1.  Stream 생성 / 변경
2.  Stream 중간 처리
3.  Stream 최종 처리

## Stream Class

> java.util.stream

```java
public interface Stream<T> extends BaseStream<T, Stream<T>> {

	Stream<T> filter(Predicate<? super T> predicate);

	<R> Stream<R> map(Function<? super T, ? extends R> mapper);
	IntStream mapToInt(ToIntFunction<? super T> mapper);
	LongStream mapToLong(ToLongFunction<? super T> mapper);
	DoubleStream mapToDouble(ToDoubleFunction<? super T> mapper);

	<R> Stream<R> flatMap(Function<? super T, ? extends Stream<? extends R>> mapper);
	IntStream flatMapToInt(Function<? super T, ? extends IntStream> mapper);
	LongStream flatMapToLong(Function<? super T, ? extends LongStream> mapper);
	DoubleStream flatMapToDouble(Function<? super T, ? extends DoubleStream> mapper);

	Stream<T> distinct();
	Stream<T> sorted();
	Stream<T> sorted(Comparator<? super T> comparator);
	Stream<T> peek(Consumer<? super T> action);
	Stream<T> limit(long maxSize);
	Stream<T> skip(long n);

	void forEachOrdered(Consumer<? super T> action);

	Object[] toArray();
	<A> A[] toArray(IntFunction<A[]> generator);

	T reduce(T identity, BinaryOperator<T> accumulator);
	Optional<T> reduce(BinaryOperator<T> accumulator);
	<U> U reduce(U identity, BiFunction<U, ? super T, U> accumulator, BinaryOperator<U> combiner);

	<R> R collect(Supplier<R> supplier, BiConsumer<R, ? super T> accumulator, BiConsumer<R, R> combiner);
	<R, A> R collect(Collector<? super T, A, R> collector);

	Optional<T> min(Comparator<? super T> comparator);
	Optional<T> max(Comparator<? super T> comparator);

	long count();

	boolean anyMatch(Predicate<? super T> predicate);
	boolean allMatch(Predicate<? super T> predicate);
	boolean noneMatch(Predicate<? super T> predicate);

	Optional<T> findFirst();
	Optional<T> findAny();

	// Static factories
	public static<T> Builder<T> builder() {
		return new Streams.StreamBuilderImpl<>();
	}

	public static<T> Stream<T> empty() {
		return StreamSupport.stream(Spliterators.<T>emptySpliterator(), false);
	}

	public static<T> Stream<T> of(T t) {
		return StreamSupport.stream(new Streams.StreamBuilderImpl<>(t), false);
	}

	@SafeVarargs
	@SuppressWarnings("varargs") // Creating a stream from an array is safe
	public static<T> Stream<T> of(T... values) {
		return Arrays.stream(values);
	}

	public static<T> Stream<T> iterate(final T seed, final UnaryOperator<T> f) {
		Objects.requireNonNull(f);
		final Iterator<T> iterator = new Iterator<T>() {
			@SuppressWarnings("unchecked")
			T t = (T) Streams.NONE;

			@Override
			public boolean hasNext() {
				return true;
			}

			@Override
			public T next() {
				return t = (t == Streams.NONE) ? seed : f.apply(t);
			}
		};
		return StreamSupport.stream(Spliterators.spliteratorUnknownSize(
			iterator, Spliterator.ORDERED | Spliterator.IMMUTABLE), false);
	}

	public static<T> Stream<T> generate(Supplier<T> s) {
		Objects.requireNonNull(s);
		return StreamSupport.stream(
			new StreamSpliterators.InfiniteSupplyingSpliterator.OfRef<>(Long.MAX_VALUE, s), false);
	}

	public static <T> Stream<T> concat(Stream<? extends T> a, Stream<? extends T> b) {
		Objects.requireNonNull(a);
		Objects.requireNonNull(b);

		@SuppressWarnings("unchecked")
		Spliterator<T> split = new Streams.ConcatSpliterator.OfRef<>(
			(Spliterator<T>) a.spliterator(), (Spliterator<T>) b.spliterator());
		Stream<T> stream = StreamSupport.stream(split, a.isParallel() || b.isParallel());
		return stream.onClose(Streams.composedClose(a, b));
	}

	public interface Builder<T> extends Consumer<T> {

		@Override
		void accept(T t);

		default Builder<T> add(T t) {
			accept(t);
			return this;
		}

		Stream<T> build();
	}
}
```

---

## Stream 생성 / 변경

### Stream 생성

- Stream.empty()

	> 빈 Stream 생성

	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| Stream.empty  | void           | Stream<T>   |      |

	``` java
	// []
	Stream<Integer> stream = Stream.empty();
	```

- Stream.builder()

	> builder를 통한 생성

	| Fucntion Name     | Parameter Type | Return Type | 비고 |
	| ----------------- | -------------- | ----------- | ---- |
	| Stream.<T>builder | void           | Builder<T>  |      |

	```java
	// [1, 2, 3]
	Stream<Integer> stream = Stream.<Integer>builder().add(1).add(2).add(3).build();
	```

- Stream.generate()

	> 반드시 limit를 사용하여 최대 크기를 지정해주어야한다.  
	> limit를 사용하지 않으면 Stream이 무제한으로 생성된다.

	| Fucntion Name   | Parameter Type | Return Type | 비고                   |
	| --------------- | -------------- | ----------- | ---------------------- |
	| Stream.generate | Supplier<T>    | Stream<T>   | limit를 통한 제한 필요 |

	```java
	// [1, 1, 1]
	Stream<Integer> stream = Stream.generate(()->1).limit(3);
	```

- Stream.iterate()

	| Fucntion Name   | Parameter Type      | Return Type | 비고                   |
	| --------------- | ------------------- | ----------- | ---------------------- |
	| Stream.iterator | T, UnaryOperator<T> | Stream<T>   | limit를 통한 제한 필요 |

	```java
	// [1, 2, 3]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(3);
	```

### Arrays에서 Stream 생성

- Stream.of()

	| Fucntion Name | Parameter Type | Return Type | 비고                       |
	| ------------- | -------------- | ----------- | -------------------------- |
	| Stream.of     | T              | Stream<T>   | Array 전달                 |
	| Stream.of     | T...           | Stream<T>   | One or More Parameter 전달 |

	```java
	// [1, 2, 3]
	Integer[] strings = new Integer[]{1, 2, 3};
	Stream<Integer> stream = Stream.of(strings);
  
	// [1, 2, 3]
	Stream<Integer> stream = Stream.of(1, 2, 3);
	```

### Collection에서 Stream 생성

- Collection.stream()

	> Collection에서 제공하는 함수를 통한 Stream 생성

	| Fucntion Name     | Parameter Type | Return Type | 비고 |
	| ----------------- | -------------- | ----------- | ---- |
	| Collection.stream | void           | Stream<T>   |      |

	```java
	// [1, 2, 3]
	List<Integer> list = new ArrayList<>(Arrays.asList(1, 2, 3));
	Stream<Integer> stream = list.stream();
	```

### 기존 Stream에서 새로운 Stream 생성

- Stream.concat

	> 두 개의 Stream을 하나의 Stream으로 통합

	| Fucntion Name | Parameter Type                           | Return Type | 비고 |
	| ------------- | ---------------------------------------- | ----------- | ---- |
	| concat        | Stream<? extends T>, Stream<? extends T> | Stream<T>   |      |

	```java
	// [1]
	Stream<Integer> stream1 = Stream.of(1);
	// [2, 3]
	Stream<Integer> stream2 = Stream.of(2, 3);
	// [1, 2, 3]
	Stream<Integer> stream = Stream.concat(stream1, stream2);
	```

- Stream.map

	> Function에서 반환된 element를 모아 Stream으로 반환  
	> Function의 결과 타입에 따라 반환되는 Stream의 element Type이 변경됨

	| Fucntion Name | Parameter Type                   | Return Type | 비고 |
	| ------------- | -------------------------------- | ----------- | ---- |
	| map           | Function<? super T, ? extends R> | Stream<R>   |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"]
	Stream<String> stringStream = stream.map(String::valueOf);
	```

- Stream.flatMap

	> Stream내의 element를 Fucntion을 통해 가공하여 만들어진 Stream을 모아 하나의 Stream으로 반환  
	> Function의 결과 타입에 따라 반환되는 Stream의 element Type이 변경됨

	| Fucntion Name | Parameter Type                                     | Return Type | 비고 |
	| ------------- | -------------------------------------------------- | ----------- | ---- |
	| flatMap       | Function<? super T, ? extends Stream<? extends R>> | Stream<R>   |      |

	```java
	Integer[][] strings = new Integer[][]{ {1, 2}, {3, 4}};
	// [[1, 2], [3, 4]]
	Stream<Integer[]> stringsStream = Arrays.stream(strings);
	// [1, 2, 3, 4]
	Stream<Integer> stream = stringsStream.flatMap(Arrays::stream);
	```

---

## Stream 중간 처리

> 최종 연산이 수행되기 전 수행 단계를 지정  
> 최종 연산이 지정되어 Stream이 실행될 때 각 단계를 수행

- Stream.filter

	> Predicate의 결과가 True인 element를 모아 Stream으로 반환

	| Fucntion Name | Parameter Type        | Return Type | 비고 |
	| ------------- | --------------------- | ----------- | ---- |
	| filter        | Predeicate<? super T> | Stream<T>   |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// [2, 4, 6, 8, 10]
	stream = stream.filter(n -> n%2==0);
	```

- Stream.distinct

  > Stream의 element 중복 제거

  | Fucntion Name | Parameter Type | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | distinct      | void           | Stream<T>   |      |

  ```java
  // [1, 1, 1]
  Stream<Integer> stream = Stream.generate(()->1).limit(3);
  // [1]
  stream = stream.distinct();
  ```

- Stream.sorted

  > Stream의 element 정렬  
  > Comparator를 통한 정렬도 가능

  | Fucntion Name | Parameter Type        | Return Type | 비고 |
  | ------------- | --------------------- | ----------- | ---- |
  | sorted        | void                  | Stream<T>   |      |
  | sorted        | Comparator<? super T> | Stream<T>   |      |

  ```java
  // [3, 2, 1]
  Stream<Integer> stream = Stream.of(3, 2, 1);
  // [1, 2, 3]
  stream = stream.sorted();
  
  // [1, 2, 3]
  Stream<Integer> stream = Stream.of(1, 2, 3);
  // [3, 2, 1]
  stream = stream.sorted(Comparator.reverseOrder());
  ```

- Stream.peek

  > Stream의 element의 변화는 없음  
  > 각 element별 추가적인 작업 수행  

  | Fucntion Name | Parameter Type      | Return Type | 비고 |
  | ------------- | ------------------- | ----------- | ---- |
  | peek          | Consumer<? super T> | Stream<T>   |      |

  ```java
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
  // [2, 4, 6, 8, 10]
  stream = stream.filter(n -> n%2==0).peek(System.out::println); // print : 2 4 6 8 10
  ```

- Stream.limit

  > Stream의 중간 연산 수행 중 반환될 Stream의 element 갯수의 한도를 지정

  | Fucntion Name | Parameter Type | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | limit         | long           | Stream<T>   |      |

  ```java
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
  // [2, 4]
  stream = stream.filter(n -> n%2==0).limit(2);
  ```

- Stream.skip

	> Stream의 중간 연산 수행 중 반환될 Stream의 element 중 초기에 건너띄울 element의 갯수를 지정
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| skip          | long           | Stream<T>   |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// [6, 8, 10]
	stream = stream.filter(n -> n%2==0).skip(2);
	```

## Stream 최종 처리

> Stream이 종료되며 각 연산 별 결과가 반환된다.  
> Stream이 종료되면 재사용이 불가능하다.

- Stream.forEach

  > Stream의 각 Element에 대한 action을 취하고 종료한다

  | Fucntion Name | Parameter Type | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | forEach | Consumer<? super T> | void |      |

  ```java
  // [1, 2, 3]
  Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(3);
  
  stream.forEach(System.out::println); // print : 1 2 3
  ```

- Stream.toArray

  > Stream을 Array로 반환하고 종료한다

  | Fucntion Name | Parameter Type | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | toArray | void | Object[] |      |
  | toArray | IntFunction<A[]> | A[] | |

  ```java
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
  Integer[] integers = (Integer[]) stream.toArray();
  
  // [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
  Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
  Integer[] integers = stream.toArray(Integer[]::new);
  ```

- Stream.reduce

  > Stream의 각 Element들에 대한 커스텀 집계를 하여 결과를 반환하고 종료한다  
  > 집계의 초기값을 지정할 수 있다

  | Fucntion Name | Parameter Type | Return Type | 비고 |
  | ------------- | -------------- | ----------- | ---- |
  | reduce | BinaryOperator<T> | Optional<T> |      |
  | reduce | U, BiFunction<U, ? super T, U>, BinaryOperator<U> | U | |

  ```java
  
  ```

- Stream.collect

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| collect |            |    |      |

	```java
	
	```

- Stream.min

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| min |            |    |      |

	```java
	
	```

- Stream.max

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| max |            |    |      |

	```java
	
	```

- Stream.count

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| count |            |    |      |

	```java
	
	```

- Stream.anyMatch

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| anyMatch |            |    |      |

	```java
	
	```

- Stream.allMatch

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| allMatch |            |    |      |

	```java
	
	```

- Stream.noneMatch

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| noneMatch |            |    |      |

	```java
	
	```

- Stream.findFirst

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| findFirst |            |    |      |

	```java
	
	```

- Stream.findAny

	> 
  
	| Fucntion Name | Parameter Type | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| findAny |            |    |      |

	```java
	
	```
