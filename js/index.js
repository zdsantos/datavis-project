var qTable = dc.dataTable('#table');
var smenu = dc.selectMenu('#smenu');
var smenu2 = dc.selectMenu('#smenu2');
var smenu3 = dc.selectMenu('#smenu3');
var anos = []
var tipos = []
var questoes = []

const realFileButton = document.getElementById("real-file");
const inputButton = document.getElementById("input-button");
const filename = document.getElementById("file-name");
const submitButton = document.getElementById("submit-button");

var selectedFile = "";

inputButton.addEventListener("click", () => {
    realFileButton.click();
});

realFileButton.addEventListener("change", (event) => {
    if (realFileButton.value) {
		filename.innerHTML = realFileButton.value.match(/[\/\\]([\w\d\s\.\-\(\)]+)$/)[1];
		selectedFile = URL.createObjectURL(selectedFile = event.target.files[0]);
		console.log(selectedFile);
    } else {
        filename.innerHTML = "Nenhum arquivo escolhido.";
    }
});

submitButton.addEventListener("click", () => {
	console.log(selectedFile);
	loadData("data/file.csv");
});

// load data from a csv file
function loadData(path) {
	d3.csv(path).then(function (data) {

		// format our data
	data.forEach(function(d){
		d.ques = `Questão ${d.q}`;
		d.ct = +d.ct;
		d.c = +d.c;
		d.d = +d.d;
		d.dt = +d.dt;
		d.nsa = +d.nsa;
		d.dif = (d.c+d.ct)-(d.d+d.dt);
		if(!anos.includes(d.ano))
			anos.push(d.ano);

		if(!tipos.includes(d.tipo))
			tipos.push(d.tipo);

		if(!questoes.includes(d.q))
			questoes.push(d.q);
	});
	// Run the data through crossfilter and load our 'facts'
	var facts = crossfilter(data);
	var facts2 = crossfilter(data);


	let qDimension = facts.dimension(function(d){
		return +d.q;
	});
	let anoDimension = facts.dimension(function(d){
		return d.ano;
	});	
	let tipoDimension = facts.dimension(function(d){
		return d.tipo;
	}); 
	let anoTipoDimension = facts.dimension(function(d){
		return [d.ano,d.tipo];
	});
	let qAnoDimension = facts.dimension(function(d){
		return [+d.q,d.ano];
	});

	qTable.width(960)
		.height(800)
		.dimension(qDimension)
		.group(function (d) { return `${d.ano}, ${d.tipo}s`;})
		.size(10)
		.columns(['ques','ct','c','d','dt','nsa'])
		.sortBy(function(d){return +d.q;})
		.size(12*anos.length*tipos.length)	
		.order(d3.ascending);

	smenu
		.dimension(tipoDimension)
		.group(tipoDimension.group())
		.multiple(false)
		.controlsUseVisibility(true)
		.title(function(d){
			if( d.key==='discente')
				return `Discentes`;
			return `Docentes`;
		})
		.chartGroup('g1');

	smenu2
	  	.dimension(anoDimension)
		.group(anoDimension.group())
		.multiple(false)
		.controlsUseVisibility(true)
		.title(function(d){
			return d.key;
		})
		.chartGroup('g1');




	let ctByQ = qDimension.group().reduceSum(function(d){
		return (d.ct+d.c);
	});

	let dtByQ = qDimension.group().reduceSum(function(d){
		return (d.dt+d.d);
	});

	let ctByQAno = qAnoDimension.group().reduceSum(function(d){
		return (d.ct+d.c);
	});

	let dtByQAno = qAnoDimension.group().reduceSum(function(d){
		return (d.dt+d.d);
	});
	
	// Setup the charts
	var chart1 = dc.barChart('#chart1','g1');

	chart1.width(480)
		.height(200)
		.x(d3.scaleBand([qDimension.bottom(1)[0].q, qDimension.top(1)[0].q]))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.dimension(qDimension)
		.gap(56)
		.xAxisLabel('Question')
		.yAxisLabel('Acc % C + CT')
		.elasticY(true)
		.group(ctByQ)
		.barPadding(0.1)
		.outerPadding(1)
		.ordinalColors(['steelblue'])
		.chartGroup('g1');

	var chart2 = dc.barChart('#chart2');

	chart2.width(480)
		.height(200)
		.x(d3.scaleBand([qDimension.bottom(1)[0].q, qDimension.top(1)[0].q]))
		.xUnits(dc.units.ordinal)
		.renderHorizontalGridLines(true)
		.dimension(qDimension)
		.gap(56)
		.xAxisLabel('Question')
		.yAxisLabel('Acc % D + DT')
		.elasticY(true)
		.group(dtByQ)
		.barPadding(0.1)
		.outerPadding(1)
		.ordinalColors(['darkorange'])
		.chartGroup('g1');

	let qTipoAnoDimension = facts2.dimension(function(d){
		return [+d.q,d.tipo,d.ano];
	});

	let ctByQTipoAno = qTipoAnoDimension.group().reduceSum(function(d){
		return (d.ct+d.c);
	});

	let dtByQTipoAno = qTipoAnoDimension.group().reduceSum(function(d){
		return (d.dt+d.d);
	});

	let qDimension2 = facts2.dimension(function(d){
		return +d.q;
	});

	smenu3
		.dimension(qDimension2)
		.group(qDimension2.group())
		.multiple(true)
		.controlsUseVisibility(false)
		.title(function(d){
			return d.key;
		})
		.chartGroup('g2');
	  
	var colors = d3.scaleOrdinal(d3.schemePaired);
	var chart3 = dc.seriesChart('#chart3');

	chart3.width(800)
		.height(150)
		.dimension(qTipoAnoDimension)
		.chart(function(c) { 
			return dc.lineChart(c).curve(d3.curveLinear).evadeDomainFilter(true)
			.renderDataPoints({fillOpacity: 0.01, strokeOpacity: 1, radius: 2	}); 
			})
		.x(d3.scaleOrdinal().domain(d3.extent(data, function(d) { return +d.ano; })))
		.xAxisLabel('Year')
		.yAxisLabel('% CT + C')
		.group(ctByQTipoAno)
		.elasticY(true)
		.brushOn(false)
		.seriesAccessor(function(d) { return[ d.key[0],d.key[1]]; })
		.keyAccessor(function(d) { return d.key[2]; })
		.valueAccessor(function(d) { return d.value; })
		.colors(function(d) {
			return colors(d.split(',')[0]);})
		.title(function(d){
			return d.key[1];
		})
		.chartGroup('g2');

	var chart4 = dc.seriesChart('#chart4');
	  //console.log([''].concat(d3.extent(data, function(d) { return +d.ano; })).concat(['']));

	chart4.width(800)
		.height(150)
		.dimension(qTipoAnoDimension)
		.chart(function(c) { 
			return dc.lineChart(c).curve(d3.curveLinear).evadeDomainFilter(true); 
			})
		.x(d3.scaleOrdinal().domain(d3.extent(data, function(d) { return +d.ano; })))
		.xAxisLabel('Year')
		.yAxisLabel('% DT + D')
		.group(dtByQTipoAno)
		.elasticY(true)
		.brushOn(false)    
		.seriesAccessor(function(d) { return [d.key[0],d.key[1]]; })
		.keyAccessor(function(d) { return d.key[2]; })
		.valueAccessor(function(d) { return d.value; })
		.colors(function(d) {
			return colors(d.split(',')[0]);})
		.title(function(d){
			return d.key[1];
		})
		.chartGroup('g2');

	var chart5 = dc.scatterPlot('#chart5');

	let extDimension = facts.dimension(function(d){
		return [d.ct+d.c,d.dt+d.d,d.q,d.ano,d.tipo];
	});

	chart5
		.width(960)
		.height(200)
		.x(d3.scaleLinear().domain(d3.extent(data, function(d) { return +d.ct+d.c; })))
		.brushOn(false)
		.symbolSize(8)
		.renderHorizontalGridLines(true)
		.renderVerticalGridLines(true)
		.clipPadding(10)
		.xAxisLabel('CT+C')
		.yAxisLabel('DT+D')
		.dimension(extDimension)
		.title(function(d){
			return `Question ${d.key[2]}, year ${d.key[3]}, ${d.key[4]}`;
		})
		.symbol(function(d){
			return d3.symbolDiamond;
		})
		.group(extDimension.group())
		.chartGroup('g1');
		  
	let dumDimension = facts.dimension(function(d){
		return [d.ct+d.c,d.q,d.ano,d.tipo];
	});

	// Render the Charts
	dc.renderAll('g1');
	dc.renderAll('g2');
	qTable.render();

	d3.selectAll('option:not(.dc-select-option)').attr('disabled','disabled').attr('hidden','hidden');

	smenu.onChange(tipos[0]);
	smenu2.onChange(anos[0]);
	smenu3.onChange(1);
	d3.select('#chart5').selectAll('path.symbol').style('fill','rgb(0,0,0)');

	d3.selectAll('g.dc-tooltip-list').select('g.dc-tooltip').each(function(d){
		let g = d3.select(this);
		let x, y, c, n, t, q;
		g.selectAll('circle.dot').each(function(d){
			q = d.data.key[0];
			n = d3.select(this).node();
			x = n.getAttribute('cx');
			y = n.getAttribute('cy');
			c = n.getAttribute('fill');
			t = d3.select(this).select('title').html();
			g.append('path').attr('class','symbol side_'+x).attr('transform',`translate(${x},${y})`)
			 .style('fill',`${c}`).attr('d',function(d){
				 if(t==='discente'){
					 t = 'Discente';
					 return 'M0,-7.444838872816797L4.298279727294168,0L0,7.444838872816797L-4.298279727294168,0Z';
				 }
				 t = 'Docente';
				 return 'M4.51351666838205,0A4.51351666838205,4.51351666838205,0,1,1,-4.51351666838205,0A4.51351666838205,4.51351666838205,0,1,1,4.51351666838205,0'
			 })
			 .append('title').text(t + ', Questão '+q);
		})
	});

  	// Select first option
  	d3.select('#smenu3')
	  	.each(function(d) {
		  	n = d3.select(this);
		  	n.selectAll('input[type=checkbox]')
			  	.each(function(d, i) {
				  	cb = d3.select(this).node();
				  	if (i==0) {
					  	cb.checked = true;
				  	} else {
					  	cb.checked = false;
				  	}
			  	})
	  	});

	d3.select('#smenu3')
		.select('select').node().style.height = '200px';

	// Remove reset button
	d3.select('#smenu3')
		.select('input[type=reset]')
		.remove();

	chart3.on('renderlet',function(d){
		d3.selectAll('g.dc-tooltip-list').select('g.dc-tooltip').each(function(d){
			let g = d3.select(this);
			let x, y, c, n;
			g.selectAll('circle.dot').each(function(d){
				n = d3.select(this).node();
				x = n.getAttribute('cx');
				y = n.getAttribute('cy');
				c = n.getAttribute('fill');
				g.select('path.side_'+x).attr('transform',`translate(${x},${y})`);
			})
		});
	});

	chart4.on('renderlet',function(d){
			d3.selectAll('g.dc-tooltip-list').select('g.dc-tooltip').each(function(d){
				let g = d3.select(this);
				let x, y, c, n;
				g.selectAll('circle.dot').each(function(d){
					n = d3.select(this).node();
					x = n.getAttribute('cx');
					y = n.getAttribute('cy');
					c = n.getAttribute('fill');
					g.select('path.side_'+x).attr('transform',`translate(${x},${y})`);
				})
		});
	});

  	var view;
  	vega.loader().load('chart7.json').then(function(specjson){
		spec = JSON.parse(specjson);
		view = new vega.View(vega.parse(spec))
			.renderer('svg')
			.initialize('#chart7')
			.hover()
			.signal('amount',anos.length)
			.insert('questions',data)
			.run();
		});
	});
}