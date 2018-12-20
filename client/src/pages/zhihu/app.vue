<template>

	<div class="app">
		<Head :hrefText="hrefText"></Head>
		<article-list :articleList="articleList"></article-list>
  </div>
</template>

<script>
	import Head from 'components/head/head.vue'
	import ArticleList from 'components/articleList/articleList.vue'
	import utils from 'utils'
  export default {
		data () {
			return {
				hrefText: 'zhihu',
				articleList: []
			}
		},
		created () {
			const vm = this
			utils.get('/api/zhihu', {}, (response) => {
				vm.articleList = response.data.stories
			})
		},
		methods: {

	
		},
		components: {
			Head,
			ArticleList,
    }
  }
</script>
