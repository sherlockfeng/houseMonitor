<template>

	<div class="app">
		<div class="search">
		</div>
		<div class="charts">
			<Carousel v-model="chartIndex" loop>
        <CarouselItem>
            <div class="demo-carousel">1</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">2</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">3</div>
        </CarouselItem>
        <CarouselItem>
            <div class="demo-carousel">4</div>
        </CarouselItem>
    	</Carousel>
		</div>
  </div>
</template>

<script>
	import utils from 'utils'
	import 'iview/dist/styles/iview.css'
	import { Carousel, CarouselItem } from 'iview'
  export default {
		data () {
			return {
				chartIndex: 0
			}
		},
		created () {
			const vm = this
		},
		methods: {

	
		},
		components: {
			Carousel,
			CarouselItem,
    }
  }
</script>
