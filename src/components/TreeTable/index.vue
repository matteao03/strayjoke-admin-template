<template>
  <el-table
    :data="tableData"
    :row-style="showRow"
    v-bind="$attrs"
    v-on="$listeners"
  >
    <el-table-column
      v-for="item in columns"
      :key="item.key"
      :prop="item.key"
      :width="item.width"
      :align="item.align||'center'"
      :label="item.label"
    >
      <template slot-scope="scope">
        <template v-if="item.expand">
          <span :style="{'padding-left':+scope.row._level*30 + 'px'} "></span>
          <span v-show="showSperadIcon(scope.row)" class="tree-ctrl" @click="toggleExpanded(scope.$index)">
            <i v-if="!scope.row._expand" class="el-icon-arrow-right" />
            <i v-else class="el-icon-arrow-down" />
          </span>
        </template>
        {{ scope.row[item.key] }}
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import treeToArray, { addAttrs } from './eval.js'

export default {
  name: 'TreeTable',
  props: {
    data: {
      type: Array,
      required: true,
      default: () => []
    },
    columns: {
      type: Array,
      default: () => []
    }
  },
  computed: {
    tableData() {
      const data = this.data
      if (this.data.length === 0) {
        return []
      }
      addAttrs(data)

      const retval = treeToArray(data)
      return retval
    }
  },
  methods: {
    showRow: function({ row }) {
      const parent = row._parent
      const show = parent ? parent._expand && parent._show : true
      row._show = show
      return show
        ? 'animation:treeTableShow 1s;-webkit-animation:treeTableShow 1s;'
        : 'display:none;'
    },
    showSperadIcon(record) {
      return record[this.children] && record[this.children].length > 0
    },
    toggleExpanded(trIndex) {
      const record = this.tableData[trIndex]
      const expand = !record._expand
      record._expand = expand
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
