<template>
  <div class="article-detail">
    <div class ="article-detail-img">
      <img :src="imgUrl" alt='' @load="removeImgPlace">
    </div>
    <div v-html="content" class="article-detail-content">
    </div>
  </div>
</template>

<script>
	import utils from 'utils'
  export default {
    props: {
			detail: {
        type: Object,
        required: false,
				default: {}
      }
    },
    watch: {
      detail(newValue, oldValue) {
        const vm = this
        newValue.body && (vm.content = newValue.body)
        let head = document.getElementsByTagName('head')[0]
        let link = document.createElement('link')
        link.type='text/css'
        link.rel = 'stylesheet'
        link.href = newValue.css[0]
        head.appendChild(link)
        newValue.image && (vm.imgUrl = newValue.image)
      }
    },
		data () {
			return {
        content: '',
        imgUrl: ''
			}
		},
		created () {
			const vm = this
		},
		methods: {
	    removeImgPlace() {
        const vm = this
        vm.$nextTick(() => {
          let imgChild = document.getElementsByClassName('img-place-holder')[0]
          document.getElementsByClassName('headline')[0].removeChild(imgChild)
        })
      }
		},
		components: {
    }
  }
</script>

<style lang="scss">
	.article-detail {
		background-color: #f9f9f9;
		min-height: 100vh;
    .article-detail-content {
      width:600px;
			margin: 0 auto;
    }
    .article-detail-img {
      text-align: center;
      img {
        width: 600px;
        height: 373px;
        padding-top: 52px;
      }
    }
	}
</style>
