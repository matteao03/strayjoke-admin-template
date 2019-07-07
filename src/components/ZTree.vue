<template>
  <div class="area-tree">
    <div v-if="showSearch" class="search">
      <el-input
        :id="searchContainer"
        v-model="searchDept"
        placeholder="部门搜索"
        prefix-icon="el-icon-search"
        @input="searchNode"
      >
      </el-input>
    </div>
    <div v-if="showTitle" class="title">
      <span>组织机构</span>
      <div class="operate">
        <i class="el-icon-edit-outline" title="编辑" @click="goDept"></i>
        <i ref="arrowDown" class="el-icon-arrow-down" title="折叠/展开" @click="collapseTree"></i>
        <i class="el-icon-refresh" title="刷新" @click="freshArea"></i>
      </div>
    </div>
    <div :id="container" class="ztree"></div>
  </div>
</template>

<script>
import $ from 'jquery'
import '@ztree/ztree_v3/js/jquery.ztree.core.js'
import '@ztree/ztree_v3/js/jquery.ztree.excheck.js'
// import '@ztree/ztree_v3/js/jquery.ztree.exedit.js'
import '@ztree/ztree_v3/css/metroStyle/metroStyle.css'

export default {
  props: {
    treeData: {
      type: Array,
      default: function() {
        return []
      }
    },
    container: {
      type: String,
      default: 'tree-demo'
    },
    searchContainer: {
      type: String,
      default: 'tree-demo-search'
    },
    showSearch: {
      type: Boolean,
      default: false
    },
    showTitle: {
      type: Boolean,
      default: true
    },
    isCollapse: {
      type: Boolean,
      default: false
    },
    isCheck: {
      type: Boolean,
      default: false
    }
  },
  data: function() {
    return {
      searchDept: '',
      nodeList: [],
      setting: {
        callback: {
          onClick: this.showEmplDatas,
          onCheck: this.showCheckedDatas
        },
        view: {
          fontCss: this.getFontCss
        },
        check: {
          enable: this.isCheck,
          chkStyle: 'checkbox',
          chkboxType: { 'Y': 's', 'N': 's' }
        }
      },
      zNodes: [],
      flagCollapse: false
    }
  },
  watch: {
    treeData(val) {
      this.zNodes = val
      var zTree = $.fn.zTree.init($('#' + this.container), this.setting, this.zNodes)
      zTree.expandAll(this.isCollapse)
    }
  },
  created() {
    this.zNodes = this.treeData
    this.flagCollapse = this.isCollapse
  },
  mounted() {
    var zTree = $.fn.zTree.init($('#' + this.container), this.setting, this.zNodes)
    zTree.expandAll(this.flagCollapse)
  },
  methods: {
    goDept() {
      this.$router.push('/system/dept')
    },
    freshArea() {
      var zTree = $.fn.zTree.getZTreeObj(this.container)
      zTree.refresh()
    },
    collapseTree() {
      var zTree = $.fn.zTree.getZTreeObj(this.container)
      const flag = !this.flagCollapse
      zTree.expandAll(flag)
      this.flagCollapse = flag
    },
    showEmplDatas(event, treeId, treeNode) {
      this.$emit('changeEmpl', treeNode)
    },
    showCheckedDatas(event, treeId, treeNode) {
      const zTree = $.fn.zTree.getZTreeObj(this.container)
      const checkNodes = zTree.getCheckedNodes(true)
      console.log(checkNodes)
      const checkedNodeIds = []
      checkNodes.forEach((item) => {
        checkedNodeIds.push(item.id)
      })
      this.$emit('checkNode', checkedNodeIds)
    },
    searchNode(e) {
      var zTree = $.fn.zTree.getZTreeObj(this.container)
      const keyword = this.searchDept
      this.nodeList = zTree.getNodesByParamFuzzy('name', keyword)
      if (keyword === '') {
        this.updateNodes(false)
      } else {
        this.updateNodes(true)
      }
    },
    getNode() {
      const zTree = $.fn.zTree.getZTreeObj(this.container)
      return zTree.getSelectedNodes()[0]
    },
    updateNodes(highlight) {
      var zTree = $.fn.zTree.getZTreeObj(this.container)
      var nodeList = this.nodeList
      for (var i = 0, l = nodeList.length; i < l; i++) {
        nodeList[i].highlight = highlight
        zTree.updateNode(nodeList[i])
      }
    },
    getFontCss(treeId, treeNode) {
      return (treeNode.highlight) ? { color: '#A60000', 'font-weight': 'bold' } : { color: '#333', 'font-weight': 'normal' }
    }
  }
}
</script>

<style lang="scss" scoped>
.area-tree{
  background-color: #fff;
}
.search{
  margin:-20px 0 10px;
}
.title{
  margin:10px 10px 5px;
  padding-bottom: 10px;
  display:flex;
  align-items:center;
  justify-content:space-between;
  border-bottom:1px solid #ddd;
  .operate{
    i{
      padding: 5px;
      cursor: pointer;
      color:#888;
      &:hover{
        color:#ff2121;
      }
    }
  }
}

</style>
