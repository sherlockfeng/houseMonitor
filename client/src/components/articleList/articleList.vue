<template>
	<div class="article">
		<div class="article-content">
			<div class="content-line">
				<div v-for="(item, index) in articleOne" :key="index" class="content-item">
					<div class="info-item" @click="jumpToDetail(item)">
						<img src="../../assets/img/loading.gif" @load="afterImg(item)" alt='' :id="item.id">
						<span>{{item.title}}</span>
					</div>
				</div>
			</div>
			<div class="content-line">
				<div v-for="(item, index) in articleTwo" :key="index" class="content-item">
					<div class="info-item"  @click="jumpToDetail(item)">
						<img src="../../assets/img/loading.gif" @load="afterImg(item)" alt='' :id="item.id">
						<span>{{item.title}}</span>
					</div>
				</div>
			</div>
			<div class="content-line">
				<div v-for="(item, index) in articleThree" :key="index" class="content-item">
					<div class="info-item" @click="jumpToDetail(item)">
						<img src="../../assets/img/loading.gif" @load="afterImg(item)" alt='' :id="item.id">
						<span>{{item.title}}</span>
					</div>
				</div>
			</div>
		</div>
  </div>
</template>

<script>
  export default {
    props: {
			articleList: {
        type: Array,
        required: false,
				default: [],
			},
			type: {
				type: String,
        required: false,
				default: 'zhihu',
			}
		},
		watch: {
			articleList(newVal, oldVal) {
				const vm = this
				newVal.map((item, index) => {
					if(index % 3 === 0) {
						vm.articleOne.push(item)
					}
					if(index % 3 === 1) {
						vm.articleTwo.push(item)
					}
					if(index % 3 === 2) {
						vm.articleThree.push(item)
					}
					return
				})
			}
		},
		data () {
			return {
				articleOne: [],
				articleTwo: [],
				articleThree: [],
				configure: {
					zhihu: {
						imgSrc: 'images',
						type: 'array',
						detailUrl: '/pages/zhihuDetail/index.html?id=',
						jumpId: 'id'
					},
					toutiao: {
						imgSrc: 'image_url',
						type: 'object',
						detailUrl: '/pages/toutiaoDetail/index.html?id=',
						jumpId: 'group_id'
					}
				}
			}
		},
		created () {
      const vm = this

		},
		mounted () {
			const vm = this
			
		},
		methods: {
			jumpToDetail(value) {
				const vm = this
				const config = vm.configure[vm.type]
				window.location.href = `${config.detailUrl}${value[config.jumpId]}`
			},
			afterImg(value) {
				const vm = this
				const config = vm.configure[vm.type]
				vm.$nextTick(() => {
					let src = ''
					config.type === 'array' && (src = value[config.imgSrc][0])
					config.type === 'object' && (src = value[config.imgSrc])
					document.getElementById(value.id).src = src
				})
			}
		},
		components: {
    }
  }
</script>

<style lang="scss">
	.article {
		background-color: #f9f9f9;
		padding-top: 52px;
		min-height: 100vh;
		.article-content {
			width: 1000px;
			margin: 0 auto;
			display: flex;
			flex-direction: row;
			justify-content: center;
			padding-bottom: 50px;
			.content-line {
				display: flex;
				flex: 1;
				flex-direction: column;
				.content-item {
					margin: 20px 20px 0 0;
					cursor: pointer;
					padding: 20px;
					background: #fff;
					border-radius: 2px;
					.info-item {
						position: relative;
						img {
							display: block;
							max-width: 100%;
							height: 260px;
							opacity: 1;
							margin-bottom: 1em;
						}
						span {
							font-size: 16px;
							color: #000;
							line-height: 30px;
							display: block;
							background: #fff;
						}
					}
				}
			}
		}
	}
</style>
