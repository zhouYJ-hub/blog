## 前言
---
当javascript代码执行一段代码时,会创建对应执行的上下文.对于每个执行上下文,都有三个重要属性:
- 变量对象
- 作用域链
- this

### ECMAScript类型
---
ECMAScript类型分为语言类型和规范类型
- **语言类型**:开发者可以直接在代码层面使用的,就是我们常用的Undefined,Null,Number,String,Object,Boolean,Symbols。
- **规范类型**:用来描述语言底层行为逻辑，是用来用算法描述ECMAScript语言结构和语言类型的,是一种抽象类型，不存在实际代码中，规范类型包括:Reference，List, Completion, Property Descriptor, Property Identifier, Lexical Environment, 和 Environment Record。
我们讲this重点要说的就是Reference类型。

### Reference
---
什么是Reference呢？
根据规范了解Reference类型就是用来解释赋值，delete，typeof等操作的。
借用尤雨溪大佬的话就是:
> 这里的 Reference 是一个 Specification Type，也就是 “只存在于规范里的抽象类型”。它们是为了更好地描述语言的底层行为逻辑才存在的，但并不存在于实际的 js 代码中。
**Reference**由三部分组成
- **base value** : 属性所在的对象或者EnvironmentRecord，它的值只可能是 undefined, an Object, a Boolean, a String, a Number, or an environment record 其中的一种。
- **reference name**: 属性的名称
- **strict reference** :是否是严格模式

举个栗子

```Javascript
let foo = {
  bar:function(){
    return this
  }
}

//对应的Reference

let barReference = {
  baseValue:foo,
  name:'bar',
  strict:false
}
```
再举个栗子
```javascript
let foo = 1

//对应的Reference
let fooReference = {
  baseValue: EnvironmentRecord,
  name:'foo',
  strict:false
}
```
规范还提供了获取Reference组成部分的方法
- **GetBase(Reference)**:获取一个Reference类型的base value
- **IsPropertyReferencr(Reference)**:判断一个Reference类型的base value是否是一个对象
- **Getvalue(Reference)**:获取一个Reference类型对应值，返回的不是一个Reference类型，切记!
举个GetValue使用栗子
```javascript
let foo = 1

//对应的Reference
let fooReference = {
  baseValue: EnvironmentRecord,
  name:'foo',
  strict:false
}

GetValue(fooReference) //1
```

好了，讲了这么久的Reference类型,他和this有什么关联呢，接下来高能时刻来临，请注意！！！
规范上是这样描述的
> 1.Let ref be the result of evaluating MemberExpression.

> 6.If Type(ref) is Reference, then

>  a.If IsPropertyReference(ref) is true, then
>  i.Let thisValue be GetBase(ref).

>  b.Else, the base of ref is an Environment Record
>  i.Let thisValue be the result of calling the ImplicitThisValue concrete method of GetBase(ref).

> 7.Else, Type(ref) is not Reference.

> a. Let thisValue be undefined.
翻译过来就是:
1. 计算MemberExpression的结果，然后赋值给ref
2. 判断ref是不是Reference类型
   - 如果ref是Reference类型,且IsPropertyReference（ref）为true，那么this的值为GetBase(ref)
   - 如果ref是Reference类型，且IsPropertyReference（ref）为false，base value是Environment Record，那么this的值为ImplicitThisValue(ref)
   - 如果ref不是Reference类型,那么this的值为undefined

ImplicitThisValue始终返回undefined

### 具体分析
1. 计算MemberExpression的结果，然后赋值给ref
什么是MemberExpression？
MemberExpression：
- PrimaryExpression：原始表达式(字面量、关键字和变量)
- FunctionExpression： 函数定义表达式
- MemberExpression [ Expression ] : 属性访问表达式
- MemberExpression .IdentifierName : 属性访问表达式
- new MemberExpression Arguments ： 对象创建表达式

举个栗子

```javascript
function foo() {
    console.log(this)
}

foo(); // MemberExpression 是 foo

function foo() {
    return function() {
        console.log(this)
    }
}

foo()(); // MemberExpression 是 foo()

var foo = {
    bar: function () {
        return this;
    }
}

foo.bar(); // MemberExpression 是 foo.bar
```

简单来说MemberExpression 就是()左边的部分

2. 判断ref是不是一个Reference类型
举个栗子
```javascript
var value = 1;

var foo = {
  value: 2,
  bar: function () {
    return this.value;
  }
}
foo.bar()
```
通过MemberExpression计算的结果就是foo.bar，但是foo.bar是不是Reference类型呢?
根据规范:
> Return a value of type Reference whose base value is baseValue and whose referenced name is propertyNameString, and whose strict mode flag is strict.
我们得知是Reference类型
根据之前的知识我们可以知道返回的值是
```javascript
let Reference = {
   baseValue:foo,
   name:'bar',
   staict:false
}
```
根据前面我们所得到的的
> 如果ref是Reference类型,且IsPropertyReference（ref）为true，那么this的值为GetBase(ref)

我们可以知道basevalue是foo，foo是一个对象，所以IsPropertyReference(ref)为true,最后我们可以根据GetBase(ref)来确定this了，所以this指向的是foo;

--- 

好了我们知道原理以来看看下面几个特殊的例子
**(foo.bar)()**
根据计算Memberexpression计算结果为**(foo.bar)**,那他是不是reference类型呢？根据规范
> Return the result of evaluating Expression. This may be of type Reference.

> NOTE This algorithm does not apply GetValue to the result of evaluating Expression.
看最后的结果部分，并没有对Memberexpression值使用GetValue，所以该值还是一个Reference类型和前面foo.bar()示例一样;

---

在全局作用域执行
```javascript
function foo() {
    console.log(this)
}

foo(); 
```
MemberExpression 是 foo，没有经过运算Getvalue，所以返回一个Reference类型的值,该值为
```javascript
let Reference = {
    baseValue:'EnvironmentRecord',
    name:'foo',
    staict:false
}
```
根据前面所讲的
> 如果ref是Reference类型，且IsPropertyReference（ref）为false，base value是Environment Record，那么this的值为ImplicitThisValue(ref)
所以this值为undefined
查看规范 10.2.1.1.6，ImplicitThisValue 方法的介绍：该函数始终返回 undefined。

---

下面几种情况都是在其计算值的时候使用了GetValue,前面我们提到了通过GetValue返回的值就不是Reference类型了
- (false || foo.bar)() :逻辑与算法
- (foo.bar = foo.bar)() :赋值
- (foo,bar,foo.bar)() : 逗号操作符

根据前面内容
> 如果ref不是Reference类型,那么this的值为undefined
所以这几种this都是undefined

