<template>
  <div>
    <div>
      <ul>
        <li v-for="item in list" :key="item.text">
          <a @click="goto(item.link)" href="javascript:;">
            {{ item.text }}
          </a>
          <span>：{{ item.desc }}</span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vitepress'
const router = useRouter()

const list = [
  {
    text: '奇技淫巧',
    link: '/JS/uncanny-tricks/ch01',
    desc: 'JS 一些诡异的行为的解释和花里胡哨的操作，有些看着没啥用，实则蕴含了 JS 底层的一些原理。'
  },
  {
    text: '查漏补缺',
    link: '/JS/check-for-gaps/ch01',
    desc: 'JS中容易遗忘或者遗漏的知识点和难点，基于本人自身而言的，更多的是一些笔记。'
  },
  {
    text: '代码模板',
    link: '/JS/code-templates/ch01',
    desc: '常用的一些代码模板，包括但不限于常规算法题中的模板等等。'
  }
]
const goto = link => {
  router.go(link)
}
</script>
