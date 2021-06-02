---
layout: post
title: PCRE 重置捕获组编号
categories: literature
tags: regex
date: 2021-05-19 03:07 +0000
---
## 概念：
#### 多选分支 (alternative)
形如 `/abc|def/` 的正则表达式中，有两个用竖杠分隔的子表达式 `abc` 和 `def`，正则引擎能够匹配其中任意一个表达式，我们称这些子表达式为 “多选分支 (alternative)”。

#### 非捕获组 (non-capturing group)
当我们需要对表达式分组，而又不想捕获组数据时，需要用到非捕获组（或称‘非捕获子模式’），用 `(?: )` 表示。 如：`/(?:Satur|Sun)day/`，此时，正则引擎只对 `Satur` 和 `Sun` 分组，但不捕获里面的数据，也不参与分组编号。

### PCRE 的捕获组编号
在通常的捕获模式下，每个捕获括号都有自己的顺序编号，与多选分支无关，如 `/abc(def)|ghi(jkl)mn/`，这里的 (abc) 的编号为1，(jkl) 的编号为2。
当表达式与字符串 `ghijklmn` 匹配时，捕获结果为：
```php
[
    0 => 'ghijklmn',
    1 => null,
    2 => 'jkl'
]
```
- 编号 0 为 `全匹配项 (full match)`
- 编号 1 对应第一个捕获括号，它没有匹配成功，所以为空
- 编号 2 对应第二个捕获括号，匹配成功并捕获到数据 'jkl'。

### 捕获组编号重置 (duplicate subpattern numbers)
PCRE 还支持另一种非捕获模式，用 `(?| )` 表示。在这种子模式下，所有多选分支中的捕获编号都会被重置，如：`/(?|abc(def)|ghi(jkl)mn)/` 在与字符串 `ghijklmn` 匹配时，捕获结果为：
```php
[
    0 => 'ghijklmn',
    1 => 'jkl'
]
```
正则引擎首先对子表达式 `abc(def)` 进行匹配，捕获编号为 1，此时匹配没有成功；随后又对 `ghi(jkl)mn` 进行匹配，由于在此模式下多选分支捕获编号重置，所以捕获编号仍然为 1，并且前一组没有匹配成功的分组被直接丢弃了。

捕获组编号重置功能对于那些 “只关心多选分支中匹配成功的部分” 的场景非常有用！它可以简化捕获结果，提高性能。

### PCRE 命名捕获陷阱
python 的 regex 包，和 PCRE 都实现了捕获组编号重置重置功能，但二者有细节上的差别。python 支持将相同编号的组命名为不同的名称，而 PCRE 不允许
#### python 的实现：
```python
import regex

pattern = r"(?|(?P<foo>first)|(?P<bar>second))"
matchObj = regex.match(pattern, 'second', )

print(matchObj.groupdict())
```
输出结果为:
```
{'foo': None, 'bar': 'second'}
```
本来应该被重置的组被赋予了新的编号，并且保存到了捕获组中。可见在 python 的编号重置模式中，只有相同的组名才能对应相同的编号。

#### php 的实现
```php
$pattern = '/(?|(?P<foo>first)|(?P<bar>second))/';

preg_match($pattern, 'second', $match);
```
输出结果为:
```
PHP Warning:  preg_match(): Compilation failed: different names for subpatterns of the same number are not allowed at offset 25
```
使用 PCRE 库的 php，在组号相同，命名不同的情况下会产生错误。这一点与 perl 也存在差异，perl支持这种语法，并且所有分组都会被赋予相同的值。

#### perl 的实现
```perl
use Data::Dumper;

if ('second' =~ /(?|(?<foo>first)|(?<bar>second))/) {
    print Dumper(\%+);
}
```

输出结果为:
```text
$VAR1 = {
    'bar' => 'second',
    'foo' => 'second'
};
```
