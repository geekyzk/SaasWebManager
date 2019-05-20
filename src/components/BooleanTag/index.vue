<template>
  <div>
    <el-tag v-if="tagValue" type="success">是</el-tag>
    <el-tag v-else type="danger">否</el-tag>
  </div>
</template>

<script type="text/ecmascript-6">
export default {
  name: 'BooleanTag',
  components: {

  },
  model: {
    prop: 'tagValue',
    event: 'change'
  },
  props: {
    tagValue: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {

    }
  }
}
</script>

<style scope>
</style>
