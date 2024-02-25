<template>

  <div class="dashboard-container">

    <div class="main">
      <p>인구 감소율 분석 차트</p>
    </div>
    <!-- 첫 번째 차트: Line Chart -->
    <div class="card_flex">
    <div class="chart-card">
      <div class="chart-title">연도별 출생률 차트</div>
      <div class="chart-container">
        <div class="line-chart">
          <svg ref="svg"></svg>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <div class="font">
      <p>코로나로 인한 최대사망 </p>
      <dt class="dt">코로나로 인하여 평소 앓던 지병에 합병증으로 사망하는 경우가 많이 발생, 매년  출산율은 감소하나 사망률은 코로나로 인해 폭발적으로 증가하여 인구 감소에 가속화된 경향이 있음 </dt>
    </div>
    </div>

    <div class="chart-card">
      <figure>
        <img src="https://news.kbs.co.kr/data/news/2023/09/21/20230921_ZbTEeU.jpg" alt="">
      </figure>
      <dl>
        <dd>코로나19가 바꾼 사망 통계…사망자 수 역대 최대</dd>
        <dt><a href="https://news.kbs.co.kr/news/pc/view/view.do?ncd=7779789">https://news.kbs.co.kr/news/pc/view/view.do?ncd=7779789</a></dt>
      </dl>
    </div>

    
  </div>

    <!-- 두 번째 차트: Divorce Chart -->

    <div class="card_flex">
    <div class="chart-card">
      <div class="chart-title">이혼률 차트</div>
      <div class="chart-container">
        <div class="divorce_chart">
          <svg ref="divorce_svg"></svg>
        </div>
      </div>
    </div>

    <div class="chart-card">
      <div class="font">
     <p>늘어나는 딩크족</p>


        <dt class="dt">늘어나는 결혼률에 비해 현저히 적어지는 출생률 결혼은 선호하나 아이를 낳는 것은 경제 상황상 어렵다는 판단에 결혼은 하되, 아이는 낳지 않는 이른바 "딩크족" 성행</dt>
      </div>
    </div>
    
    
    <div class="chart-card">
      <figure>
        <img src="https://news.koreadaily.com/data/photo/2023/12/18/ebbb2654-3c51-441e-b3c1-720d4f6ed1ba.jpg" alt="">
      </figure>
      <dl>
        <dd>2030 미혼 성인남녀 44%, ‘딩크족’ 생활 꿈꿔</dd>
        <dt><a href="https://www.dailyenews.co.kr/news/articleView.html?idxno=880">https://www.dailyenews.co.kr/news/articleView.html?idxno=880</a></dt>
      </dl>
    </div>
</div>
    <!-- 세 번째 차트: Region Bar Chart -->
    <div class="chart-block">
      <div class="chart-title">지역별 출생률 및 사망률</div>
      <div class="region_chart">
        <svg ref="region_bar_chart_svg"></svg>
      </div>
    </div>

    <!-- 네 번째 차트: Natural Increase Chart -->
    <div class="chart-block">
      <div class="chart-title">지역별 자연증가율</div>
      <div class="natural">
        <svg ref="natural_svg"></svg>
      </div>
    </div>
  </div>



</template>

<script>
import * as d3 from 'd3';

export default {
  name: 'LineChart',
  mounted() {
    this.fetchData();
    this.fetchDivorceData();
    this.fetchRegiondata();
    this.fetchNatural();

  },
  methods: {
    fetchData() {
      fetch('http://172.30.1.16:8000/groupby_vital')
        .then(response => response.json())
        .then(data => {
          this.drawChart(data);
        });
    },
    fetchDivorceData() {
      fetch('http://172.30.1.16:8000/groupby_divorce')
        .then(response => response.json())
        .then(data => {
          this.drawDivorceChart(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchRegiondata(){
      fetch('http://172.30.1.16:8000/region_death')
        .then(response => response.json())
        .then(data => {
          this.drawRegionBarChart(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    fetchNatural(){
      fetch('http://172.30.1.16:8000/natural_increase_rate')
        .then(response => response.json())
        .then(data => {
          this.drawNaturalIncreaseChart(data);
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    },
    drawChart(data) {
      const svg = d3.select(this.$refs.svg);
      const svgWidth = 600, svgHeight = 400;
      svg.attr('width', svgWidth).attr('height', svgHeight).style('background-color', 'white');

      const margin = { top: 20, right: 20, bottom: 50, left: 50 };
      const width = svgWidth - margin.left - margin.right;
      const height = svgHeight - margin.top - margin.bottom;

      const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

      // 데이터 파싱
      const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
      data.forEach(d => {
        d.date = parseTime(d.date);
        d.birth_rate = +d.birth_rate;
        d.death_rate = +d.death_rate;
      });

      // 축 스케일 설정
      const x = d3.scaleTime().rangeRound([0, width]);
      const y = d3.scaleLinear().rangeRound([height, 0]);

      x.domain(d3.extent(data, d => d.date));
      y.domain([0, d3.max(data, d => Math.max(d.birth_rate, d.death_rate))]);

      // 축 그리기
      g.append('g')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSizeOuter(0))
        .selectAll('text')
        .attr('y', 10)
        .attr('dy', '0.35em')
        .attr('text-anchor', 'middle');

      g.append('g')
        .call(d3.axisLeft(y))
        .append('text')
        .attr('fill', '#000')
        .attr('transform', 'rotate(-90)')
        .attr('y', 6)
        .attr('dy', '0.71em')
        .attr('text-anchor', 'end')
        .text('출생률 / 사망률');

      // 그리드 라인 추가
      g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0,${height})`)
        .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));

      g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));

      // 라인 생성 함수
      const lineBirth = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.birth_rate));

      const lineDeath = d3.line()
        .x(d => x(d.date))
        .y(d => y(d.death_rate));

      // 출생률 라인 그리기
      g.append('path')
        .data([data])
        .attr('fill', 'none')
        .attr('stroke', 'steelblue')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 2)
        .attr('d', lineBirth);

      // 사망률 라인 그리기
      g.append('path')
        .data([data])
        .attr('fill', 'none')
        .attr('stroke', 'red')
        .attr('stroke-linejoin', 'round')
        .attr('stroke-linecap', 'round')
        .attr('stroke-width', 1.5)
        .attr('d', lineDeath);

      // 데이터 포인트에 동그라미 마커 추가
      g.selectAll('.birth-rate-dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'birth-rate-dot')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.birth_rate))
        .attr('r', 3)
        .attr('fill', 'steelblue');

      g.selectAll('.death-rate-dot')
        .data(data)
        .enter().append('circle')
        .attr('class', 'death-rate-dot')
        .attr('cx', d => x(d.date))
        .attr('cy', d => y(d.death_rate))
        .attr('r', 3)
        .attr('fill', 'red');

      // 범례 추가
      const legend = svg.append('g')
        .attr('class', 'legend')
        .attr('transform', `translate(520,35)`);

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'steelblue');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 8)
        .text('출생률');

      legend.append('rect')
        .attr('x', 0)
        .attr('y', 20)
        .attr('width', 10)
        .attr('height', 10)
        .attr('fill', 'red');

      legend.append('text')
        .attr('x', 15)
        .attr('y', 28)
        .text('사망률');

      // 차트 제목 추가
      svg.append('text')
        .attr('x', svgWidth / 2)
        .attr('y', margin.top / 1.5)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .text('연도별 출생률과 사망률');
    },
    drawDivorceChart(data)  {
  const divorce_svg = d3.select(this.$refs.divorce_svg);
  const svgWidth = 600, svgHeight = 400;
  divorce_svg.attr('width', svgWidth).attr('height', svgHeight).style('background-color', 'white');

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const g = divorce_svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const parseTime = d3.timeParse('%Y-%m-%dT%H:%M:%S');
  data.forEach(d => {
    d.date = parseTime(d.date);
    d.birth_rate = +d.birth_rate;
    d.divorce_rate = +d.divorce_rate;
    d.marrige_rate = +d.marrige_rate;
  });

  const x = d3.scaleTime().rangeRound([0, width]);
  const y = d3.scaleLinear().rangeRound([height, 0]);

  x.domain(d3.extent(data, d => d.date));
  y.domain([
    0,
    d3.max(data, d => Math.max(d.birth_rate, d.divorce_rate, d.marrige_rate))
  ]);

  g.append('g')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')
    .attr('y', 10)
    .attr('dy', '0.35em')
    .attr('text-anchor', 'middle');

  g.append('g')
    .call(d3.axisLeft(y))
    .append('text')
    .attr('fill', '#000')
    .attr('transform', 'rotate(-90)')
    .attr('y', 6)
    .attr('dy', '0.71em')
    .attr('text-anchor', 'end')
    .text('비율');

  // 그리드 라인 추가
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));

  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));

  const lineBirth = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.birth_rate));

  const lineDivorce = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.divorce_rate));

  const lineMarriage = d3.line()
    .x(d => x(d.date))
    .y(d => y(d.marrige_rate));

  g.append('path')
    .data([data])
    .attr('fill', 'none')
    .attr('stroke', 'steelblue')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 2)
    .attr('d', lineBirth);

  g.append('path')
    .data([data])
    .attr('fill', 'none')
    .attr('stroke', 'green')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', lineDivorce);

  g.append('path')
    .data([data])
    .attr('fill', 'none')
    .attr('stroke', 'orange')
    .attr('stroke-linejoin', 'round')
    .attr('stroke-linecap', 'round')
    .attr('stroke-width', 1.5)
    .attr('d', lineMarriage);

  // 데이터 포인트에 동그라미 마커 추가
  g.selectAll('.birth-rate-dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'birth-rate-dot')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.birth_rate))
    .attr('r', 3)
    .attr('fill', 'steelblue');

  g.selectAll('.divorce-rate-dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'divorce-rate-dot')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.divorce_rate))
    .attr('r', 3)
    .attr('fill', 'green');

  g.selectAll('.merrige-rate-dot')
    .data(data)
    .enter().append('circle')
    .attr('class', 'merrige-rate-dot')
    .attr('cx', d => x(d.date))
    .attr('cy', d => y(d.marrige_rate))
    .attr('r', 3)
    .attr('fill', 'orange');

  // 범례 추가
  const legend = divorce_svg.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${margin.left},${margin.top})`);

  legend.append('rect')
    .attr('x', width - 80)
    .attr('y', 20)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'steelblue');

  legend.append('text')
    .attr('x', width - 65)
    .attr('y', 28)
    .text('출생률');

  legend.append('rect')
    .attr('x', width - 80)
    .attr('y', 40)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'green');

  legend.append('text')
    .attr('x', width - 65)
    .attr('y', 48)
    .text('이혼률');

  legend.append('rect')
    .attr('x', width - 80)
    .attr('y', 60)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'orange');

  legend.append('text')
    .attr('x', width - 65)
    .attr('y', 68)
    .text('결혼률');

  // 타이틀 추가
  divorce_svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top / 1.5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('연도별 출생률, 이혼률, 결혼률');
},
drawRegionBarChart(data) {
  const svg = d3.select(this.$refs.region_bar_chart_svg);
  const svgWidth = 2000, svgHeight = 400;
  svg.attr('width', svgWidth).attr('height', svgHeight).style('background-color', 'white');

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const regions = data.map(d => d.region);
  const birthRates = data.map(d => +d.birth_rate);
  const deathRates = data.map(d => +d.death_rate);

  const x0 = d3.scaleBand()
    .domain(regions)
    .rangeRound([0, width])
    .paddingInner(0.1);

  const x1 = d3.scaleBand()
    .domain(['birth_rate', 'death_rate'])
    .rangeRound([0, x0.bandwidth()])
    .padding(0.05);

  const y = d3.scaleLinear()
    .domain([0, d3.max([...birthRates, ...deathRates])]).nice()
    .rangeRound([height, 0]);

  const xAxis = g => g
  .attr('transform', `translate(0,${height})`)
  .call(d3.axisBottom(x0).tickSizeOuter(0))
  .selectAll('text') // 모든 xticks의 텍스트를 선택합니다.
  .style('font-size', '9px'); // 글자 크기를 조정합니다.

  const yAxis = g => g
    .call(d3.axisLeft(y).ticks(null, 's'))
    .call(g => g.select('.domain').remove());

  // x축 그리드 라인 추가
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x0).tickSize(-height).tickFormat(''));

  // y축 그리드 라인 추가
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));

  g.append('g')
    .selectAll('g')
    .data(data)
    .join('g')
    .attr('transform', d => `translate(${x0(d.region)},0)`)
    .selectAll('rect')
    .data(d => ['birth_rate', 'death_rate'].map(key => ({ key, value: d[key] })))
    .join('rect')
    .attr('x', d => x1(d.key))
    .attr('y', d => y(d.value))
    .attr('width', x1.bandwidth())
    .attr('height', d => height - y(d.value))
    .attr('fill', d => d.key === 'birth_rate' ? 'steelblue' : 'red');

  g.append('g')
    .call(xAxis);

  g.append('g')
    .call(yAxis);

  // 범례 추가
  const legend = g.append('g')
  .attr('class', 'legend')
  .attr('transform', `translate(${width / 2},360)`); // 높이값 조정

legend.append('rect')
  .attr('x', -35)
  .attr('y', 0)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', 'steelblue');

legend.append('text')
  .attr('x', -20)
  .attr('y', 8)
  .text('Birth Rate');

legend.append('rect')
  .attr('x', 80)
  .attr('y', 0)
  .attr('width', 10)
  .attr('height', 10)
  .attr('fill', 'red');

legend.append('text')
  .attr('x', 95)
  .attr('y', 8)
  .text('Death Rate');

  // 타이틀 추가
  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top / 1.5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Region별 출생률 및 사망률');
},
drawNaturalIncreaseChart(data) {
  const svg = d3.select(this.$refs.natural_svg);
  const svgWidth = 2000, svgHeight = 400;
  svg.attr('width', svgWidth).attr('height', svgHeight).style('background-color', 'white');

  const margin = { top: 20, right: 20, bottom: 50, left: 50 };
  const width = svgWidth - margin.left - margin.right;
  const height = svgHeight - margin.top - margin.bottom;

  const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

  const regions = data.map(d => d.region);
  const naturalIncreaseRates = data.map(d => +d.natural_increase_rate);

  const x = d3.scaleBand()
    .domain(regions)
    .rangeRound([0, width])
    .paddingInner(0.1);

  const y = d3.scaleLinear()
    .domain([d3.min(naturalIncreaseRates), d3.max(naturalIncreaseRates)]).nice()
    .rangeRound([height, 0]);

  const xAxis = g => g
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSizeOuter(0))
    .selectAll('text')
    .style('font-size', '9px')
  
    .attr('dy', '0.35em')
    .attr('text-anchor', 'end');

  const yAxis = g => g
    .call(d3.axisLeft(y).ticks(null, 's'))
    .call(g => g.select('.domain').remove());

  // x축 그리드 라인 추가
  g.append('g')
    .attr('class', 'grid')
    .attr('transform', `translate(0,${height})`)
    .call(d3.axisBottom(x).tickSize(-height).tickFormat(''));

  // y축 그리드 라인 추가
  g.append('g')
    .attr('class', 'grid')
    .call(d3.axisLeft(y).tickSize(-width).tickFormat(''));

  g.append('g')
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', d => x(d.region))
    .attr('y', d => y(Math.max(0, d.natural_increase_rate)))
    .attr('width', x.bandwidth())
    .attr('height', d => Math.abs(y(d.natural_increase_rate) - y(0)))
    .attr('fill', d => d.natural_increase_rate < 0 ? 'red' : 'steelblue');

  g.append('g')
    .call(xAxis);

  g.append('g')
    .call(yAxis);

  // 범례 추가
  const legend = g.append('g')
    .attr('class', 'legend')
    .attr('transform', `translate(${width - 100},20)`);

  legend.append('rect')
    .attr('x', -40)
    .attr('y', 0)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'steelblue');

  legend.append('text')
    .attr('x', -15)
    .attr('y', 8)
    .text('Positive Increase');

  legend.append('rect')
    .attr('x', -40)
    .attr('y', 20)
    .attr('width', 10)
    .attr('height', 10)
    .attr('fill', 'red');

  legend.append('text')
    .attr('x', -15)
    .attr('y', 28)
    .text('Negative Increase');

  // 타이틀 추가
  svg.append('text')
    .attr('x', svgWidth / 2)
    .attr('y', margin.top / 1.5)
    .attr('text-anchor', 'middle')
    .style('font-size', '16px')
    .text('Region별 자연증가율');

}



  }
};
</script>


<style>

.chart-card {
  width: 635px; /* 이혼률 차트와 라인 차트의 원하는 너비 */
  height: 460px; /* 이혼률 차트와 라인 차트의 원하는 높이 */
  margin: 20px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chart-block {
  width: 2000px; /* 지역별 출생률 및 사망률, 지역별 자연증가율의 원하는 너비 */
  height: 400px; /* 지역별 출생률 및 사망률, 지역별 자연증가율의 원하는 높이 */
  margin: 20px;
  padding: 64px;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
}

.chart-title {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}

.chart-container, .region_chart, .natural {
  width: 100%;
  height: 100%;
}

.line-chart{
  display: flex;
}

.line-chart svg {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  margin: 0 auto;
  display: block; /* SVG를 블록 요소로 설정 */
}

.leftside {
  margin: 210px auto;
  display: flex;
  align-items: center;
}

div {
  margin: 0 auto;
}

p {
  text-align: center; /* 가운데 정렬 */
  font-weight: bold; /* 굵게 */
  font-size: 50px; /* 폰트 크기 */
  margin-bottom: 20px; /* 바차트와의 간격 조절 */
}

.leftside{
  margin: 210px auto 210px;
  display: flex;
  align-items: center;
}

.divorce_chart svg {
  background-color: #f5f5f5;
  border: 1px solid #ccc;
  display: block;
}

.region_chart{
  background-color: #f5f5f5;
  display: block;
}

.card_flex{
  display: flex;

}

figure{
  width: 100px;
}

img{
  object-fit: cover;
  width: 441px;
}

dl{
  text-align: center;
}

dd{
  font-size: 30px;
  
}

dt{
  margin-top: 30px;
  font-size: 18px;
}

.dt{
  text-align: center;

}

.font{
  text-align: center;
  margin: 145px auto;
}
</style>
