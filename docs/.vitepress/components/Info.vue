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
    desc: '诡异行为的解释，涉及语言底层原理，也包含了平时写代码的技巧。'
  },
  {
    text: '实用知识',
    link: '/JS/check-for-gaps/ch01',
    desc: '基于本人自身而言的的易遗忘或者遗漏的知识点和难点。'
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
