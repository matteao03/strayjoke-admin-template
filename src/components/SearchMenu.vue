<template>
  <div :class="{'show':showSearch}" class="search">
    <icon-svg icon-class="search" @click.stop="clickSearch" />
    <el-select
      ref="selectInput"
      v-model="searchValue"
      :remote-method="querySearch"
      filterable
      default-first-option
      remote
      class="search-select"
      placeholder="搜索"
      @change="changeOptions"
    >
      <el-option
        v-for="item in options"
        :key="item.path"
        :value="item"
        :label="item.name.join(' > ')"
      />
    </el-select>
  </div>
</template>

<script>
import Fuse from 'fuse.js'
import path from 'path'

export default {
  data() {
    return {
      searchValue: '',
      showSearch: false,
      options: [],
      searchPool: [],
      fuse: null
    }
  },
  computed: {
    routes() {
      return this.$store.state.routes
    }
  },
  watch: {
    showSearch(val) {
      if (val) {
        document.body.addEventListener('click', this.closeSearch)
      } else {
        document.body.removeEventListener('click', this.closeSearch)
      }
    },
    routes() {
      this.searchPool = this.generateRoutes(this.routes)
    },
    searchPool(list) {
      this.initFuse(list)
    }
  },
  mounted() {
    this.searchPool = this.generateRoutes(this.routes)
  },
  methods: {
    clickSearch() {
      this.showSearch = !this.showSearch
      if (this.showSearch) {
        this.$refs.selectInput && this.$refs.selectInput.focus()
      }
    },
    closeSearch() {
      this.$refs.selectInput && this.$refs.selectInput.blur()
      this.options = []
      this.showSearch = false
    },
    querySearch(query) {
      if (query !== '') {
        this.options = this.fuse.search(query)
      } else {
        this.options = []
      }
    },
    generateRoutes(routes, basePath = '/', preName = []) {
      let res = []
      for (const router of routes) {
        if (router.hidden) { continue }
        const data = {
          path: path.resolve(basePath, router.path),
          name: [...preName]
        }
        if (router.name) {
          data.name = [...data.name, router.name]
        }

        if (router.children) {
          const tempData = this.generateRoutes(router.children, data.path, data.name)
          if (tempData.length >= 1) {
            res = [...res, ...tempData]
          }
        } else {
          res.push(data)
        }
      }
      return res
    },
    changeOptions(item) {
      this.$router.push(item.path)
      this.searchValue = ''
      this.options = []
      this.$nextTick(() => {
        this.showSearch = false
      })
    },
    initFuse(list) {
      this.fuse = new Fuse(list, {
        shouldSort: true,
        threshold: 0.4,
        location: 0,
        distance: 100,
        maxPatternLength: 32,
        minMatchCharLength: 1,
        keys: [{
          name: 'name',
          weight: 0.7
        }, {
          name: 'path',
          weight: 0.3
        }]
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.search{
    .search-select {
        font-size: 18px;
        transition: width 0.2s;
        width: 0;
        overflow: hidden;
        border-radius: 0;
        display: inline-block;
        vertical-align: middle;

        /deep/ .el-input__inner {
            border-radius: 0;
            background: #242F42;
            border: 0;
            color:#fff;
            padding-left: 10px;
            padding-right:0;
            box-shadow: none !important;
            border-bottom: 1px solid #d9d9d9;
            vertical-align: middle;
        }
    }
    &.show{
        .search-select{
            width:210px;
        }
    }
}
</style>

