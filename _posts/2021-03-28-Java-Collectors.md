---
title: Java Collectors
author: Arasia
date: 2021-03-28 23:16:34 +0900
categories: [Language, Java]
tags: [java]
---

# Collectors

> Stream의 종료 연산 중 collect를 할 때 사용된다  
> 다양한 방법으로 사용자가 원하는 결과물을 만들어 낼 수 있다

## Collection 결과물 반환

> 이미 지정된 형태의 결과물로 반환한다

- toCollection

	> Stream의 Element를 collectionFactory의 Return Type으로 모아 반환한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| toCollection | Supplier\<C\> collectionFactory | C extends Collection\<T\> |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	ArrayList<Integer> list = stream.collect(Collectors.toCollection(ArrayList::new));
	```

- toList

	> Stream의 Element를 List에 모아 반환한다  
	> Base Supplier는 ArrayList로 진행된다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| toList | void | List\<T\> |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	List<Integer> list = stream.collect(Collectors.toList());
	```

- toSet

	> Stream의 Element를 Set에 모아 반환한다  
	> Base Supplier는 HashSet으로 진행된다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| toSet | void | Set\<T\> |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Set<Integer> list = stream.collect(Collectors.toSet());
	```

- toMap

	> Stream의 Element를 Map에 모아 반환한다  
	> Base Supplier는 HashMap으로 진행된다  
	> toConcurrentMap도 존재하며 toMap과 비슷하게 동작한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| toMap | Function\<? super T, ? extends K\> keyMapper<br />Function<? super T, ? extends U> valueMapper | Map\<K, U\> | 키가 중복되면 IllegalStateException 발생 |
	| toMap | Function\<? super T, ? extends K\> keyMapper<br />Function<? super T, ? extends U> valueMapper<br />BinaryOperator\<U\> mergeFunction | Map\<K, U\> | mergeFunction으로 중복 키 발생 시 처리 방법을 지정 |
	| toMap | Function\<? super T, ? extends K\> keyMapper<br />Function<? super T, ? extends U> valueMapper<br />BinaryOperator\<U\> mergeFunction<br />Supplier\<M\> mapSupplier | Map\<K, U\> | mergeFunction으로 중복 키 발생 시 처리 방법을 지정<br />mapSupplier의 Return Type을 Base로 동작 |
	
	```java
	/* toMap(Function<? super T, ? extends K> keyMapper,
			Function<? super T, ? extends U> valueMapper)*/
	// [1, 2, 3]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(3);
	// [{"1", 1}, {"2", 2}, {"3", 3}]
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n));
	
	// [1, 1, 1]
	Stream<Integer> stream = Stream.iterate(1, n -> n).limit(3);
	// IllegalStateException
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n));
	
	/* toMap(Function<? super T, ? extends K> keyMapper,
			Function<? super T, ? extends U> valueMapper,
			BinaryOperator<U> mergeFunction)*/
	// [1, 2, 3]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(3);
	// [{"1", 1}, {"2", 2}, {"3", 3}]
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n, (o, n)-> n));
	
	// [1, 1, 1]
	Stream<Integer> stream = Stream.iterate(1, n -> n).limit(3);
	// [{"1", 1}]
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n, (o, n)-> n));
	
	/* toMap(Function<? super T, ? extends K> keyMapper,
			Function<? super T, ? extends U> valueMapper,
			BinaryOperator<U> mergeFunction,
			Supplier<M> mapSupplier)*/
	// [1, 2, 3]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(3);
	// [{"1", 1}, {"2", 2}, {"3", 3}]
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n, (o, n)-> n, HashMap::new));
	
	// [1, 1, 1]
	Stream<Integer> stream = Stream.iterate(1, n -> n).limit(3);
	// [{"1", 1}]
	Map<String, Integer> map = stream.collect(Collectors.toMap(String::valueOf, n->n, (o, n)-> n, HashMap::new));
	```

## 연산된 결과물 반환

### String 결과물 반환

- joining

	> Stream의 Element를 하나의 String에 모아 반환한다  
	> Element는 CharSequence이여야 한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| joining | void | String |      |
	| joining | CharSequence delimiter | String |      |
	| joining | CharSequence delimiter<br />CharSequence prefix<br />CharSequence seffix | String |      |
	
	```java
	// [1, 2, 3]
	Stream<String> stream = Stream.iterate(1, n -> n+1).limit(3).map(String::valueOf);
	// 123
	String str = stream.collect(Collectors.joining());
	
	// [1, 2, 3]
	Stream<String> stream = Stream.iterate(1, n -> n+1).limit(3).map(String::valueOf);
	// 1,2,3
	String str = stream.collect(Collectors.joining(","));
	
	// [1, 2, 3]
	Stream<String> stream = Stream.iterate(1, n -> n+1).limit(3).map(String::valueOf);
	// <1,2,3>
	String str = stream.collect(Collectors.joining(",", "<", ">"));
	```

### 분류된 결과물 반환

```java
// Base Class
public class Student {
	private String name;
	private Integer age;

	public Student(String name, Integer age) {
		this.name = name;
		this.age = age;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getAge() {
		return age;
	}

	public void setAge(Integer age) {
		this.age = age;
	}
    
	@Override
	public String toString() {
		return "{" +
			"name=\"" + name + "\"" +
			", age=" + age +
			"}";
    }
}

// BaseData
Stream<Student> stream = Stream.<Student>builder()
		.add(new Student("Peter", 20))
		.add(new Student("Sam", 21))
		.add(new Student("Tom", 22))
		.add(new Student("James", 20))
		.add(new Student("Annie", 22))
		.build();
```

- groupingBy

	> Stream의 Element를 classifier의 결과를 기준을 Key로 한 Map에 List로 담겨 반환된다  
	> Base는 HashMap\<K, ArrayList\<T\>\>로 동작한다  
	> groupingByConcurrent도 존재하며 groupingBy와 비슷하게 동작한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| groupingBy | Function\<? super T, ? extends K\> classifier |  |      |
	| groupingBy | Function\<? super T, ? extends K\> classifier<br />Collector\<? super T, A, D\> downstream |  |      |
	| groupingBy | Function\<? super T, ? extends K\> classifier<br />Supplier\<M\> mapFactory<br />Collector\<? super T, A, D\> downstream |  |      |

	```java
	/* 
	{20=[{name="Peter", age=20}, {name="James", age=20}],
	 21=[{name="Sam", age=21}],
	 22=[{name="Tom", age=22}, {name="Annie", age=22}]}
	*/
	Map<Integer, List<Student>> map = stream.collect(Collectors.groupingBy(Student::getAge));
	
	/* 
	{20=[{name="Peter", age=20}, {name="James", age=20}],
	 21=[{name="Sam", age=21}],
	 22=[{name="Tom", age=22}, {name="Annie", age=22}]}
	*/
	Map<Integer, List<Student>> map stream.collect(Collectors.groupingBy(Student::getAge, Collectors.toList()));
	
	/* 
	{20=[{name="Peter", age=20}, {name="James", age=20}],
	 21=[{name="Sam", age=21}],
	 22=[{name="Tom", age=22}, {name="Annie", age=22}]}
	*/
	Map<Integer, List<Student>> map = stream.collect(Collectors.groupingBy(Student::getAge,HashMap::new ,Collectors.toList()));
	```

- partitioningBy

	> Stream의 Element를 predicate의 결과를 기준을 Key로 한 Map에 List로 담겨 반환된다  
	> Base는 Partition\<Boolean, ArrayList\<T\>>로 동작한다  
	> Partition은 Map\<Boolean, T\> 형태이다
	
	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
| partitioningBy | Predicate\<? super T\> predicate | Map\<Boolean, List\<T\> |      |
	| partitioningBy | Predicate\<? super T\> predicate<br />Collector\<? super T, A, D\> downstream | Map\<Boolean, D\> |      |
	
	```java
	/*
	{false=[{name="Peter", age=20}, {name="Sam", age=21}, {name="James", age=20}],
	 true=[{name="Tom", age=22}, {name="Annie", age=22}]}
	*/
	Map<Boolean, List<Student>> map = stream.collect(Collectors.partitioningBy(student -> student.getAge()>21));
	
	/*
	{false=[{name="Peter", age=20}, {name="Sam", age=21}, {name="James", age=20}],
	 true=[{name="Tom", age=22}, {name="Annie", age=22}]}
	*/
	Map<Boolean, List<Student>> map = stream.collect(Collectors.partitioningBy(student -> student.getAge()>21, Collectors.toList()));
	```

### 단순 연산된 결과물 반환

- counting

	> Stream의 Element의 갯수를 long Type으로 반환한다  
	> Stream의 count와 동일한 동작을 한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| counting | void | long |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// 10
	long count = stream.collect(Collectors.counting());
	// 10
	long count = stream.count();
	```

- minBy

	> Stream의 Element를 comparator의 결과에 따라 최솟값을 Optional에 담아 반환한다  
	> Stream이 비어있다면 Optional.empty를 반환한다  
	> Stream의 min과 동일한 동작을 한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| minBy | Comparator<? super T> comparator | T |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// Optional[1]
	Optional<Integer> integer = stream.collect(Collectors.maxBy(Integer::compare));
	// Optional[1]
	Optional<Integer> integer = stream.min(Integer::compare);
	```

- maxBy

	> Stream의 Element를 comparator의 결과에 따라 최대값을 Optional에 담아 반환한다  
	> Stream이 비어있다면 Optional.empty를 반환한다  
	> Stream의 max과 동일한 동작을 한다
	
	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| maxBy | Comparator<? super T> comparator | T |      |
	
	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// Optional[10]
	Optional<Integer> integer = stream.collect(Collectors.maxBy(Integer::compare));
	// Optional[1]
	Optional<Integer> integer = stream.max(Integer::compare);
	```

### 산술 연산된 결과물 반환

> 각 Method는 Stream의 Element Type에 따라 {Function Name}뒤에 Int, Long, Double이 붙은 Method를 호출한다

- summing

	> 각 Method의 연산 타입에 맞는 Function의 결과값을 모두 더해 반환한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| summingInt | ToIntFunction\<? super T\> mapper | Integer |      |
	| summingLong | ToIongFunction\<? super T\> mapper | Long |      |
	| summingDouble | ToDoubleFunction\<? super T\> mapper | Double |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// 55
	Integer result = stream.collect(Collectors.summingInt(n->n));
	```

- averaging

	> 각 Method의 연산 타입에 맞는 Function의 결과값의 평균값을 반환한다

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| averagingInt | ToIntFunction\<? super T\> mapper | Double |      |
	| averagingLong | ToIongFunction\<? super T\> mapper | Double |      |
	| averagingDouble | ToDoubleFunction\<? super T\> mapper | Double |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// 5.5
	Double result = stream.collect(Collectors.averagingInt(n->n));
	```
	
- summarizing

	> 각 Method의 연산 타입에 맞는 Function의 결과값의 SummaryStatistics을 반환한다  
	> SummaryStatistics는 count, sum, min, max, average를 반환할 수 있다  
	> 추가적으로 SummaryStatistics는 accept, combine으로 값을 추가하여 새로운 결과를 가져올 수 있다
	
	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| summarizingInt | ToIntFunction\<? super T\> mapper | IntSummaryStatistics |      |
	| summarizingLong | ToIongFunction\<? super T\> mapper | LongSummaryStatistics |      |
	| summarizingDouble | ToDoubleFunction\<? super T\> mapper | DoubleSummaryStatistics |      |
	
	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// count=10, sum=55, min=1, average=5.500000, max=10
	IntSummaryStatistics result = stream.collect(Collectors.summarizingInt(n->n));
	```
	
### 기타

- reducing

	> Stream의 Element에 대한 op를 연속하여 연산한 결과를 반환한다.

	| Function Name | Parameter | Return Type | 비고 |
	| ------------- | -------------- | ----------- | ---- |
	| reducing | BinaryOperator\<T\> op | Optional\<T\> |      |
	| reducing | T identity<br />BinaryOperator\<T\> op | T |      |
	| reducing | U identity<br />Function\<? super T, ? extends U\> mapper<br />BinaryOperator\<U\> op | U |      |

	```java
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// Optional[55]
	Optional<Integer> result = stream.collect(Collectors.reducing(Integer::sum));
	
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	// 65
	Integer result = stream.collect(Collectors.reducing(10, Integer::sum));
	
	// [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
	Stream<Integer> stream = Stream.iterate(1, n -> n+1).limit(10);
	//560
	Integer result = stream.collect(Collectors.reducing(10, n -> n*10, Integer::sum));
	```
