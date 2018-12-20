<template>

	<div class="app">
		<Head :hrefText="hrefText"></Head>
		<article-list :articleList="articleList" :type="'toutiao'"></article-list>
  </div>
</template>

<script>
	import Head from 'components/head/head'
	import ArticleList from 'components/articleList/articleList'
	import utils from 'utils'
  export default {
		data () {
			return {
				hrefText: 'toutiao',
				articleList: []
			}
		},
		created () {
			const vm = this
			utils.get('/api/toutiao', {}, (response) => {
				vm.articleList = response.data
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
