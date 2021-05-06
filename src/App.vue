<template>
    <div id="app">
      <router-view/>
    </div>

</template>

<script>
    
export default {
    name: "app",
};
</script>

<style type="text/scss" lang="scss">
@import "./styles/base";
html {
    height: 100%;
}
body {
    height: 100%;
    overflow: hidden;
}
#app {
    height: 100%;
}

/* 分割*/
.app-main {
  /*50 = navbar  */
  min-height: calc(100vh - 50px);
  width: 100%;
  position: relative;
  overflow: hidden;
}
.fixed-header + .app-main {
  padding-top: 50px;
}

.hasTagsView {
  .app-main {
    /* 84 = navbar + tags-view = 50 + 34 */
    min-height: calc(100vh - 84px);
  }

  .fixed-header+.app-main {
    padding-top: 84px;
  }
}
</style>
