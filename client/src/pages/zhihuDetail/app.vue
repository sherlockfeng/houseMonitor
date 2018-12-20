<template>

	<div class="article-detail">
		<Head :hrefText="hrefText"></Head>
		<article-detail :detail="detail"></article-detail>
  </div>
</template>

<script>
	import Head from 'components/head/head.vue'
	import articleDetail from 'components/articleDetail/articleDetail.vue'
	import utils from 'utils'
  export default {
		data () {
			return {
				hrefText: 'zhihu',
				detail: {},
			}
		},
		created () {
			const vm = this
			const id = utils.getQueryStringByName('id')
			utils.get('/api/zhihu/article/'+id, {}, (response) => {
				vm.detail = response.data
			})
		},
		methods: {

	
		},
		components: {
			Head,
			articleDetail,
    }
  }
</script>
