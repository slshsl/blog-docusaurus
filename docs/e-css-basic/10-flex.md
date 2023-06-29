---
sidebar_position: 10
---

# flex

## 概述

## 用法

- 父元素

    - `display:flex`

    - `flex-direction:row`（row-reverse\column\column-reverse）主轴方向

    - `flex-wrap:nowrap`(wrap) 主轴方向上是否换行

    - `justify-content:flex-start`(flex-end\center\space-between\space-around) 主轴方向上如何分布

    - `align-content:flex-start`(flex-end\center\space-between\space-around\stretch) 交叉轴方向如何分布，只在多行有效；
    stretch属性值只有不设置子元素高度有效

    - `align-items:flex-start`(flex-end\center\baseline\stretch) 交叉轴方向如何分布，只在单行有效；stretch属性值只有不设置子元素高度有效

- 子元素：

    - `order:0`

    - `align-self:flex-start`(flex-end\center\baseline\stretch) 交叉轴方向如何分布，优先级

    - `align-items`高,比align-content低

    - `flex: flex-grow flex-shrink flex-basis`

        - `flex-grow:0`(如果主轴方向还有剩余空间时，子元素按比例瓜分空间)

        - `flex-shrink:1`(如果主轴方向还有剩余空间时，子元素内容盒的宽度乘以各自的flex-shrink除以所有子元素内容盒的宽度乘以各自flex-shrink的和来压缩各自空间)

        举例有两个子元素：

        $$
        \frac {子1内容区宽度*子1shrink}{子1内容区宽度*子1shrink+ 子2内容区宽度*子2shrink} * 主轴方向超出大小 = 子元素1应该压缩的空间
        $$

        :::tip

        lex-shrink只能压缩内容区

        :::

        - `flex-basis:auto`（默认值为auto）

        :::tip

        如果没设置width或者flex-basis>width时，flex-basis设置的时元素的最小值

        :::

        :::tip

        如果设置了width且width>flex-basis,那么这个元素的宽度的下限是flex-basis,上线是width

        :::

        :::tip

        对上面两个总结，就是flex-basis是最小值，如果设置了width，width小于flex-basis无效，大于flex-basis时则最大之是width

        :::