<template>
  <h3>更新记录</h3>
  <table>
    <thead>
      <tr>
        <td v-for="item in listHead" :key="item">{{ item }}</td>
      </tr>
    </thead>
    <tbody>
      <tr v-for="list in listBody" :key="list">
        <td v-for="item in list" :key="item">
          <a href="javascript:;" @click="goToPage(item.link)">
            {{ item.text }}
          </a>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { defineComponent } from 'vue'
import sidebar from './sidebar.js'

export default defineComponent({
  name: 'List',
  props: ['type'],
  data() {
    return {
      sidebar: sidebar[`/${this.type}/`].slice(1)
    }
  },
  methods: {
    goToPage(link) {
      this.$router.push(link)
    }
  },
  computed: {
    listHead() {
      return this.sidebar.map(x => x.text)
    },
    listBody() {
      let children = this.sidebar.map(x => x.children)
      const res = []
      const n = children.reduce((pre, cur) => (cur.length > pre ? cur.length : pre), Math.max())
      for (let i = 0; i < n; i++) {
        res[i] = []
        for (let j = 0; j < children.length; j++) {
          res[i].push(children[j][i] ?? [])
        }
      }
      return res
    }
  }
})
</script>
