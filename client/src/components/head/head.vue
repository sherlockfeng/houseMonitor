<template>

	<div class="app">
      <header class="head">
        <div class="head-inner">
          <a class="head-title">
            精选
          </a>
          <nav class="head-nav">
            <a class="nav-item" :class="{'is-active': hrefText === 'zhihu'}" href="/events/pages/zhihu/index.html">知乎</a>
            <a class="nav-item" :class="{'is-active': hrefText === 'toutiao'}" href="/events/pages/toutiao/index.html">今日头条</a>
            <a class="nav-item" :class="{'is-active': hrefText === 'my'}">我的</a>
          </nav>
        </div>
      </header>
  </div>
</template>

<script>
  import 'iview/dist/styles/iview.css'
  export default {
    props: {
      hrefText: {
        type: String,
        required: false,
        default: 'zhihu'
      }
    },
		data () {
			return {
			}
		},
		created () {
      const vm = this

		},
		methods: {

	
		}
  }
</script>

<style lang="scss">
  .head {
    position: fixed;
    z-index: 100;
    min-width: 1032px;
    overflow: hidden;
    background: #fff;
    box-shadow: 0 1px 3px rgba(26,26,26,.1);
    background-clip: content-box;
    width: 100%;
    .head-inner{
      position: relative;
      display: flex;
      width: 1000px;
      height: 52px;
      padding: 0 16px;
      margin: 0 auto;
      align-items: center;
      transition: transform .3s;
      transition: transform .3s,-webkit-transform .3s;
      .head-title {
        color: inherit;
        text-decoration: none;
        font-size: 20px;
      }
      .head-nav {
        display: flex;
        justify-content: space-between;
        height: 30px;
        margin-right: 18px;
        margin-left: 27px;
        color: #999;
        .nav-item {
          padding: 0 15px;
          font-size: 15px;
          line-height: 30px;
          color: #8590a6;
          &:first-child {
            padding-left: 0px;
          }
          &.is-active {
            color: #444;
          }
        }
      }
    }
  }
</style>
